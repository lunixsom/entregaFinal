const mongoose = require('mongoose')

/* Esquema del documento carrito: */

const carritoSchema = mongoose.Schema({
    carrito: Array
})

/* Defino Modelo del documento almacenado en una coleccion: */

const CarritoModel = mongoose.model('carritos', carritoSchema)

/* ------------------------------------------------------------------- */

// Conexion a la base de datos:

class CarritoModelMongoDB {

    /* ---------------------------------------------  */

    // CRUD -> C: Create -> http method POST
    async createCarrito(carrito){
        try {
            const carritoSave = new CarritoModel({ carrito }) // { carrito: carrito }
            await carritoSave.save()
            return carrito
        } catch (error) {
            console.log(`Error en createCarrito: ${error}`)
            return {}
        }
    }
}

module.exports = CarritoModelMongoDB