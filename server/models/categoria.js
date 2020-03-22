const mongoose = require('mongoose')
const Schema = mongoose.Schema

let categoríaSchema = new Schema({
  descripcion: {type: String, unique: true, required: [true, 'la categoria es obligatoria']},
  usuario: {type: Schema.Types.ObjectId, ref: 'Usuario'}
})

module.exports = mongoose.model('Categoria', categoríaSchema)