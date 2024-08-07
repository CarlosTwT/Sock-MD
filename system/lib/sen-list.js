const chalk = require('chalk')
const fs = require('fs')

const ctext = (text, style = 1) => {
  var abc = 'abcdefghijklmnopqrstuvwxyz1234567890'.split('');
  var xyz = {
    1: 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀꜱᴛᴜᴠᴡxʏᴢ1234567890'
  };
  var replacer = [];
  abc.map((v, i) =>
    replacer.push({
      original: v,
      convert: xyz[style].split('')[i]
    })
  );
  var str = text.split('');
  var output = [];
  str.map((v) => {
    if (v.toUpperCase() !== v.toLowerCase() && v === v.toUpperCase()) {
      // Si el carácter está en mayúsculas, lo empujamos sin cambios
      output.push(v);
    } else {
      // Si el carácter es minúscula o no es una letra, búscalo y conviértelo
      const find = replacer.find((x) => x.original == v.toLowerCase());
      find ? output.push(find.convert) : output.push(v);
    }
  });
  return output.join('');
};

global.menuai = (prefix) => {
  return ctext(`   ${gris}「 I A 」${gris}   

  々${prefix}ia (best)
  々${prefix}openai
  々${prefix}gpt4
  々${prefix}tts
  々${prefix}text2img
  々${prefix}blackbox
  々${prefix}gemini
`);
};

global.menuanime = (prefix) => {
return ctext(`${gris}「 A N I M E 」${gris}

  々${prefix}waifu
  々${prefix}neko
`)}

global.menudatabase = (prefix) => {
return ctext(`${gris}「 D A T A B A S E 」${gris}

  々${prefix}ping
  々${prefix}profile @tag
  々${prefix}serverinfo
  々${prefix}get >url
  々${prefix}ccgenerator 
  々${prefix}runtime
`)}

global.menudownload = (prefix) => {
return ctext(`${gris}「 D O W N L O A D 」${gris}

  々${prefix}ytmp4
  々${prefix}whatmusic
  々${prefix}ytmp3
  々${prefix}tiktok
  々${prefix}fb >video 
  々${prefix}threads
  々${prefix}spotify
  々${prefix}play
`)}


global.menugroup = (prefix) => {
return ctext(`${gris}「 G R O U P 」${gris}

  々${prefix}getcontact
  々${prefix}totag
  々${prefix}fakechat @|txt|txt
  々${prefix}linkgroup
  々${prefix}linkgc
  々${prefix}resetlinkgc
  々${prefix}sendlinkgc
  々${prefix}kick @
  々${prefix}promote @
  々${prefix}demote @
  々${prefix}hidetag
  々${prefix}tagall
`)}

global.menuother = (prefix) => {
return ctext(`${gris}「 O T H E R 」${gris}

  々${prefix}sc
  々${prefix}pvp >vs bot   
  々${prefix}owner
  々${prefix}licencia
  々${prefix}afk
  々${prefix}limit
  々${prefix}clima
  々${prefix}comicslogo
`)}

global.menuowner = (prefix) => {
return ctext(`${gris}「 O W N E R 」${gris}

  々${prefix}pushcontact2
  々${prefix}pushcontact
  々${prefix}getidgc
  々${prefix}join
  々${prefix}addgc
  々${prefix}delgc
  々${prefix}backup
  々${prefix}getcase
  々${prefix}biochange
  々${prefix}autobio
  々${prefix}public
  々${prefix}self
  々${prefix}bcgc
  々${prefix}bcgroup
  々${prefix}restart
  々${prefix}delcase
  々${prefix}addcase
`)}

global.menusearch = (prefix) => {
return ctext(`${gris}「 S E A R C H 」${gris}

  々${prefix}pinterest
  々${prefix}igstalk >user
  々${prefix}leerqr >imagen
  々${prefix}pin
  々${prefix}tiktoksearch 
  々${prefix}play
`)}

global.menustickanim = (prefix) => {
return ctext(`${gris}「 S T I C K E R S 」${gris}

  々${prefix}kill
  々${prefix}pat
  々${prefix}lick
  々${prefix}bite
  々${prefix}yeet
  々${prefix}bonk
  々${prefix}wink
  々${prefix}poke
  々${prefix}nom
  々${prefix}slap
  々${prefix}smile
  々${prefix}wave
  々${prefix}blush
  々${prefix}smugh
  々${prefix}glomp
  々${prefix}happy
  々${prefix}dance
  々${prefix}cringe
  々${prefix}highfive
  々${prefix}handhold
`)}

global.menutools = (prefix) => {
return ctext(`${gris}「 T O O L S 」${gris}

  々${prefix}hd
  々${prefix}ssweb
  々${prefix}ssfull
  々${prefix}toimg
  々${prefix}toaud
  々${prefix}tomp3
  々${prefix}circlevideo
  々${prefix}tovn
  々${prefix}tourl
  々${prefix}shortlink
  々${prefix}sticker
  々${prefix}smeme
  々${prefix}wm
  々${prefix}letra
  々${prefix}gitclone
`)}

global.endmenu = (prefix) => {
return ctext(`${gris}「 S O C K - A I 」${gris}

➣  ║▌│█║▌│ █║▌│█│║▌║
➣  ║▌│█║▌│ █║▌│█│║▌║

➣ Copyright © ঔৣ͜͡Ⓒ乂 Sock AI WhatsApp - Bot 愛 2024
`)}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update'${__filename}'`))
	delete require.cache[file]
	require(file)
})