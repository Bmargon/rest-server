const express = require('express')
let { verificacionToken } = require('../middleware/auth')
let app = express()
let Producto = require('../models/producto')


//
// Todos los productos con usuario y categoria, paginado
//
app.get('/producto', verificacionToken, (req, res) => {

  let desde = Number(req.query.desde || 0)

  Producto.find({disponible: true})
          .skip(desde)
          .limit(5)
          .populate('usuario', 'nombre email')
          .populate('categoria', 'descripcion')
          .exec( (err, productoDB) => {
            if (err) {
              return res.status(500).json({
                ok: false,
                err
              })
            }
            res.json({
              ok: true,
              productoDB
            })
          })
})

//
// obtener un producto por id, con usuario y categoria
//
app.get('/producto/:id', verificacionToken, (req, res) => {
  let id = req.params.id

  Producto.findById(id)
          .populate('usuario', 'nombre email')
          .populate('categoria', 'nombre')
          .exec( (err, productoDB) => {
            if (err) {
              return res.status(500).json({
                ok: false,
                err
              })
            }
            res.json({
              ok: true,
              productoDB
          })
    })
})
        
        
      

//
// Buscar productos
//

app.get('/producto/buscar/:termino', verificacionToken, (req, res) => {
  
  let termino = req.params.termino
  let regex = new RegExp(termino, 'i')
  
  Producto.find({nombre: regex})
  .populate('categoria', 'nombre')
  .exec((err, busqueda) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }
    
    res.json({
      ok: true,
      busqueda
    })
    
  })
})
//
// crear un productos, grabar usuario y categoria del listado
//

app.post('/producto', [verificacionToken], (req, res) => {
  
  let body = req.body
  let producto = new Producto({
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.description,
    disponible: body.disponible,
    categoria: body.categoria,
    usuario: req.usuario._id
  })

  producto.save((err, productoDB )=> {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }
      res.json({
        ok: true,
        productoDB
      })
    })
  })


//
// actualizar los productos con usuario y categoria, paginado
//

app.put('/producto/:id', verificacionToken,(req, res) => {

  let id = req.params.id
  let body = req.body

  Producto.findByIdAndUpdate(id, body, {new: true}, (err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }
    if (!productoDB) {
      return res.status(500).json({
        ok: false,
        err
      })
    }
    res.json({
      productoDB
    })
  })
})
//
// eliminar los productos con usuario y categoria, paginado, desactivarlo
//

app.delete('/producto/:id', verificacionToken, (req, res) => {
  let id = req.params.id

  Producto.findById(id, (err, productoDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        })
      }
      if (!productoDB) {
        return res.status(500).json({
          ok: false,
          err
        })
      }
      
      productoDB.disponible = false
      
      productoDB.save((err, guardado) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err
          })
        }
        
        res.json({
          ok: true,
          productoDB
        })
      })
        
      })
})

module.exports = app