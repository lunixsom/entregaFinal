class CarritoService {
    //URL_CARRITO = 'https://6344335f242c1f347f812098.mockapi.io/carrito/'
    URL_CARRITO = '/api/carrito/'

    async guardarCarritoServicio(carrito) {
        const carritoGuardado = await http.post(this.URL_CARRITO, carrito)
        return carritoGuardado
    }
}

const carritoService = new CarritoService()