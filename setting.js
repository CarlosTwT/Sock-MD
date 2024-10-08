const fs = require('fs')
const moment = require('moment-timezone')
const version = require("@whiskeysockets/baileys/package.json").version 
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const shun = packageJson.version

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
  var str = text.toLowerCase().split('');
  var output = [];
  str.map((v) => {
    const find = replacer.find((x) => x.original == v);
    find ? output.push(find.convert) : output.push(v);
  });
  return output.join('');
};



//—————「 SYSTEM 」—————//
global.baileysVersion = `${version}`
global.baileys = require('@whiskeysockets/baileys') // no lo cambies
global.usePairingCode = true // false = qrCode, true = emparejamientoCode
global.email = 'carlos.e.escobarmc@gmail.com' // Correo electrónico para recibir emparejamiento   
global.conecct = {
	email: 'sockaibot@gmail.com',
    password: 'sockbot321'
} // Emparejar remitentes de correo electrónico
global.gametiempo = 60
global.bandera = {};
global.sessionName = 'session' // no lo cambies
global.gris = '`' // no lo cambies
global.wm = `Sock AI - Wa Bot` // footer text
global.autobio = false // false = off, true = on
global.autoread = true // false = off, true = on
global.anticall = true // false = off, true = on
//—————「 SYSTEM 」—————//



//—————「 BOT 」—————//
global.canal = 'Sock AI channel🎐' // Opcional 
global.channel = "120363301101357890@newsletter" // Opcional
global.botname = 'ＳＯＣＫ ＡＩ' // este es el nombre del robot
global.bottz = '' // Reemplácelo con el número del bot para obtener el código de emparejamiento. 
global.packname = '+593 99 139 8786\n' // wm sticker
global.author = ``//Fecha: ${moment.tz('America/Guayaquil').format('DD/MM/YY')}\n\n // wm sticker
global.prefa = ['','!','.',',','🐤','🗿']
global.versions = `${shun}`

//—————「 BOT 」—————//



//—————「 OWNER 」—————//
global.ownername = 'CarlosE' // Cambia tu nombre
global.owner = ['593991398786'] // cambia tu numero
global.ownermail = ['carlos.e.escobarmc@gmail.com'] // Opcional
//—————「 OWNER 」—————//



//—————「 MESSAGE 」—————//
global.mess = {
    badm: ctext('*[ Aviso del sistema ]* necesito ser *admin*'),
    regis: ctext(`*[ Acceso denegado ]*\n\n¡Aún no te has registrado!\nRegístrate escribiendo .registrar edad\nEjemplo .registrar 17`),
    search: ctext('🔍 *buscando en el servidor. . .*'),
    done: ctext('Hecho...'),
    success: ctext('*[ Listo ]*'),
    admin: ctext('*[ Aviso del sistema ]* solo para *admin!* no *npc*'),
    owner: ctext('*[ Error de acceso ]* Acceso denegado'),
    group: ctext('*[ Aviso del sistema ]* Use esto en el chat grupal!'),
    private: ctext('*[ Aviso del sistema ]* Use esto en chat privado!'),
    bot: ctext('*[ Aviso del sistema ]* Solo el Bot lo puede usar'),
    wait: ctext('*[ Cargando por favor espere ]'),
    getdata: ctext('Buscando metadatos . . .'),
    fail: ctext('No puedo obtener metadatos!'),
    error: ctext('*[ Error del sistema ]* Error, comuníquese con el propietario'),
    errorF: ctext('*[ Error del sistema ]* Lo sentimos, esta característica es un error.'),
}
//—————「 MESSAGE 」—————//




//=================================================//
let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(`Update'${__filename}'`)
	delete require.cache[file]
	require(file)
})
