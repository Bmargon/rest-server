const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
let Schema = mongoose.Schema


let roles = {
  values: ['ADMIN_ROLE', 'USER_ROLE'],
  message: '{VALUE} no es un role valido'
}

let usuarioModel = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'El email es obligatorio']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria']
  },
  img: {
    type: String,
    required: false
  },
  role: {
    type: String,
    default: 'USER_ROLE',
    enum: roles
  },
  estado: {
    type: Boolean,
    default: true
  },
  google: {
    type: Boolean,
    default: false
  }
})


// uniqueValidator es un plugin que lo unico que hace es lanzar un mensaje de error bonito en el caso de que el campo unico sea duplicado
usuarioModel.plugin(uniqueValidator, {message: '{PATH} debe de ser unico'})

module.exports = mongoose.model('Usuario', usuarioModel)
