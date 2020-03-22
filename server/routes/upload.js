const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario')
const Producto = require('../models/producto')
const fs = require('fs')
const path = require('path')

app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {

  let id = req.params.id
  let tipo = req.params.tipo

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'No se han seleccionado archivos'
      }
    });
  }
  // vallidar tipo
  let tiposValidos = ['productos', 'usuarios']
  if (tiposValidos.indexOf(tipo) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'Los tipos permitidos no son correctos'
      }
    })
  }
  //

  let file = req.files.archivo

  //Extensiones permitidas
  let extensiones = ['png', 'jpg', 'gif', 'ico', 'jpeg']
  let nombreCut = file.name.split('.')
  let extension = nombreCut[nombreCut.length - 1]

  if (extensiones.indexOf(extension) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'la extension del archivo no es correcta'
      }
    })
  }
  // cambiar nombre al archivo
  let nombreArchivo = `${id}___${ new Date().getMilliseconds() }.${extension}`
  // Use the mv() method to place the file somewhere on your server
  file.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
    if (err)
      return res.status(500).json({
        ok: false,
        err
      });
      
      // aqui la subida ya ees ok
      if (tipo === 'usuarios') {
        imagenUsuario(id, res, nombreArchivo)
      }else {
        imagenProducto(id, res, nombreArchivo)
      }
    });
  })
  
  
  
  function imagenUsuario (id, res, nombreArchivo) {
    
    Usuario.findById(id, (err, usuarioDB) => {
      
      if (err) {
        borrarArchivo(nombreArchivo, 'usuarios')
        return res.status(500).json({
          ok: false,
          err
        });
      }
      if (!usuarioDB) {
        
        borrarArchivo(nombreArchivo, 'usuarios')
        return res.status(404).json({
          ok: false,
          err
        });
      }

      
      usuarioDB.img = nombreArchivo
      borrarArchivo(usuarioDB.img, 'usuarios')
      usuarioDB.save( (err, usuarioGuardado) => {
        res.json({
          ok: true,
          usuarioGuardado,
          img: nombreArchivo
        })
      })
      
  })

}

function imagenProducto(id, res, nombreArchivo) {

  Producto.findById(id, (err, productoDB) => {

    if (err) {
      borrarArchivo(nombreArchivo, 'usuarios')
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if (!productoDB) {

      borrarArchivo(nombreArchivo, 'usuarios')
      return res.status(404).json({
        ok: false,
        err
      });
    }


    productoDB.img = nombreArchivo
    borrarArchivo(productoDB.img, 'usuarios')
    productoDB.save((err, productoG) => {
      res.json({
        ok: true,
        productoG,
        img: nombreArchivo
      })
    })

  })

}

function borrarArchivo (nombreImagen, tipo) {
  
  let pathURL = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`)

  if (fs.existsSync(pathURL)) {
    fs.unlinkSync(pathURL)
  }

}




module.exports = app