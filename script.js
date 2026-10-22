// Inicializar íconos Lucide (si usas íconos en la página)
if (typeof lucide !== 'undefined') {
  lucide.createIcons();
}

// Control del Botón Flotante "Volver Arriba"
const backToTopBtn = document.getElementById('backToTop');

if (backToTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Función para abrir la ventana emergente con el perfil de cada integrante
function openModal(nombre, cargo, descripcion) {
  const titulo = document.getElementById('modalTitle');
  const subtitulo = document.getElementById('modalSubtitle');
  const texto = document.getElementById('modalBody');
  const ventana = document.getElementById('infoModal');

  if (titulo && subtitulo && texto && ventana) {
    titulo.innerText = nombre;
    subtitulo.innerText = cargo;
    texto.innerText = descripcion;
    ventana.classList.add('active');
  } else {
    console.error("Falta algún elemento del modal en el HTML");
  }
}

// Función para cerrar la ventana tocando la "X"
function closeModalDirect() {
  const ventana = document.getElementById('infoModal');
  if (ventana) {
    ventana.classList.remove('active');
  }
}

// Función para cerrar la ventana tocando el fondo oscuro de afuera
function closeModal(event) {
  if (event.target.id === 'infoModal') {
    closeModalDirect();
  }
}

// Función para cambiar entre apartados de la página
function showSection(sectionId) {
  // 1. Oculta todas las secciones quitando la clase 'active'
  const sections = document.querySelectorAll('.page-section');
  sections.forEach(sec => sec.classList.remove('active'));

  // 2. Muestra solo la sección que seleccionó el usuario
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
  }

  // 3. Sube la pantalla suavemente al inicio
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Cotizador Mayorista NaturalCalm
var PRECIO_JABON = 2800;
var MINIMO_JABONES = 12;

function obtenerCostoEnvio(tipoEnvio, cantidad) {
  if (tipoEnvio === "recoger") return 0;

  var unidadesEfectivas = cantidad < MINIMO_JABONES ? MINIMO_JABONES : cantidad;
  var extras = unidadesEfectivas - 12; // Unidades adicionales pasados los 12 mínimos

  if (tipoEnvio === "local") {
    // $12.000 base + $1.000 por cada jabón extra
    return 12000 + (extras * 1000);
  }

  if (tipoEnvio === "nacional") {
    // $17.000 base + $1.000 por cada jabón extra
    return 17000 + (extras * 1000);
  }

  return 0;
}

function calcularTotal() {
  var cantidadInput = document.getElementById('cantidad');
  var envioSelect = document.getElementById('envio');
  var precioTotalText = document.getElementById('precioTotal');
  var textoCostoEnvio = document.getElementById('textoCostoEnvio');

  if (!cantidadInput || !envioSelect || !precioTotalText) return;

  var cantidad = parseInt(cantidadInput.value, 10);
  var cantidadParaEnvio = (isNaN(cantidad) || cantidad < MINIMO_JABONES) ? MINIMO_JABONES : cantidad;

  var tipoEnvio = envioSelect.value;
  var costoEnvio = obtenerCostoEnvio(tipoEnvio, cantidadParaEnvio);

  // Mostrar el costo del envío dinámicamente en el texto de apoyo
  if (textoCostoEnvio) {
    if (tipoEnvio === "recoger") {
      textoCostoEnvio.innerText = "Costo de envío: ¡GRATIS!";
    } else {
      textoCostoEnvio.innerText = "Costo de envío para " + cantidadParaEnvio + " jabones: $" + costoEnvio.toLocaleString("es-CO") + " COP";
    }
  }

  // Si la cantidad es menor al mínimo
  if (isNaN(cantidad) || cantidad < MINIMO_JABONES) {
    precioTotalText.innerText = "Mínimo " + MINIMO_JABONES + " unidades";
    return;
  }

  // Cálculo final: (Cantidad x $2.800) + Costo de envío
  var subtotal = cantidad * PRECIO_JABON;
  var total = subtotal + costoEnvio;

  precioTotalText.innerText = "$" + total.toLocaleString("es-CO") + " COP";
}

function enviarPedidoWhatsApp() {
  var cantidadInput = document.getElementById('cantidad');
  var envioSelect = document.getElementById('envio');
  var cantidad = cantidadInput ? parseInt(cantidadInput.value, 10) : 0;

  // Validar que cumpla con el mínimo antes de enviar
  if (isNaN(cantidad) || cantidad < MINIMO_JABONES) {
    alert("Atención: El pedido mínimo al por mayor es de " + MINIMO_JABONES + " unidades.");
    return;
  }

  var tipoEnvio = envioSelect ? envioSelect.value : "local";
  var costoEnvio = obtenerCostoEnvio(tipoEnvio, cantidad);
  
  var tipoEnvioTexto = "Envío Local (Bogotá)";
  if (tipoEnvio === "nacional") tipoEnvioTexto = "Envío Nacional";
  if (tipoEnvio === "recoger") tipoEnvioTexto = "Recoger en punto de entrega";

  var total = (cantidad * PRECIO_JABON) + costoEnvio;
  var totalFormateado = "$" + total.toLocaleString("es-CO") + " COP";
  var costoEnvioFormateado = "$" + costoEnvio.toLocaleString("es-CO") + " COP";

  // Reemplaza los ceros "3000000000" por tu número de WhatsApp real con el indicativo del país (Ej: 57 para Colombia)
  var telefono = "573224236327"; 

  // Mensaje adaptado para negocios
  var mensaje = "Hola NaturalCalm, soy un negocio y quiero realizar un pedido al por mayor:\n\n" +
    "📦 Cantidad: " + cantidad + " jabones\n" +
    "🚚 Opción de envío: " + tipoEnvioTexto + " (" + costoEnvioFormateado + ")\n" +
    "💰 Total estimado: " + totalFormateado + "\n\n" +
    "Quedo atento/a para coordinar el pago y la entrega. ¡Gracias!";

  // Abrir WhatsApp con el mensaje codificado
  window.open("https://wa.me/" + telefono + "?text=" + encodeURIComponent(mensaje), '_blank');
}