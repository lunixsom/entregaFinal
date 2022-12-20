class FormularioAlta {
  /* ---- estas son todas propiedades de objeto: ------- */
  inputs = null
  form = null
  button = null
  camposValidos = [false, false, false, false, false, false]

  // Aca tenemos TODAS las expresiones regulares de los campos
  regExpValidar = [
    /^.+$/, // regexp nombre
    /^.+$/, // regexp precio
    /^.[0-9]+$/, // regexp stock
    /^.+$/, // regexp marca
    /^.+$/, // regexp categoria
    /^.+$/, // regexp detalles
  ]

  /* ------------------ drag and drop ------------------- */
  
  imagenSubida = ''
  dropArea= null
  progressBar = null

  /* ------------------ drag and drop ------------------- */

  /* -------------------------------------------------- */

  constructor(renderTablaAlta, guardarProducto) {
    // console.log(renderTablaAlta, guardarProducto) // referencias de las funciones/metodos
    this.inputs = document.querySelectorAll("main form input.data-validation")
    this.form = document.querySelector("main form")
    this.button = document.querySelector("main form button")

    this.button.disabled = true
    //console.log(this.inputs)
    this.inputs.forEach((input, index) => {
      if (input.type != "checkbox") {
        input.addEventListener("input", () => {
          this.validar(input.value, this.regExpValidar[index], index)
          if (renderTablaAlta) renderTablaAlta(!this.algunCampoValido(), productoController.productos
            )
        })
      }
    })

    this.form.addEventListener("submit", (e) => {
      e.preventDefault()

      const producto = this.leerProductoIngresado()
      this.limpiarFormulario()

      if(guardarProducto) guardarProducto(producto)
    })

  /* ------------------ drag and drop ------------------- */

  this.dropArea = document.getElementById('drop-area')
  this.progressBar = document.getElementById('progress-bar')

  // Para cancelar el evento automatico de drag and drop

  ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach( eventName => {
      this.dropArea.addEventListener(eventName, e => e.preventDefault())
      document.body.addEventListener(eventName, e => e.preventDefault())
  })

  // Para remarcar la zona de drop al arrastar
  ;['dragenter', 'dragover'].forEach(eventName => {
      this.dropArea.addEventListener(eventName, () => {
        this.dropArea.classList.add('highlight')
      })
  })

  ;['dragleave','drop'].forEach( eventName => {
      this.dropArea.addEventListener( eventName, () => {
        this.dropArea.classList.remove('highlight')
      })
  })

  this.dropArea.addEventListener('drop', e => {
    const dataTransf = e.dataTransfer
    const files = dataTransf.files
    //console.log(files)
    this.handleFiles(files)
  })

  /* ------------------ drag and drop ------------------- */
    const inputFoto = document.querySelector('#foto')

    inputFoto.addEventListener('change', () => {
      console.log('Cambio el input')

      const files = inputFoto.files
      //console.log(files)
      this.handleFiles(files)
    })

  }

  // Para comprobar la validez de los campos
  algunCampoValido() {
    let valido =
      this.camposValidos[0] &&
      this.camposValidos[1] &&
      this.camposValidos[2] &&
      this.camposValidos[3] &&
      this.camposValidos[4] &&
      this.camposValidos[5] 

    return !valido
  }

  // Va chequeando campo por campo
  validar(valor, validador, index) {
    //console.log(valor, validador, index)
    if (!validador.test(valor)) {
      this.setCustomValidityJS("Este campo no es valido", index)
      this.camposValidos[index] = false // con esto lo mantengo en false
      this.button.disabled = true
      return null // esto seria como hacer un break
    }

    this.camposValidos[index] = true
    this.button.disabled = this.algunCampoValido() // boolean

    this.setCustomValidityJS("", index)
    return valor
  }

  // Mostrar u Ocultar el mensaje
  setCustomValidityJS(mensaje, index) {
    let divs = document.querySelectorAll("form .mensaje-validacion")
    divs[index].innerHTML = mensaje
    divs[index].style.display = mensaje ? "block" : "none"
  }

  // Producto ingresado en el formulario
  leerProductoIngresado() {
    return {
      nombre: this.inputs[0].value,
      precio: this.inputs[1].value,
      stock: this.inputs[2].value,
      marca: this.inputs[3].value,
      categoria: this.inputs[4].value,
      detalles: this.inputs[5].value,
      foto: this.imagenSubida ? `/uploads/${this.imagenSubida}` : '/uploads/sinimagen.jpg',
      envio: this.inputs[6].checked
    }
  }

  // Limpiamos los inputs del formulario
  limpiarFormulario() {
    this.inputs.forEach(input => {
      if (input.type != "checkbox") input.value = ""
      else if (input.type == "checkbox") input.checked = false
    })
    this.button.disabled = true
    this.camposValidos = [false, false, false, false, false, false]
  
    const img = document.querySelector('#gallery img')
    img.src = ''

    this.initializeProgress()
    this.imagenSubida = '' 
  }
    /* --------------------- drag and drop --------------------------- */

    initializeProgress() {
      this.progressBar.value = 0
    }

    updateProgress(procentaje) {
      this.progressBar.value = procentaje
    }

    previewFile(file) {
      const reader = new FileReader() // FileReader buscar en developer.mozilla
      reader.readAsDataURL(file)
      reader.onloadend = function() { // sino: reader.addEventListener('loadend', () => {})
        const img = document.querySelector('#gallery img')
        img.src = reader.result
      }
    }

    handleFiles = files => {
      const file = files[0]
      this.initializeProgress()
      this.uploadFile(file)
      this.previewFile(file)
    }

    uploadFile = file => {
      const url = '/api/upload'

      const xhr = new XMLHttpRequest()
      const formData = new FormData()

      xhr.open('POST', url)

      xhr.upload.addEventListener('progress', e => {
        /* e.preventDefault() */
        let porcentaje = (((e.loaded * 100.0) / e.total) || 100)
        this.updateProgress(porcentaje)
      })

      xhr.addEventListener('load', () =>{ /* este load se dispara cuando el readyState === 4 */
        if(xhr.status === 200) {
          const objImagen = JSON.parse(xhr.response)
          this.imagenSubida = objImagen.nombre // {nombre: 'imagen.jpg'}
        }
      })

      formData.append('foto', file)
      xhr.send(formData)
    }

    /* --------------------- drag and drop --------------------------- */

}

// Aca es donde rendereabamos la plantilla
const renderTablaAlta = (validos,productos) => {
  // listado-productos PLANTILLA

  const xhr = new XMLHttpRequest()
  xhr.open("get", "plantillas/alta.hbs")
  xhr.addEventListener("load", () => {
    if (xhr.status === 200) {
      let plantillaHbs = xhr.response
      //console.log(plantillaHbs)

      let template = Handlebars.compile(plantillaHbs)

      //console.warn(productos)
      let html = template({ productos, validos })
      //Le agrego a la plantilla los datos de producto
      document.getElementById("listado-productos").innerHTML = html
    }
  })

  xhr.send()
}

/* ------------------------------------------------------------------ */
/*        Inicializaciones para el funcionamiento del modulo          */
/* ------------------------------------------------------------------ */
let formularioAlta = null

async function initAlta() {
  console.warn("initAlta()")

  formularioAlta = new FormularioAlta(renderTablaAlta, productoController.guardarProducto)

  const productos = await productoController.obtenerProductos()
  renderTablaAlta(null, productos)
}
