const express = require('express')
const mongoose = require('mongoose')
const app = express()
const bodyParser = require('body-parser')
require('./config/config')
const routesIndex = require('./routes/index')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
// conf global routes
app.use(routesIndex)

mongoose.connect(process.env.URLDB, {useNewUrlParser: true, useCreateIndex: true}, (err, res) => {
  if (err) throw err
  console.log('base de datos online')
})

app.listen(process.env.PORT, () => {
  console.log('escuchando puerto 3000')
})
