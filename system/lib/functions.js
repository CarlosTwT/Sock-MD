const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const mime = require('mime-types')
const chalk = require('chalk')
const path = require('path')
const FormData = require('form-data')
const { fromBuffer } = require('file-type')
const { green, blueBright, redBright } = require('chalk')
const { tmpdir } = require('os')
const moment = require('moment-timezone')
moment.tz.setDefault(global.timezone)
const Stream = require('stream');
const Readable = Stream.Readable;
global.fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const NodeID3 = require('node-id3')
const {
   read,
   MIME_JPEG,
   RESIZE_BILINEAR,
   AUTO
} = require('jimp')

   /* Delay
    * @param {Integer} time
    */
   delay = time => new Promise(res => setTimeout(res, time))

   /* Image Resizer for Thumbnail
    * @param {String|Buffer} source
    */
   createThumb = async (source) => {
      let {
         file
      } = await this.getFile(source)
      let jimp = await read(await this.fetchBuffer(file))
      let buff = await jimp
         .quality(100)
         .resize(200, AUTO, RESIZE_BILINEAR)
         .getBufferAsync(MIME_JPEG)
      return buff
   }

   /* URL Validator
    * @param {String} url
    */
   isUrl = (url) => {
      return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%.+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%+.~#?&/=]*)/, 'gi'))
   }

   /* Fetching JSON
    * @param {String} url
    * @param {Object} head
    */
   fetchJson = async (url, options = {}) => {
      try {
         const result = await (await fetch(url, {
            headers: options
         })).json()
         return result
      } catch (e) {
         return ({
            status: false,
            msg: `System cannot detect JSON!`
         })
      }
   }

   /* Converting to Buffer
    * @param {String|Buffer} file
    * @param {Object} options
    */
   fetchBuffer = async (file, options = {}) => {
      return new Promise(async (resolve, reject) => {
         try {
            if (this.isUrl(file)) {
               let buff = await (await axios.get(file, { responseType: "arraybuffer", headers: options })).data
               resolve(buff)
            } else {
               let buff = fs.readFileSync(file)
               resolve(buff)
            }
         } catch (e) {
            return ({
               status: false,
               msg: `System cannot detect Buffer!`
            })
         }
      })
   }
   
   /* Parse Cookie
    * @param {String} url
    * @param {Object} options
    */
   parseCookie = async (file, options = {}) => {
      return new Promise(async (resolve, reject) => {
         try {
            let cookie = await (await axios.get(file, { responseType: "arraybuffer", headers: options })).headers['set-cookie']
            resolve(cookie)
         } catch (e) {
            return ({
               status: false,
               msg: e.message
            })
         }
      })
   }

   /* Audio Metadata
    * @param {String|Buffer} source
    * @param {Object} tags 
    */
   metaAudio = (source, tags = {}) => {
      return new Promise(async (resolve) => {
         try {
            let {
               status,
               file,
               mime
            } = await this.getFile(await this.fetchBuffer(source))
            if (!status) return resolve({
               status: false
            })
            if (!/audio/.test(mime)) return resolve({
               status: true,
               file
            })
            NodeID3.write(tags, await this.fetchBuffer(file), function(err, buffer) {
               if (err) return resolve({
                  status: false
               })
               fs.writeFileSync(file, buffer)
               resolve({
                  status: true,
                  file
               })
            })
         } catch (e) {
            console.log(e)
            resolve({
               status: false
            })
         }
      })
   }

   /* Text Style
    * @param {String} type
    * @param {String} text
    */
   texted = (type, text) => {
      switch (type) {
         case 'bold':
            return '*' + text + '*'
            break
         case 'italic':
            return '_' + text + '_'
            break
         case 'monospace':
            return '```' + text + '```'
      }
   }

   /* Example Format
    * @param {String} isPrefix
    * @param {String} command
    * @param {String} args
    */
   example = (isPrefix, command, args) => {
      return `• ${this.texted('bold', 'Example')} : ${isPrefix + command} ${args}`
   }

   /* Fix Instagram URL
    * @param {String} url
    */
   igFixed = (url) => {
      let count = url.split('/')
      if (count.length == 7) {
         let username = count[3]
         let destruct = this.removeItem(count, username)
         return destruct.map(v => v).join('/')
      } else return url
   }

   /* Fix Tiktok URL
    * @param {String} url
    */
   ttFixed = (url) => {
      if (!url.match(/(tiktok.com\/t\/)/g)) return url
      let id = url.split('/t/')[1]
      return 'https://vm.tiktok.com/' + id
   }

   /* Time Format
    * @param {Integer} ms
    */
   toTime = (ms) => {
      let h = Math.floor(ms / 3600000)
      let m = Math.floor(ms / 60000) % 60
      let s = Math.floor(ms / 1000) % 60
      return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
   }
   
   /* Readable Time
    * @param {Integer} ms
    */
   readTime = (ms) => {
      const days = Math.floor(ms / (24 * 60 * 60 * 1000))
      const daysms = ms % (24 * 60 * 60 * 1000)
      const hours = Math.floor(daysms / (60 * 60 * 1000))
      const hoursms = ms % (60 * 60 * 1000)
      const minutes = Math.floor(hoursms / (60 * 1000))
      const minutesms = ms % (60 * 1000)
      const sec = Math.floor(minutesms / 1000)
      const format = [days, hours, minutes, sec].map(v => v.toString().padStart(2, 0))
      return {
         days: Number(format[0]),
         hours: Number(format[1]),
         minutes: Number(format[2]),
         seconds: Number(format[3])
      }
   }

   /* Random Filename
    * @param {String} extension
    */
   filename = (extension) => {
      return `${Math.floor(Math.random() * 10000)}.${extension}`
   }

   /* Create UUID */
   uuid = () => {
      var dt = new Date().getTime()
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
         var r = (dt + Math.random() * 16) % 16 | 0;
         var y = Math.floor(dt / 16);
         return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
      return uuid
   }

   /* Random Element From Array
    * @param {Array} list
    */
   random = (list) => {
      return list[Math.floor(Math.random() * list.length)]
   }

   /* Random Number
    * @param {Integer} min
    * @param {Integer} max
    */
   randomInt = (min, max) => {
      min = Math.ceil(min)
      max = Math.floor(max)
      return Math.floor(Math.random() * (max - min + 1)) + min
   }

   /* Format Number \w Dot
    * @param {Integer} integer
    */
   formatter = (integer) => {
      let numb = parseInt(integer)
      return Number(numb).toLocaleString().replace(/,/g, '.')
   }

   formatNumber = (integer) => {
      let numb = parseInt(integer)
      return Number(numb).toLocaleString().replace(/,/g, '.')
   }

   /* H2K Format
    * @param {Integer} integer
    */
   h2k = (integer) => {
      let numb = parseInt(integer)
      return new Intl.NumberFormat('en-US', {
         notation: 'compact'
      }).format(numb)
   }

   /* To Readable Size
    * @param {Integer} size
    */
   formatSize = (size) => {
      function round(value, precision) {
         var multiplier = Math.pow(10, precision || 0)
         return Math.round(value * multiplier) / multiplier
      }
      var megaByte = 1024 * 1024
      var gigaByte = 1024 * megaByte
      var teraByte = 1024 * gigaByte
      if (size < 1024) {
         return size + ' B'
      } else if (size < megaByte) {
         return round(size / 1024, 1) + ' KB'
      } else if (size < gigaByte) {
         return round(size / megaByte, 1) + ' MB'
      } else if (size < teraByte) {
         return round(size / gigaByte, 1) + ' GB'
      } else {
         return round(size / teraByte, 1) + ' TB'
      }
      return ''
   }

   /* Fix Instagram URL
    * @param {String|Integer} str
    */
   getSize = async (str) => {
      if (!isNaN(str)) return this.formatSize(str)
      let header = await (await axios.get(str)).headers
      return this.formatSize(header['content-length'])
   }

   /* Download File To /tmp Folder
    * @param {String|Buffer} source
    * @param {String} filename
    * @param {String} referer
    */
    
    isReadableStream = (stream) => {
	if (typeof Stream.isReadable === 'function') return Stream.isReadable(stream)
	if (stream && stream[kIsReadable] != null) return stream[kIsReadable];
	if (typeof stream?.readable !== 'boolean') return null;
	if (isDestroyed(stream)) return false;
	return (
		isReadableNodeStream(stream) &&
		!!stream.readable &&
		!isReadableFinished(stream)
	) || stream instanceof fs.ReadStream || stream instanceof Readable;
}
    
   getFile = (source, filename, options) => {
      return new Promise(async (resolve) => {
         try {
            if (Buffer.isBuffer(source)) {
               let ext, mime
               try {
                  mime = await (await fromBuffer(source)).mime
                  ext = await (await fromBuffer(source)).ext
               } catch {
                  mime = require('mime-types').lookup(filename ? filename.split`.` [filename.split`.`.length - 1] : 'txt')
                  ext = require('mime-types').extension(mime)
               }
               let extension = filename ? filename.split`.` [filename.split`.`.length - 1] : ext
               let size = Buffer.byteLength(source)
               let filepath = 'temp/' + (this.uuid() + '.' + ext)
               let file = fs.writeFileSync(filepath, source)
               let name = filename || path.basename(filepath)
               let data = {
                  status: true,
                  file: filepath,
                  filename: name,
                  mime: mime,
                  extension: ext,
                  size: this.formatSize(size),
                  bytes: size
               }
               return resolve(data)
            } else if (source.startsWith('./') || source.startsWith('/')) {
               let ext, mime
               try {
                  mime = await (await fromBuffer(source)).mime
                  ext = await (await fromBuffer(source)).ext
               } catch {
                  mime = require('mime-types').lookup(filename ? filename.split`.` [filename.split`.`.length - 1] : 'txt')
                  ext = require('mime-types').extension(mime)
               }
               let extension = filename ? filename.split`.` [filename.split`.`.length - 1] : ext
               let size = fs.statSync(source).size
               let name = filename || path.basename(source)
               let data = {
                  status: true,
                  file: source,
                  filename: name,
                  mime: mime,
                  extension: ext,
                  size: this.formatSize(size),
                  bytes: size
               }
               return resolve(data)
            } else {
               axios.get(source, {
                  responseType: 'stream',
                  ...options
               }).then(async (response) => {
                  let extension = filename ? filename.split`.` [filename.split`.`.length - 1] : mime.extension(response.headers['content-type'])
                  let file = fs.createWriteStream(`temp/${this.uuid() + '.' + extension}`)
                  let name = filename || path.basename(file.path)
                  response.data.pipe(file)
                  file.on('finish', async () => {
                     let data = {
                        status: true,
                        file: file.path,
                        filename: name,
                        mime: mime.lookup(file.path),
                        extension: extension,
                        size: this.formatSize(response.headers['content-length'] ? response.headers['content-length'] : 0),
                        bytes: response.headers['content-length'] ? response.headers['content-length'] : 0
                     }
                     resolve(data)
                     file.close()
                  })
               })
            }
         } catch (e) {
            console.log(e)
            resolve({
               status: false
            })
         }
      })
   }

   /* Generate Color
    * @param {String} text
    * @param {String} color
    */
   color = (text, color) => {
      return chalk.keyword(color || 'green').bold(text)
   }

   /* Get Message Type
    * @param {String|Object} data
    */
   mtype = (data) => {
      function replaceAll(str) {
         let res = str.replace(new RegExp('```', 'g'), '')
            .replace(new RegExp('_', 'g'), '')
            .replace(new RegExp(/[*]/, 'g'), '')
         return res
      }
      let type = (typeof data.text !== 'object') ? replaceAll(data.text) : ''
      return type
   }

   /* Size Limitation
    * @param {String} str
    * @param {Integer} max
    */
   sizeLimit = (str, max) => {
      let data
      if (str.match('G') || str.match('GB') || str.match('T') || str.match('TB')) return data = {
         oversize: true
      }
      if (str.match('M') || str.match('MB')) {
         let first = str.replace(/MB|M|G|T/g, '').trim()
         if (isNaN(first)) return data = {
            oversize: true
         }
         if (first > max) return data = {
            oversize: true
         }
         return data = {
            oversize: false
         }
      } else {
         return data = {
            oversize: false
         }
      }
   }

   /* Link Extractor
    * @param {String} text
    */
   generateLink = (text) => {
      let regex = /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/gi;
      return text.match(regex)
   }

   /* File Reloader
    * @param {String} file
    */
   reload = (file) => {
      fs.watchFile(file, () => {
         fs.unwatchFile(file)
         console.log(redBright.bold('[ UPDATE ]'), blueBright(moment(new Date() * 1).format('DD/MM/YY HH:mm:ss')), green.bold('~ ' + path.basename(file)))
         delete require.cache[file]
         require(file)
      })
   }

   /* Print JSON
    * @param {Object} obj
    */
   jsonFormat = (obj) => {
      try {
         let print = (obj && (obj.constructor.name == 'Object' || obj.constructor.name == 'Array')) ? require('util').format(JSON.stringify(obj, null, 2)) : require('util').format(obj)
         return print
      } catch {
         return require('util').format(obj)
      }
   }

   /* Ucword Format
    * @param {String} str
    */
   ucword = (str) => {
      return (str + '').replace(/^([a-z])|\s+([a-z])/g, function($1) {
         return $1.toUpperCase();
      })
   }

   /* Next Level Array Concat 
    * @param {Array} arr
    */
   arrayJoin = (arr) => {
      var construct = []
      for (var i = 0; i < arr.length; i++) construct = construct.concat(arr[i])
      return construct
   }

   /* Remove Element Form Array
    * @param {Array} arr
    * @param {String} value
    */
   removeItem = (arr, value) => {
      let index = arr.indexOf(value)
      if (index > -1) arr.splice(index, 1)
      return arr
   }

