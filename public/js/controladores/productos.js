class ProductoController extends ProductoModel {
    constructor(){
        super()
        this.guardarProducto = this.guardarProducto.bind(this)
    }

    async obtenerProductos(){ 
        this.productos = await productoService.obtenerProductosService()
        return this.productos
    }
    
    async guardarProducto(producto){ 
        
        const productoGuardado = await productoService.guardarProductoService(producto)
        //console.log(productoGuardado)
    
        this.productos.push(productoGuardado)
    
        renderTablaAlta(null, this.productos)
    }
    
    async actualizarProducto(id){ 
        console.log('Actualizar producto', id)
    
        const producto = formularioAlta.leerProductoIngresado()
        formularioAlta.limpiarFormulario()
    
        const productoActualizado = await productoService.actualizarProductoService(id, producto)
        //console.log(productoActualizado)
    
        const index = this.productos.findIndex(producto => producto.id == productoActualizado.id)
        this.productos.splice(index,1,productoActualizado)
    
        renderTablaAlta(null, this.productos)
    }
    
    async borrarProducto(id){ 
        console.log('borrar producto', id)
    
        let productoBorrado = await productoService.borrarProductoService(id)
    
        const index = this.productos.findIndex(producto => producto.id == productoBorrado.id)
        this.productos.splice(index,1)
    
        renderTablaAlta(null, this.productos)
    }
}

const productoController = new ProductoController()