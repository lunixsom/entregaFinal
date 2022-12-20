class Main {
  // AJAX
  async ajax(url, metodo = "get") {
    // TODO: Refactor

    try {
      const respuesta = await fetch(url, { method: metodo })
      const resultado = await respuesta.text()
      return resultado
    } catch (error) {
      console.error(error)
    }
  }

  getNombreArchivo(id) {
    // id => alta
    return "vistas/" + id + ".html" // Concatena y genera la RUTA / => vistas/alta.html
  }

  marcarLink(id) {
    const links = document.querySelectorAll("header nav a")
    links.forEach((link) => {
      if (link.id === id) link.classList.add("active")
      else link.classList.remove("active")
    })
  }

  initJS(id) {
    // esta funcion nos permite saber que plantilla ibamos a necesitar y que codigo JS se iba a incorporar en esa plantilla.
    if (id === "alta") {
      initAlta()
    } else if (id === "inicio") {
      initInicio()
    } else if (id === "nosotros") {
      initNosotros()
    } else if (id === "contacto") {
      initContacto()
    }
  }

  async cargarPlantilla(id) {
    //SE ENCARGA DE HACER LA PETICION ASINCRONICA
    let archivo = this.getNombreArchivo(id)

    let plantilla = await this.ajax(archivo)

    // Carga del codigo de la vista (HTML) de la plantilla
    let main = document.querySelector("main")
    main.innerHTML = plantilla

    // Carga del codigo script (JS) de la plantilla
    this.initJS(id)
  }

  async cargarPlantillas() {
    /* ---------------------------------------------------------- */
    /* Carga inicial de  la vista determinada por la url visitada */
    /* ---------------------------------------------------------- */

    let id = location.hash.slice(1) || "inicio" // #inicio => slice(1) => inicio (slice(1) descarta el primer caracter y se queda con lo demas)
    this.marcarLink(id)
    await this.cargarPlantilla(id)

    /* -------------------------------------------------------------- */
    /* Carga de cada uno  de los contenidos segun la navegacion local */
    /* -------------------------------------------------------------- */

    const links = document.querySelectorAll("header nav a")
    //console.log(links)

    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        let id = link.id
        //console.log(id)
        location.hash = id
      })
    })

    window.addEventListener("hashchange", async () => {
      console.log("Cambio la url")

      let id = location.hash.slice(1) || "inicio"
      this.marcarLink(id)
      await this.cargarPlantilla(id)
    })
  }

  async start() {
    await this.cargarPlantillas()
  }
}

const main = new Main()
main.start()