Styles = (text, style = 1) => {
   var xStr = 'abcdefghijklmnopqrstuvwxyz1234567890'.split('')
   var yStr = Object.freeze({
      1: 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘqʀꜱᴛᴜᴠᴡxʏᴢ1234567890'
   })
   var replacer = []
   xStr.map((v, i) => replacer.push({
      original: v,
      convert: yStr[style].split('')[i]
   }))
   var str = text.toLowerCase().split('')
   var output = []
   str.map(v => {
      const find = replacer.find(x => x.original == v)
      find ? output.push(find.convert) : output.push(v)
   })
   return output.join('')
}
   /* Hitstat
    * @param {String} cmd
    * @param {String} who
    */
      hitstat = (cmd, who) => {
      if (/bot|help|menu|stat|hitstat|hitdaily/.test(cmd)) return
      if (typeof global.db == 'undefined') return
      if (!global.db.statistic[cmd]) {
      global.db.statistic[cmd] = {
       hitstat: 1,
       today: 1,
       lasthit: new Date * 1,
       sender: who.split`@` [0]
        }
        } else {
         global.db.statistic[cmd].hitstat += 1
         global.db.statistic[cmd].today += 1
         global.db.statistic[cmd].lasthit = new Date * 1
         global.db.statistic[cmd].sender = who.split`@` [0]
         }
         }

   /* Socmed Link Validator
    * @param {String} url
    */
   socmed = (url) => {
      const regex = [
         /^(?:https?:\/\/(web\.|www\.|m\.)?(facebook|fb)\.(com|watch)\S+)?$/,
         /^(?:https?:\/\/)?(?:www\.)?(?:instagram\.com\/)(?:tv\/|p\/|reel\/)(?:\S+)?$/,
         /^(?:https?:\/\/)?(?:www\.)?(?:instagram\.com\/)(?:stories\/)(?:\S+)?$/,
         /^(?:https?:\/\/)?(?:www\.)?(?:instagram\.com\/)(?:s\/)(?:\S+)?$/,
         /^(?:https?:\/\/)?(?:www\.)?(?:mediafire\.com\/)(?:\S+)?$/,
         /pin(?:terest)?(?:\.it|\.com)/,
         /^(?:https?:\/\/)?(?:www\.|vt\.|vm\.|t\.)?(?:tiktok\.com\/)(?:\S+)?$/,
         /http(?:s)?:\/\/(?:www\.|mobile\.)?twitter\.com\/([a-zA-Z0-9_]+)/,
         /^(?:https?:\/\/)?(?:www\.|m\.|music\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/,
         /^(?:https?:\/\/)?(?:podcasts\.)?(?:google\.com\/)(?:feed\/)(?:\S+)?$/
      ]
      return regex.some(v => url.match(v))
   }

   /* Did You Mean ??
    * @param {String} string
    * @param {Array} array
    * @param {String|Object} options
    */
   matcher = (string, array, options) => {
      function levenshtein(value, other, insensitive) {
         var cache = []
         var codes = []
         var length
         var lengthOther
         var code
         var result
         var distance
         var distanceOther
         var index
         var indexOther

         if (value === other) {
            return 0
         }

         length = value.length
         lengthOther = other.length

         if (length === 0) {
            return lengthOther
         }

         if (lengthOther === 0) {
            return length
         }

         if (insensitive) {
            value = value.toLowerCase()
            other = other.toLowerCase()
         }

         index = 0

         while (index < length) {
            codes[index] = value.charCodeAt(index)
            cache[index] = ++index
         }

         indexOther = 0

         while (indexOther < lengthOther) {
            code = other.charCodeAt(indexOther)
            result = distance = indexOther++
            index = -1

            while (++index < length) {
               distanceOther = code === codes[index] ? distance : distance + 1
               distance = cache[index]
               cache[index] = result =
                  distance > result ?
                  distanceOther > result ?
                  result + 1 :
                  distanceOther :
                  distanceOther > distance ?
                  distance + 1 :
                  distanceOther
            }
         }
         return result
      }

      function similarity(a, b, options) {
         var left = a || ''
         var right = b || ''
         var insensitive = !(options || {}).sensitive
         var longest = Math.max(left.length, right.length)
         return ((longest === 0 ?
            1 :
            (longest - levenshtein(left, right, insensitive)) / longest) * 100).toFixed(1)
      }

      let data = []
      let isArray = array.constructor.name == 'Array' ? array : [array] || []
      isArray.map(v => data.push({
         string: v,
         accuracy: similarity(string, v)
      }))
      return data
   }

   /* Miliseconds to Date
    * @param {Integer} ms
    */
   toDate = (ms) => {
      let temp = ms
      let days = Math.floor(ms / (24 * 60 * 60 * 1000));
      let daysms = ms % (24 * 60 * 60 * 1000);
      let hours = Math.floor((daysms) / (60 * 60 * 1000));
      let hoursms = ms % (60 * 60 * 1000);
      let minutes = Math.floor((hoursms) / (60 * 1000));
      let minutesms = ms % (60 * 1000);
      let sec = Math.floor((minutesms) / (1000));
      if (days == 0 && hours == 0 && minutes == 0) {
         return "Recently"
      } else {
         return days + "D " + hours + "H " + minutes + "M";
      }
   }

   /* Time Formater
    * @param {Integer} value
    */
   timeFormat = (value) => {
      const sec = parseInt(value, 10)
      let hours = Math.floor(sec / 3600)
      let minutes = Math.floor((sec - (hours * 3600)) / 60)
      let seconds = sec - (hours * 3600) - (minutes * 60)
      if (hours < 10) hours = '0' + hours
      if (minutes < 10) minutes = '0' + minutes
      if (seconds < 10) seconds = '0' + seconds
      if (hours == parseInt('00')) return minutes + ':' + seconds
      return hours + ':' + minutes + ':' + seconds
   }

   switcher = (status, isTrue, isFalse) => {
      return (status) ? this.texted('bold', isTrue) : this.texted('bold', isFalse)
   }

   /* Random ID
    * @param {Integer} length
    */
   makeId = (length) => {
      var result = ''
      var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      var charactersLength = characters.length
      for (var i = 0; i < length; i++) {
         result += characters.charAt(Math.floor(Math.random() * charactersLength))
      }
      return result
   }

   /* Timeout
    * @param {Integer} ms
    */
   timeReverse = (duration) => {
      let milliseconds = parseInt((duration % 1000) / 100),
         seconds = Math.floor((duration / 1000) % 60),
         minutes = Math.floor((duration / (1000 * 60)) % 60),
         hours = Math.floor((duration / (1000 * 60 * 60)) % 24),
         days = Math.floor(duration / (24 * 60 * 60 * 1000))
      let hoursF = (hours < 10) ? "0" + hours : hours
      let minutesF = (minutes < 10) ? "0" + minutes : minutes
      let secondsF = (seconds < 10) ? "0" + seconds : seconds
      let daysF = (days < 10) ? "0" + days : days
      // return hours + " Jam " + minutes + " Menit" + seconds + " Detik" + milliseconds;
      return daysF + "D " + hoursF + "H " + minutesF + "M"
   }

   /* Timeout
    * @param ()
    */
   greeting = () => {
      let time = moment.tz(global.timezone).format('HH')
      let res = `Don't forget to sleep`
      if (time >= 3) res = `Good Evening`
      if (time > 6) res = `Good Morning`
      if (time >= 11) res = `Good Afternoon`
      if (time >= 18) res = `Good Night`
      return res
   }

   /* Random JSON From File
    * @param ()
    */
   jsonRandom = (file) => {
      let json = JSON.parse(fs.readFileSync(file))
      return json[Math.floor(Math.random() * json.length)]
   }

   /* Leveling
    * @param {Integer} xp
    * @param {Integer} multiplier
    */
   level = (xp, multiplier = 5) => {
      var XPAsli = xp
      var level = 1
      while (xp > 1) {
         xp /= multiplier
         if (xp < 1) {
            level == level
         } else {
            level += 1
         }
      }
      var XPLevel = 1
      while (XPAsli >= XPLevel) {
         XPLevel = XPLevel + XPLevel
      }
      var sisaXP = XPLevel - XPAsli
      if (sisaXP == 0) sisaXP = XPLevel + XPLevel
      let kurang = XPLevel - sisaXP
      return [level, XPLevel, sisaXP, kurang]
   }

   /* Roles
    * @param {Integer} level
    */
   role = (level) => {
      let roles = '-'
      if (level <= 2) {
         roles = 'Newbie ㋡'
      } else if (level <= 4) {
         roles = 'Beginner Grade 1 ⚊¹'
      } else if (level <= 6) {
         roles = 'Beginner Grade 2 ⚊²'
      } else if (level <= 8) {
         roles = 'Beginner Grade 3 ⚊³'
      } else if (level <= 10) {
         roles = 'Beginner Grade 4 ⚊⁴'
      } else if (level <= 12) {
         roles = 'Private Grade 1 ⚌¹'
      } else if (level <= 14) {
         roles = 'Private Grade 2 ⚌²'
      } else if (level <= 16) {
         roles = 'Private Grade 3 ⚌³'
      } else if (level <= 18) {
         roles = 'Private Grade 4 ⚌⁴'
      } else if (level <= 20) {
         roles = 'Private Grade 5 ⚌⁵'
      } else if (level <= 22) {
         roles = 'Corporal Grade 1 ☰¹'
      } else if (level <= 24) {
         roles = 'Corporal Grade 2 ☰²'
      } else if (level <= 26) {
         roles = 'Corporal Grade 3 ☰³'
      } else if (level <= 28) {
         roles = 'Corporal Grade 4 ☰⁴'
      } else if (level <= 30) {
         roles = 'Corporal Grade 5 ☰⁵'
      } else if (level <= 32) {
         roles = 'Sergeant Grade 1 ≣¹'
      } else if (level <= 34) {
         roles = 'Sergeant Grade 2 ≣²'
      } else if (level <= 36) {
         roles = 'Sergeant Grade 3 ≣³'
      } else if (level <= 38) {
         roles = 'Sergeant Grade 4 ≣⁴'
      } else if (level <= 40) {
         roles = 'Sergeant Grade 5 ≣⁵'
      } else if (level <= 42) {
         roles = 'Staff Grade 1 ﹀¹'
      } else if (level <= 44) {
         roles = 'Staff Grade 2 ﹀²'
      } else if (level <= 46) {
         roles = 'Staff Grade 3 ﹀³'
      } else if (level <= 48) {
         roles = 'Staff Grade 4 ﹀⁴'
      } else if (level <= 50) {
         roles = 'Staff Grade 5 ﹀⁵'
      } else if (level <= 52) {
         roles = 'Sergeant Grade 1 ︾¹'
      } else if (level <= 54) {
         roles = 'Sergeant Grade 2 ︾²'
      } else if (level <= 56) {
         roles = 'Sergeant Grade 3 ︾³'
      } else if (level <= 58) {
         roles = 'Sergeant Grade 4 ︾⁴'
      } else if (level <= 60) {
         roles = 'Sergeant Grade 5 ︾⁵'
      } else if (level <= 62) {
         roles = '2nd Lt. Grade 1 ♢¹ '
      } else if (level <= 64) {
         roles = '2nd Lt. Grade 2 ♢²'
      } else if (level <= 66) {
         roles = '2nd Lt. Grade 3 ♢³'
      } else if (level <= 68) {
         roles = '2nd Lt. Grade 4 ♢⁴'
      } else if (level <= 70) {
         roles = '2nd Lt. Grade 5 ♢⁵'
      } else if (level <= 72) {
         roles = '1st Lt. Grade 1 ♢♢¹'
      } else if (level <= 74) {
         roles = '1st Lt. Grade 2 ♢♢²'
      } else if (level <= 76) {
         roles = '1st Lt. Grade 3 ♢♢³'
      } else if (level <= 78) {
         roles = '1st Lt. Grade 4 ♢♢⁴'
      } else if (level <= 80) {
         roles = '1st Lt. Grade 5 ♢♢⁵'
      } else if (level <= 82) {
         roles = 'Major Grade 1 ✷¹'
      } else if (level <= 84) {
         roles = 'Major Grade 2 ✷²'
      } else if (level <= 86) {
         roles = 'Major Grade 3 ✷³'
      } else if (level <= 88) {
         roles = 'Major Grade 4 ✷⁴'
      } else if (level <= 90) {
         roles = 'Major Grade 5 ✷⁵'
      } else if (level <= 92) {
         roles = 'Colonel Grade 1 ✷✷¹'
      } else if (level <= 94) {
         roles = 'Colonel Grade 2 ✷✷²'
      } else if (level <= 96) {
         roles = 'Colonel Grade 3 ✷✷³'
      } else if (level <= 98) {
         roles = 'Colonel Grade 4 ✷✷⁴'
      } else if (level <= 100) {
         roles = 'Colonel Grade 5 ✷✷⁵'
      } else if (level <= 102) {
         roles = 'Brigadier Early ✰'
      } else if (level <= 104) {
         roles = 'Brigadier Silver ✩'
      } else if (level <= 106) {
         roles = 'Brigadier gold ✯'
      } else if (level <= 108) {
         roles = 'Brigadier Platinum ✬'
      } else if (level <= 110) {
         roles = 'Brigadier Diamond ✪'
      } else if (level <= 112) {
         roles = 'Major General Early ✰'
      } else if (level <= 114) {
         roles = 'Major General Silver ✩'
      } else if (level <= 116) {
         roles = 'Major General gold ✯'
      } else if (level <= 118) {
         roles = 'Major General Platinum ✬'
      } else if (level <= 120) {
         roles = 'Major General Diamond ✪'
      } else if (level <= 122) {
         roles = 'Lt. General Early ✰'
      } else if (level <= 124) {
         roles = 'Lt. General Silver ✩'
      } else if (level <= 126) {
         roles = 'Lt. General gold ✯'
      } else if (level <= 128) {
         roles = 'Lt. General Platinum ✬'
      } else if (level <= 130) {
         roles = 'Lt. General Diamond ✪'
      } else if (level <= 132) {
         roles = 'General Early ✰'
      } else if (level <= 134) {
         roles = 'General Silver ✩'
      } else if (level <= 136) {
         roles = 'General gold ✯'
      } else if (level <= 138) {
         roles = 'General Platinum ✬'
      } else if (level <= 140) {
         roles = 'General Diamond ✪'
      } else if (level <= 142) {
         roles = 'Commander Early ★'
      } else if (level <= 144) {
         roles = 'Commander Intermediate ⍣'
      } else if (level <= 146) {
         roles = 'Commander Elite ≛'
      } else if (level <= 148) {
         roles = 'The Commander Hero ⍟'
      } else if (level <= 152) {
         roles = 'Legends 忍'
      } else if (level <= 154) {
         roles = 'Legends 忍'
      } else if (level <= 156) {
         roles = 'Legends 忍'
      } else if (level <= 158) {
         roles = 'Legends 忍'
      } else if (level <= 160) {
         roles = 'Legends 忍'
      } else if (level <= 162) {
         roles = 'Legends 忍'
      } else if (level <= 164) {
         roles = 'Legends 忍'
      } else if (level <= 166) {
         roles = 'Legends 忍'
      } else if (level <= 168) {
         roles = 'Legends 忍'
      } else if (level <= 170) {
         roles = 'Legends 忍'
      } else if (level <= 172) {
         roles = 'Legends 忍'
      } else if (level <= 174) {
         roles = 'Legends 忍'
      } else if (level <= 176) {
         roles = 'Legends 忍'
      } else if (level <= 178) {
         roles = 'Legends 忍'
      } else if (level <= 180) {
         roles = 'Legends 忍'
      } else if (level <= 182) {
         roles = 'Legends 忍'
      } else if (level <= 184) {
         roles = 'Legends 忍'
      } else if (level <= 186) {
         roles = 'Legends 忍'
      } else if (level <= 188) {
         roles = 'Legends 忍'
      } else if (level <= 190) {
         roles = 'Legends 忍'
      } else if (level <= 192) {
         roles = 'Legends 忍'
      } else if (level <= 194) {
         roles = 'Legends 忍'
      } else if (level <= 196) {
         roles = 'Legends 忍'
      } else if (level <= 198) {
         roles = 'Legends 忍'
      } else if (level <= 200) {
         roles = 'Legends 忍'
      } else if (level <= 210) {
         roles = 'Legends 忍'
      } else if (level <= 220) {
         roles = 'Legends 忍'
      } else if (level <= 230) {
         roles = 'Legends 忍'
      } else if (level <= 240) {
         roles = 'Legends 忍'
      } else if (level <= 250) {
         roles = 'Legends 忍'
      } else if (level <= 260) {
         roles = 'Legends 忍'
      } else if (level <= 270) {
         roles = 'Legends 忍'
      } else if (level <= 280) {
         roles = 'Legends 忍'
      } else if (level <= 290) {
         roles = 'Legends 忍'
      } else if (level <= 300) {
         roles = 'Legends 忍'
      } else if (level <= 310) {
         roles = 'Legends 忍'
      } else if (level <= 320) {
         roles = 'Legends 忍'
      } else if (level <= 330) {
         roles = 'Legends 忍'
      } else if (level <= 340) {
         roles = 'Legends 忍'
      } else if (level <= 350) {
         roles = 'Legends 忍'
      } else if (level <= 360) {
         roles = 'Legends 忍'
      } else if (level <= 370) {
         roles = 'Legends 忍'
      } else if (level <= 380) {
         roles = 'Legends 忍'
      } else if (level <= 390) {
         roles = 'Legends 忍'
      } else if (level <= 400) {
         roles = 'Legends 忍'
      } else if (level <= 410) {
         roles = 'Legends 忍'
      } else if (level <= 420) {
         roles = 'Legends 忍'
      } else if (level <= 430) {
         roles = 'Legends 忍'
      } else if (level <= 440) {
         roles = 'Legends 忍'
      } else if (level <= 450) {
         roles = 'Legends 忍'
      } else if (level <= 460) {
         roles = 'Legends 忍'
      } else if (level <= 470) {
         roles = 'Legends 忍'
      } else if (level <= 480) {
         roles = 'Legends 忍'
      } else if (level <= 490) {
         roles = 'Legends 忍'
      } else if (level <= 500) {
         roles = 'Legends 忍'
      } else if (level <= 600) {
         roles = 'Legends 忍'
      } else if (level <= 700) {
         roles = 'Legends 忍'
      } else if (level <= 800) {
         roles = 'Legends 忍'
      } else if (level <= 900) {
         roles = 'Legends 忍'
      } else if (level <= 1000) {
         roles = 'Legends 忍'
      } else if (level <= 2000) {
         roles = 'Legends 忍'
      } else if (level <= 3000) {
         roles = 'Legends 忍'
      } else if (level <= 4000) {
         roles = 'Legends 忍'
      } else if (level <= 5000) {
         roles = 'Legends 忍'
      } else if (level <= 6000) {
         roles = 'Legends 忍'
      } else if (level <= 7000) {
         roles = 'Legends 忍'
      } else if (level <= 8000) {
         roles = 'Legends 忍'
      } else if (level <= 9000) {
         roles = 'Legends 忍'
      } else if (level <= 10000) {
         roles = 'Legends 忍'
      }
      return roles
   }
   
   /* Text Cutter
    * @param {String} text
    */
   filter = (text) => {
      if (text.length > 10) {
         return text.substr(text.length - 5)
      } else if (text.length > 7) {
         return text.substr(text.length - 4)
      } else if (text.length > 5) {
         return text.substr(text.length - 3)
      } else if (text.length > 2) {
         return text.substr(text.length - 2)
      } else if (text.length > 1) {
         return text.substr(text.length - 1)
      }
   }
   
   /* Random String
    * @param {String} text
    */
   randomString = (len, charSet) => {
      charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789/+=*-%$();?!#@';
      var randomString = '';
      for (var i = 0; i < len; i++) {
         var randomPoz = Math.floor(Math.random() * charSet.length);
         randomString += charSet.substring(randomPoz, randomPoz + 1);
      }
      return randomString
   }

   /* Remove Emoji
    * @param {String} string
    */
   removeEmojis = (string) => {
      var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
      return string.replace(regex, '')
   }

   /* Image Resizer
    * @param {Buffer} buffer
    * @param {Integer} x
    * @param {Integer} y
    */
   reSize = async (buffer, x, z) => {
      return new Promise(async (resolve, reject) => {
         var buff = await read(buffer)
         var ab = await buff.resize(x, z).getBufferAsync(MIME_JPEG)
         resolve(ab)
      })
   }

module.exports = {
  delay,
  createThumb,
  isUrl,
  fetchJson,
  fetchBuffer,
  parseCookie,
  metaAudio,
  texted,
  example,
  igFixed,
  ttFixed,
  toTime,
  readTime,
  filename,
  uuid,
  random,
  randomInt,
  formatter,
  formatNumber,
  h2k,
  formatSize,
  getSize,
  isReadableStream,
  getFile,
  color,
  mtype,
  sizeLimit,
  generateLink,
  reload,
  jsonFormat,
  ucword,
  arrayJoin,
  removeItem,
  Styles,
  hitstat,
  socmed,
  matcher,
  toDate,
  timeFormat,
  makeId,
  timeReverse,
  greeting,
  jsonRandom,
  level,
  role,
  filter,
  randomString,
  removeEmojis,
  reSize,
}