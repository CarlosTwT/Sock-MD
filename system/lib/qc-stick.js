const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const fetch = require('node-fetch')
const { ffmpeg } = require('./converter')
const { spawn } = require('child_process')
const uploadFile = require('./uploadFile')
const { fromBuffer } = require('file-type')
const uploadImage = require('./uploadImage')

const tmp = path.join(__dirname, '../tmp')
/**
 * Image to Sticker
 * @param {Buffer} img Image Buffer
 * @param {String} url Image URL
 */
async function stickQC(img, url, packname, author, categories = ['']) {
  const WSF = require('wa-sticker-formatter')
  const stickerMetadata = {
    type: 'full',
    pack: packname,
    author,
    categories,
  }
  return await new WSF.Sticker(img ? img : url, stickerMetadata).build()
}

module.exports = { 
  stickQC,
  support: {
    ffmpeg: true,
    ffprobe: true,
    ffmpegWebp: true,
    convert: true,
    magick: false,
    gm: false,
    find: false
  }
}