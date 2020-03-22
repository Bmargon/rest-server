// 
// Puerto
//

process.env.PORT = process.env.PORT || 3000
//
// Entorno
//
process.env.NODE_ENV = process.env.NODE_ENV  || 'dev'
//
// DB
//
let urlDB
if (process.env.NODE_ENV === 'dev') {
  urlDB = 'mongodb://localhost:27017/cafe'
} else {
  urlDB = 'mongodb+srv://margon:varagranda@cluster0-pwobu.mongodb.net/cafe'
}

process.env.URLDB = urlDB
//
// Caducidad token
//
process.env.CADUCIDAD = '48h'
//
// SEED
//
process.env.SEED = process.env.SEED || 'secretoDEV'
//
// Google client
//
process.env.CLIENT_ID = process.env.CLIENT_ID || '286957252245-cotnivg8qu177de8q6nia2b31n0ipkhr.apps.googleusercontent.com'