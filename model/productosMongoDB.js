const mongoose = require('mongoose')
//const productoModel = require('./productos')

/* Esquema del documento producto */

const productoSchema = mongoose.Schema({
    nombre: String,
    precio: Number,
    stock: Number,
    marca: String,
    categoria: String,
    detalles: String,
    foto: String,
    envio: Boolean
})

/* Modelo del documento almacenado en una coleccion */

const ProductoModel = mongoose.model('productos', productoSchema)

/* ------------------------------------------------------------------- */

// Conexion a la base de datos:

class ProductoModelMongoDB {

    pk = '_id'

    async conectarDB(){

        try {
            await mongoose.connect(process.env.URI_MONGO_REMOTO)
            console.log('Base de datos conectada')
        } catch (error) {
            console.log(`MongoDB error al conectar ${error}`)
        }
    }

    genIdKey(obj) { // puede recibir un array o un objeto
        console.log(obj)
        if (Array.isArray(obj)) { // esto me devuelve true o false
            // Con esto le saco guion bajo al id q me viene de mongo:
            for(let i=0; i<obj.length; i++){
                obj[i].id = obj[i][this.pk] // this._id => this.id
            }
        }
        else{
            obj.id = obj[this.pk] // this._id => this.id
        }

        return obj
    }

    // CRUD -> Create -> http method POST
    async createProducto(producto){
        
        try {
            
            const productoSave = new ProductoModel(producto)
            await productoSave.save()

            const productos = await ProductoModel.find({}).lean() // convierte el obj de mongoose en un obj JS
            const productoGuardado = productos[productos.length-1] // aca accedemos la ultimo elemento
            return this.genIdKey(productoGuardado)

        } catch (error) {
            console.log(`Error en el createProducto: ${error}`)
        }
    }
    
    // CRUD -> Read ALL -> http method GET
    async readProductos(){
        try {
            const productos = await ProductoModel.find({}).lean()
            return this.genIdKey(productos) 
        } catch (error) {
           console.log(`Error en readProductos: ${error}`)
           return [] 
        }     
    }
    
    // CRUD -> Read ONE -> http method GET
    async readProducto(id){
        
        try {
            const producto = await ProductoModel.findById(id).lean()
            return this.genIdKey(producto)
        } catch (error) {
            console.log(`Error en readProducto: ${error}`)
            return {}
        }



    }
    
    // CRUD -> Update -> http method PUT
    async updateProducto(id, producto){
    
        try {
            
            const resultado = await ProductoModel.updateOne({_id: id},{$set: producto})
            //console.log(resultado)

            const productoActualizado = await ProductoModel.findById(id).lean()

            return this.genIdKey(productoActualizado)

        } catch (error) {
            console.log(`Error en updateProducto: ${error}`)
            return {}
        }
    }
    
    // CRUD -> Delete -> http method DELETE
    async deleteProducto(id){
        try {
            
            //await ProductoModel.deleteOne({_id: id})
            const productoBorrado = await ProductoModel.findByIdAndDelete(id)
            return this.genIdKey(productoBorrado)

        } catch (error) {
            console.log(`Error en deleteProducto: ${error}`)
            return {}
        }
    }   
}

module.exports = ProductoModelMongoDB