
async function renderPlantillaListado(listado) {

    try {
        const respuesta = await fetch('plantillas/inicio.hbs')
        const plantillaHbs = await respuesta.text()
        const template = Handlebars.compile(plantillaHbs)
    
        const html = template({ listado })
    
        document.getElementsByClassName('cards-container')[0].innerHTML = html
    } catch (error) {
        console.error(error)
    }
}

function agregarCarrito(e, id, ref) { // TODO: Trabajar con el metodo agregarCarrito
    e.preventDefault()
    console.log(id)
    console.log(ref)
    // Esto podria ser un metodo especifico del controlador (buscar productos para agregarlos al carrito):
    const producto = productoController.productos.find(producto => producto.id == id)
    carritoController.agregarAlCarrito(producto)
}

async function initInicio() {
    console.warn('initInicio()')

    const productos = await productoController.obtenerProductos()
    await renderPlantillaListado(productos)

    document.querySelector('.section-cards__header p').innerHTML = `Se encontraron ${productos.length} productos`
}