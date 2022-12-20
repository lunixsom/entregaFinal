const Joi = require('joi')

class ProductoValidation {

    static validar(producto) {
        
        const productoSchema = Joi.object({
            nombre: Joi.string().min(3).max(20).required(),
            precio: Joi.number().required(),
            stock: Joi.number().required(),
            marca: Joi.string().required(),
            categoria: Joi.string().required(),
            detalles: Joi.string().required(),
            foto: Joi.string().empty(''),
            envio: Joi.boolean().required(),
        })

        const { error } = productoSchema.validate(producto) // el metodo validate te devuelve un obj

        return error // si hay error, tiene contenido. Si no hay error de validacion, no hay contenido
    }
}

module.exports = ProductoValidation