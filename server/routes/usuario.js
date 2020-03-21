
const express = require('express')
const Usuario = require('../models/usuario')
const { verificacionToken, verificaAdminRole } = require('../middleware/auth')
const app = express()
const bcrypt = require('bcrypt')
const _ = require('underscore')

// GET //
app.get('/usuario', verificacionToken, (req, res) => {

  let desde = Number(req.query.desde) || 0
  let limite = Number(req.query.limite) || 5

  Usuario.find({ estado: true },'nombre email role estado img')
         .skip(desde)
         .limit(limite)
         .exec((err, usuariosDB) => {

            if (err) {
              res.status(400).json({
                ok: false,
                err
              })
            }

            Usuario.count( {estado: true}, (err, total) => {

              res.json({
                ok: true,
                total, 
                usuariosDB
              })
            })

         })
});

// POST //
app.post('/usuario', [verificacionToken, verificaAdminRole], (req, res) => {

  let body = req.body

  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role
  })

  usuario.save( (err, usuarioDB) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }
    
    res.json({
      ok: true,
      usuario: usuarioDB
    })
  })
  
});

// PUT
app.put('/usuario/:id', verificacionToken, (req, res) => {

  let id = req.params.id
  let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']) 

  Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, usuarioDB) => {

      if (err) {
        return res.status(400).json({
          ok: false,
          err
        })
      }

      res.status(200).json({
        ok: true,
        usuarioDB
      })

  })
});

// DELETE
app.delete('/usuario/:id', [verificacionToken, verificaAdminRole], (req, res) => {

  let id = req.params.id
  let cambiaEstado = {
    estado: false
  }

  Usuario.findByIdAndUpdate(id, cambiaEstado, {new: true}, (err, usuarioBorrado) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }

    if (usuarioBorrado == null){
      return res.status(404).json({
        ok: false,
        err: {
          message: 'Usuario no encontrado'
        }
      })
    }

    res.json({
      ok: true,
      usuarioBorrado
    })
  })
  
});


module.exports = app;