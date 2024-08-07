/* 
- _ -
*/

const fs = require('fs')
const chalk = require('chalk')
const util = require('util')

const listCase = () => {
const code = fs.readFileSync("./shun.js", "utf8")
var regex = /case\s+'([^']+)':/g;
var matches = [];
var match;
while ((match = regex.exec(code))) {
matches.push(match[1]);
}
let teks = `*Total Case*: ${matches.length} \n\n` 
matches.forEach(function (x) {
   teks += "  ◦  " + x + "\n"
})
return teks
}
module.exports.listCase = listCase