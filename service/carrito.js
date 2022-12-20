const CarritoModel = require("../model/carrito");

// Aca tengo la instancia del modelo (model)
const model = CarritoModel.get(process.env.PERSISTENCIA || "MONGODB")

// Aca voy a usar los servicios:

const guardarCarrito = async carrito => {
    const carritoGuardado = await model.createCarrito(carrito)
    return carritoGuardado
}

module.exports = {
    guardarCarrito
}