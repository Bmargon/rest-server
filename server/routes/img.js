const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')
const { verificacionTokenImg} = require('../middleware/auth')
app.get('/imagen/:tipo/:img', verificacionTokenImg, (req, res) => {

  let tipo = req.params.tipo
  let img = req.params.img

  let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${img}`)

  if (fs.existsSync(pathImg)) {
    res.sendFile(pathImg)
  } else {
    let noImg = path.resolve(__dirname, '../assets/no-image.jpg')
    res.sendFile(noImg)
  }

})

module.exports = app