//const { preferences } = require("joi")

class CarritoController extends CarritoModel {
  constructor() {
    super()

    try {
      this.carrito = JSON.parse(localStorage.getItem("carrito")) || []
    } catch (error) {
      console.error("Algo ocurrio con la lectura del localStorage", error)
      this.carrito = [] // asigno [] para que mi app continue y no se pare
      localStorage.setItem("carrito", this.carrito) // se la agrego a localStorage
    }
  }

  elProductoEstaEnElCarrito(producto) {
    const tengoProductos = this.carrito.filter((prod) => prod.id == producto.id).length

    return tengoProductos
  }

  obtenerProductoDeCarrito(producto) {
    return this.carrito.find((prod) => prod.id == producto.id)
  }

  agregarAlCarrito(producto) {
    console.log(producto)
    if (!this.elProductoEstaEnElCarrito(producto)) {
      console.log('Quiere decir que existe en el carrito el producto')
      producto.cantidad = 1
      this.carrito.push(producto)
    } else {
      console.log('Si no esta el producto en el carrito')
      const productoDeCarrito = this.obtenerProductoDeCarrito(producto)
      productoDeCarrito.cantidad++
    }

    localStorage.setItem("carrito", JSON.stringify(this.carrito))
  }

  async borrarProductoCarrito(id) {
    try {
      const index = this.carrito.findIndex((prod) => prod.id == id)
      this.carrito.splice(index, 1)
      localStorage.setItem("carrito", JSON.stringify(this.carrito))

      await renderTablaCarrito(this.carrito)
    } catch (error) {
      console.error(error)
    }
  }

  async enviarCarrito() {

    try {
      const elemSectionCarrito = document.getElementsByClassName('section-carrito')[0]
  
      elemSectionCarrito.innerHTML = '<h2>Enviando carrito...</h2>'
      const preference = await carritoService.guardarCarritoServicio(this.carrito)
      console.log(preference)
      this.carrito = []
      localStorage.setItem('carrito', JSON.stringify(this.carrito))
  
      elemSectionCarrito.innerHTML = '<h2>Enviando carrito <b>OK</b></h2>' 

      setTimeout( async () => {
        elemSectionCarrito.classList.remove('section-carrito--visible')
        //mostrarCarrito = false
        console.log(preference)
        await renderPago(preference)
      }, 0) // le pongo 0 para sacarlo del hilo ppal y llevarlo a uno secundario (stack de js)

    } catch (error) {
      console.error(error)
    }

  }
}

const carritoController = new CarritoController()
