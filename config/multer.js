const multer = require('multer')

// Configuracion de como va a funcional MULTER:
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function(req, file, cb){
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({storage}) // storage: storage

module.exports = upload