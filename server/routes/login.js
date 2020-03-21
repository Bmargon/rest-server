
const express = require('express')
const Usuario = require('../models/usuario')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
const app = express()

app.post('/login', (req, res) => {

  let body = req.body

  Usuario.findOne({email: body.email}, (err, usuarioDB) => {

    if (err) {
        return res.status(500).json({
          ok: false,
          err
        })
      }

    if (!usuarioDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: '(Usuario) o contraseña incorrectos'
        }
      })
    }

  
    if (!bcrypt.compareSync( body.password, usuarioDB.password)) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Usuario o (contraseña) incorrectos'
        }
      })
    }

    let token = jwt.sign({
      usuario: usuarioDB
    }, process.env.SEED, {expiresIn: process.env.CADUCIDAD})

    res.json({
      ok: true,
      usuario: usuarioDB,
      token
    })
  })
})

// Google Conf


async function verify( token ) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,  

  });

  const payload = ticket.getPayload();

  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true
  }

}



app.post('/google', async (req, res) => { 
  let token = req.body.idtoken
  let gUser = await verify(token).catch(e => {
    return res.status(403).json({
      ok: false,
      err: e
    })
  })

  Usuario.findOne({email: gUser.email}, (err, usuarioDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }

    if (usuarioDB) {
      if (usuarioDB.google === false) {
        return res.status(400).json({
          ok: false,
          message: 'debe de acceder mediante su correo electornico'
        })
      } else {
        let token = jwt.sign({usuario: usuarioDB}, process.env.SEED, {expiresIn: process.env.CADUCIDAD})
        res.status.json({
          ok: true,
          usuario: usuarioDB,
          token
        })
      }

    } else {
      // si el usuario no existe en nuetsra base de datos
      let usuario = new Usuario()

      usuario.nombre = gUser.nombre
      usuario.email = gUser.email
      usuario.img = gUser.img
      usuario.google = true
      usuario.password = ':)'

      usuario.save((err, usuarioDB) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err
          })
        }
        let token = jwt.sign({ usuario: usuarioDB }, process.env.SEED, { expiresIn: process.env.process.env.CADUCIDAD })
        return res.json({
          ok: true,
          usuario: usuarioDB,
          token
        })
      })
    }
  })
})

module.exports = app