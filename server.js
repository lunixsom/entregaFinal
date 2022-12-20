const express = require('express');
require('dotenv').config();
const routerProductos = require('./routers/productos')
const routerCarrito = require('./routers/carrito');
const routerUpload = require('./routers/upload');

// Configuraciones basicas del servidor 
const app = express()

// Middleware (use, toda mi aplicacion esta afectada por esto middlewares)
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())

// Routeo de mi aplicacion
//app.use('/api/productos', require('./routers/productos')) // si hago asi no necesito requerirlo en cabezera
app.use('/api/productos', routerProductos) /* este middleware de rutas lo pongo aqui y no junto a los de arriba para que todos los de arriba afecten a las rutas */
app.use('/api/carrito', routerCarrito) /* este middleware de rutas lo pongo aqui y no junto a los de arriba para que todos los de arriba afecten a las rutas */
app.use('/api/upload', routerUpload) /* este middleware de rutas lo pongo aqui y no junto a los de arriba para que todos los de arriba afecten a las rutas */

app.get('/', (req, res) => {
    res.send('Holaaa')
})

const PORT = process.env.PORT

console.log(PORT)
//console.log(process.env)

app.listen(PORT, (err) => {
    if (err) throw new Error(`Sucedio un error: ${err}`)

    console.log(`Servidor arriba escuchando en el puerto ${PORT}`)
})