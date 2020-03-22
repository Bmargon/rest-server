const express = require('express')
let {verificacionToken, verificaAdminRole} = require('../middleware/auth')

let app = express()

let Categoria = require('../models/categoria')

//
// Mostrar todas las categorias
//
app.get('/categoria', (req, res) => {
  Categoria.find({})
    .sort('descripcion')
    .populate('usuario', 'nombre email')
    .exec( (err, categoriaDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        })
      }
      res.json({
        ok: true,
        categorias: categoriaDB
      })
    })
})
//
// Mostrar una categoria por id
//
app.get('/categoria/:id', (req, res) => {
  let id = req.params.id
  Categoria.findById(id, (err, categoriaDB) => {
    if(err) {
      return res.status(404).json({
        ok: false,
        err
      })
    }
    res.json({
      ok: true,
      categoria: categoriaDB
    })
  })
})
//
// Crear nueva categoria
//
app.post('/categoria', verificacionToken, (req, res) => { 

  let body = req.body

  let categoria = new Categoria({
    descripcion: body.descripcion,
    usuario: req.usuario._id
  })

  categoria.save((err, categoriaDB) => {
    if (err) {
      return res.status(404).json({
        ok: false,
        err
      })
    }
    if (!categoriaDB) {
      return res.status(404).json({
        ok: false,
        err
      })
    }
    res.json({
      ok: true,
      categoriaDB
    })
  })

})
//
// Actualizar nueva categoria
//
app.put('/categoria/:id', verificacionToken,(req, res) => { 

  let id = req.params.id
  let body = {
    descripcion: req.body.descripcion,
    usuario: req.usuario._id
  }

  Categoria.findByIdAndUpdate(id, body, {new: true, runValidators: true} ,(err, categoriaDB) => {

    if (err) {
      return res.status(404).json({
        ok: false,
        err
      })
    }

    res.json({
      ok: true,
      categoriaDB
    })

  })

})
//
// Eliminar  categoria solo admin y token
//
app.delete('/categoria/:id', [verificacionToken, verificaAdminRole], (req, res) => {
  let id = req.params.id

  Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
    if (err) {
      return res.status(404).json({
        ok: false,
        err
      })
    }
    if (!categoriaDB) {
      return res.status(404).json({
        ok: false,
        err
      })
    }
    res.json({
      ok: true,
      categoriaDB
    })

  })
 })


module.exports = app