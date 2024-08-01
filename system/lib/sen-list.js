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
  return ctext(`

┃       「 *I A* 」   ┃

┌──⭓
  ${prefix}ia (best)
  ${prefix}openai
  ${prefix}gpt4
  ${prefix}tts
  ${prefix}text2img
  ${prefix}blackbox
  ${prefix}gemini
└───────⭓

`);
};

global.menuanime = (prefix) => {
return ctext(`「 *A N I M E* 」
┌──⭓
  ${prefix}waifu
  ${prefix}neko
└───────⭓`)}

global.menudatabase = (prefix) => {
return ctext(`「 *D A T A B A S E* 」
┌──⭓
  ${prefix}ping
  ${prefix}serverinfo
  ${prefix}get >url
  ${prefix}ccgenerator 
  ${prefix}runtime
└───────⭓`)}

global.menudownload = (prefix) => {
return ctext(`「 *D O W N L O A D* 」
┌──⭓
  ${prefix}ytmp4
  ${prefix}whatmusic
  ${prefix}ytmp3
  ${prefix}tiktok
  ${prefix}threads
  ${prefix}spotify
  ${prefix}play
└───────⭓`)}


global.menugroup = (prefix) => {
return ctext(`「 *G R O U P* 」
┌──⭓
  ${prefix}getcontact
  ${prefix}totag
  ${prefix}fakechat @|txt|txt
  ${prefix}event >txt|txt
  ${prefix}linkgroup
  ${prefix}linkgc
  ${prefix}resetlinkgc
  ${prefix}sendlinkgc
  ${prefix}kick @
  ${prefix}promote @
  ${prefix}demote @
  ${prefix}hidetag
  ${prefix}tagall
└───────⭓`)}

global.menuother = (prefix) => {
return ctext(`「 *O T H E R* 」
┌──⭓
  ${prefix}sc
  ${prefix}owner
  ${prefix}afk
  ${prefix}limit
  ${prefix}clima
  ${prefix}comicslogo
└───────⭓`)}

global.menuowner = (prefix) => {
return ctext(`「 *O W N E R* 」
┌──⭓
  ${prefix}resetlimit
  ${prefix}addlimit
  ${prefix}pushcontact2
  ${prefix}pushcontact
  ${prefix}getidgc
  ${prefix}join
  ${prefix}addgc
  ${prefix}delgc
  ${prefix}backup
  ${prefix}getcase
  ${prefix}biochange
  ${prefix}autobio
  ${prefix}readchange
  ${prefix}autoread
  ${prefix}public
  ${prefix}self
  ${prefix}addprem
  ${prefix}delprem
  ${prefix}listpremium
  ${prefix}listprem
  ${prefix}bcgc
  ${prefix}bcgroup
  ${prefix}restart
  ${prefix}delcase
  ${prefix}addcase
  ${prefix}addcase
└───────⭓`)}

global.menusearch = (prefix) => {
return ctext(`「 *S E A R C H* 」
┌──⭓
  ${prefix}pinterest
  ${prefix}leerqr >imagen
  ${prefix}pin
  ${prefix}tiktoksearch 
  ${prefix}ytsearch
  ${prefix}play
└───────⭓`)}

global.menustickanim = (prefix) => {
return ctext(`「 *S T I C K E R S* 」
┌──⭓
  ${prefix}kill
  ${prefix}pat
  ${prefix}lick
  ${prefix}bite
  ${prefix}yeet
  ${prefix}bonk
  ${prefix}wink
  ${prefix}poke
  ${prefix}nom
  ${prefix}slap
  ${prefix}smile
  ${prefix}wave
  ${prefix}blush
  ${prefix}smugh
  ${prefix}glomp
  ${prefix}happy
  ${prefix}dance
  ${prefix}cringe
  ${prefix}highfive
  ${prefix}handhold
└───────⭓`)}

global.menutools = (prefix) => {
return ctext(`「 *T O O L S* 」
┌──⭓
  ${prefix}hd
  ${prefix}ssweb
  ${prefix}ssfull
  ${prefix}toimg
  ${prefix}toaud
  ${prefix}tomp3
  ${prefix}circlevideo
  ${prefix}tovn
  ${prefix}tourl
  ${prefix}shortlink
  ${prefix}sticker
  ${prefix}smeme
  ${prefix}wm
  ${prefix}letra
  ${prefix}gitclone
└───────⭓`)}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update'${__filename}'`))
	delete require.cache[file]
	require(file)
})