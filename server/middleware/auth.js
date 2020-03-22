const jwt = require('jsonwebtoken')
//
// Verificar Token
//

let verificacionToken = (req, res, next) => {

  let token = req.get('token')

  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        message: 'token no valido',
        err
      })
    }

    req.usuario = decoded.usuario
    next()

  })
}
//
// Verificar img
//
let verificacionTokenImg = (req, res, next) => {

  
  let token = req.query.token
  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        message: 'token no valido',
        err
      })
    }

    req.usuario = decoded.usuario
    next()
  })
  

}
// ===============================================
// verifica role
// ===============================================
let verificaAdminRole = (req, res, next) => {

  let usuario = req.usuario

  if (usuario.role === 'USER_ROLE') {
    return res.status(401).json({
      ok: false,
      message: 'usuario no autorizado',
    })
  }

  next()

}

module.exports = {
  verificacionToken,
  verificaAdminRole,
  verificacionTokenImg
}

