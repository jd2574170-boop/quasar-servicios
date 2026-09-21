<script setup>
import { ref } from 'vue'

// --- PERSISTENCIA Y ESTADO GLOBAL ---
const serviciosGuardados = localStorage.getItem('servicios-barberia')
const servicios = ref(serviciosGuardados ? JSON.parse(serviciosGuardados) : [])

const catalogoGuardado = localStorage.getItem('catalogo-barberia')
const preciosServicios = ref(catalogoGuardado ? JSON.parse(catalogoGuardado) : {
  'Corte con maquina': 20000,
  'Corte con tijera': 25000,
  'Barba': 10000,
  'Limpieza facial': 60000,
  'Cejas': 5000,
  'Tinte': 40000
})

function persistirDatos() {
  try {
    localStorage.setItem('servicios-barberia', JSON.stringify(servicios.value))
  } catch (e) {
    console.error('Error al guardar en localStorage:', e)
    alert('El servicio se registró en la pantalla, pero las imágenes adjuntas exceden el límite de almacenamiento local (5MB).')
  }
}

function persistirCatalogo() {
  try {
    localStorage.setItem('catalogo-barberia', JSON.stringify(preciosServicios.value))
  } catch (e) {
    console.error('Error al guardar el catálogo en localStorage:', e)
  }
}

// --- ESTADOS DE CONTROL DE NAVEGACIÓN Y MODALES ---
const mostrarModal = ref(false)
const modoEdicion = ref(false)
const mostrarConfirmacion = ref(false)
const mostrarCierreModal = ref(false)
const mostrarCatalogoModal = ref(false)

const idEliminar = ref(null)
const idEditar = ref(null)
const error = ref('')
const criterioOrden = ref('fecha') // 'fecha', 'precio', 'calificacion'
const busquedaCliente = ref('')

// --- FORMULARIO NUEVO / EDITAR SERVICIO ---
const cliente = ref('')
const serviciosSeleccionados = ref([])
const barbero = ref('')
const fecha = ref('')
const hora = ref('')
const metodoPago = ref('')
const estadoPago = ref('')
const observaciones = ref('')
const propina = ref(0)

// FOTOS SEPARADAS
const fotoAntes = ref('')
const fotoDespues = ref('')

// --- NUEVO SERVICIO EN CATÁLOGO ---
const nuevoNombreServicio = ref('')
const nuevoPrecioServicio = ref(0)

// --- FUNCIONES DE CÁLCULO Y LÓGICA DE NEGOCIO ---
function esClienteFrecuente() {
  if (!cliente.value.trim()) return false
  const historialCount = servicios.value.filter(
    s => s.cliente.toLowerCase().trim() === cliente.value.toLowerCase().trim()
  ).length
  return historialCount >= 5
}

function seleccionarServicio(nombreServicio) {
  if (nombreServicio === 'Corte con maquina' && serviciosSeleccionados.value.includes('Corte con tijera')) {
    serviciosSeleccionados.value = serviciosSeleccionados.value.filter(s => s !== 'Corte con tijera')
  } else if (nombreServicio === 'Corte con tijera' && serviciosSeleccionados.value.includes('Corte con maquina')) {
    serviciosSeleccionados.value = serviciosSeleccionados.value.filter(s => s !== 'Corte con maquina')
  }
}

function calcularSubtotal() {
  return serviciosSeleccionados.value.reduce((total, servicio) => {
    return total + (preciosServicios.value[servicio] || 0)
  }, 0)
}

function calcularDescuento() {
  return esClienteFrecuente() ? calcularSubtotal() * 0.10 : 0
}

function calcularPrecioTotalFinal() {
  const subtotal = calcularSubtotal()
  const descuento = calcularDescuento()
  const propinaVal = Number(propina.value) || 0
  return Math.max(0, subtotal - descuento + propinaVal)
}

// --- SUBIDA DE FOTOS INDIVIDUAL ---
function manejarSubidaFoto(e, tipo) {
  error.value = ''
  const file = e.target.files[0]
  if (!file) return

  if (file.size > 1024 * 1024) {
    error.value = 'Cada imagen debe ser menor a 1MB.'
    return
  }

  const reader = new FileReader()
  reader.onload = (event) => {
    if (tipo === 'antes') fotoAntes.value = event.target.result
    if (tipo === 'despues') fotoDespues.value = event.target.result
  }
  reader.readAsDataURL(file)
}

function eliminarFoto(tipo) {
  if (tipo === 'antes') fotoAntes.value = ''
  if (tipo === 'despues') fotoDespues.value = ''
}

// --- FILTRADO, ORDENAMIENTO Y TURNOS ---
function obtenerServiciosActivos() {
  return servicios.value.filter(s => !s.archivado)
}

function obtenerServiciosOrdenados() {
  const copia = [...obtenerServiciosActivos()]

  if (criterioOrden.value === 'precio') {
    return copia.sort((a, b) => Number(b.precioTotal || 0) - Number(a.precioTotal || 0))
  } else if (criterioOrden.value === 'calificacion') {
    return copia.sort((a, b) => Number(b.calificacion || 0) - Number(a.calificacion || 0))
  } else {
    return copia.sort((a, b) => {
      const fechaA = new Date(`${a.fecha || '1970-01-01'}T${a.hora || '00:00'}`).getTime()
      const fechaB = new Date(`${b.fecha || '1970-01-01'}T${b.hora || '00:00'}`).getTime()
      return fechaB - fechaA
    })
  }
}

function obtenerTurnosDelDia() {
  const grupos = {
    Mañana: [],
    Tarde: [],
    Noche: []
  }

  obtenerServiciosOrdenados().forEach(s => {
    const horaNum = parseInt((s.hora || '00:00').split(':')[0], 10)
    if (horaNum >= 6 && horaNum < 12) {
      grupos.Mañana.push(s)
    } else if (horaNum >= 12 && horaNum < 18) {
      grupos.Tarde.push(s)
    } else {
      grupos.Noche.push(s)
    }
  })

  return grupos
}

// --- ESTADÍSTICAS Y CONSULTAS ---
function obtenerTotalVendido() {
  return obtenerServiciosActivos().reduce((acc, s) => acc + Number(s.precioTotal || 0), 0)
}

function obtenerPromedioCalificacion() {
  const calificados = obtenerServiciosActivos().filter(s => s.calificacion > 0)
  if (calificados.length === 0) return '0'
  const suma = calificados.reduce((acc, s) => acc + s.calificacion, 0)
  return (suma / calificados.length).toFixed(1)
}

function obtenerBarberoTop() {
  const activos = obtenerServiciosActivos()
  if (activos.length === 0) return 'Ninguno'
  const conteo = {}
  activos.forEach(s => {
    conteo[s.barbero] = (conteo[s.barbero] || 0) + 1
  })
  let maxBarbero = 'Ninguno'
  let maxCortes = 0
  for (const b in conteo) {
    if (conteo[b] > maxCortes) {
      maxCortes = conteo[b]
      maxBarbero = b
    }
  }
  return `${maxBarbero} (${maxCortes})`
}

function obtenerHistorialCliente() {
  if (!busquedaCliente.value.trim()) return null
  const query = busquedaCliente.value.toLowerCase().trim()
  const historial = servicios.value.filter(s => s.cliente.toLowerCase().includes(query))
  const totalGastado = historial.reduce((acc, s) => acc + Number(s.precioTotal || 0), 0)
  return {
    visitas: historial.length,
    totalGastado
  }
}

function obtenerDeudasPendientes() {
  const deudas = {}
  obtenerServiciosActivos().forEach(s => {
    if (s.estadoPago === 'Fiado' || s.estadoPago === 'Pendiente') {
      const nombre = s.cliente
      deudas[nombre] = (deudas[nombre] || 0) + Number(s.precioTotal || 0)
    }
  })
  return Object.entries(deudas).map(([cliente, total]) => ({ cliente, total }))
}

function obtenerComisionesBarberos() {
  const comisiones = {}
  obtenerServiciosActivos().forEach(s => {
    if (s.estadoPago === 'Pagado') {
      const b = s.barbero
      comisiones[b] = (comisiones[b] || 0) + (Number(s.precioTotal - (s.propina || 0)) * 0.5)
    }
  })
  return Object.entries(comisiones).map(([barbero, comision]) => ({ barbero, comision }))
}

function obtenerResumenCierreCaja() {
  let efectivo = 0
  let transferencia = 0
  let pendiente = 0

  obtenerServiciosActivos().forEach(s => {
    const monto = Number(s.precioTotal || 0)
    if (s.estadoPago === 'Pagado') {
      if (s.metodoPago === 'Efectivo') efectivo += monto
      else transferencia += monto
    } else {
      pendiente += monto
    }
  })

  return { efectivo, transferencia, pendiente }
}

function archivarCierreCaja() {
  servicios.value = servicios.value.map(s => ({ ...s, archivado: true }))
  persistirDatos()
  mostrarCierreModal.value = false
}

// --- UTILIDADES ---
function obtenerFechaHoy() {
  const hoy = new Date()
  return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`
}

function obtenerHoraActual() {
  const ahora = new Date()
  return `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`
}

function validarHora() {
  if (!fecha.value || !hora.value) return
  const fechaActual = obtenerFechaHoy()
  const horaActual = obtenerHoraActual()

  if (fecha.value === fechaActual && hora.value < horaActual) {
    error.value = 'La hora seleccionada ya transcurrió hoy.'
    hora.value = ''
  } else if (error.value.includes('hora')) {
    error.value = ''
  }
}

function formatearMoneda(valor) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(valor || 0)
}

function agregarOEditarServicioCatalogo() {
  if (!nuevoNombreServicio.value.trim() || nuevoPrecioServicio.value <= 0) return
  preciosServicios.value[nuevoNombreServicio.value.trim()] = Number(nuevoPrecioServicio.value)
  persistirCatalogo()
  nuevoNombreServicio.value = ''
  nuevoPrecioServicio.value = 0
}

function eliminarServicioCatalogo(nombre) {
  delete preciosServicios.value[nombre]
  persistirCatalogo()
}

// --- ACCIONES MODAL ---
function abrirModal() {
  limpiarFormulario()
  modoEdicion.value = false
  mostrarModal.value = true
}

function cerrarModal() {
  mostrarModal.value = false
  limpiarFormulario()
}

function limpiarFormulario() {
  cliente.value = ''
  serviciosSeleccionados.value = []
  barbero.value = ''
  fecha.value = ''
  hora.value = ''
  metodoPago.value = ''
  estadoPago.value = ''
  observaciones.value = ''
  propina.value = 0
  fotoAntes.value = ''
  fotoDespues.value = ''
  error.value = ''
  idEditar.value = null
  modoEdicion.value = false
}

function guardarServicio() {
  error.value = ''

  if (!cliente.value.trim()) { error.value = 'Ingrese el nombre del cliente.'; return }
  if (serviciosSeleccionados.value.length === 0) { error.value = 'Seleccione al menos un servicio.'; return }
  if (!barbero.value) { error.value = 'Seleccione un barbero.'; return }
  if (!fecha.value) { error.value = 'Seleccione la fecha.'; return }
  if (!hora.value) { error.value = 'Seleccione la hora.'; return }
  if (!metodoPago.value) { error.value = 'Seleccione el método de pago.'; return }
  if (!estadoPago.value) { error.value = 'Seleccione el estado del pago.'; return }

  const precioSubtotal = calcularSubtotal()
  const descuentoAplicado = calcularDescuento()
  const propinaMonto = Number(propina.value) || 0
  const total = calcularPrecioTotalFinal()

  const tipoServicioTexto = serviciosSeleccionados.value.join(', ')

  const datosGuardar = {
    cliente: cliente.value.trim(),
    tipoServicio: tipoServicioTexto,
    barbero: barbero.value,
    fecha: fecha.value,
    hora: hora.value,
    precioSubtotal,
    descuento: descuentoAplicado,
    propina: propinaMonto,
    precioTotal: total,
    metodoPago: metodoPago.value,
    estadoPago: estadoPago.value,
    observaciones: observaciones.value.trim(),
    fotoAntes: fotoAntes.value,
    fotoDespues: fotoDespues.value,
    archivado: false
  }

  if (!modoEdicion.value) {
    servicios.value.push({
      id: Date.now(),
      calificacion: 0,
      ...datosGuardar
    })
  } else {
    const index = servicios.value.findIndex(s => s.id === idEditar.value)
    if (index !== -1) {
      servicios.value[index] = {
        ...servicios.value[index],
        ...datosGuardar
      }
    }
  }

  persistirDatos()
  cerrarModal()
}

function calificarServicioPost(idServicio, nota) {
  const index = servicios.value.findIndex(s => s.id === idServicio)
  if (index !== -1) {
    servicios.value[index].calificacion = nota
    persistirDatos()
  }
}

function editarServicio(servicio) {
  modoEdicion.value = true
  idEditar.value = servicio.id
  cliente.value = servicio.cliente
  serviciosSeleccionados.value = servicio.tipoServicio ? servicio.tipoServicio.split(', ') : []
  barbero.value = servicio.barbero
  fecha.value = servicio.fecha || ''
  hora.value = servicio.hora || ''
  metodoPago.value = servicio.metodoPago
  estadoPago.value = servicio.estadoPago
  observaciones.value = servicio.observaciones || ''
  propina.value = servicio.propina || 0
  fotoAntes.value = servicio.fotoAntes || (servicio.fotos && servicio.fotos[0]) || ''
  fotoDespues.value = servicio.fotoDespues || (servicio.fotos && servicio.fotos[1]) || ''
  mostrarModal.value = true
}

function preguntarEliminar(id) {
  idEliminar.value = id
  mostrarConfirmacion.value = true
}

function eliminarServicio() {
  servicios.value = servicios.value.filter(s => s.id !== idEliminar.value)
  persistirDatos()
  mostrarConfirmacion.value = false
  idEliminar.value = null
}

function cancelarEliminar() {
  mostrarConfirmacion.value = false
  idEliminar.value = null
}

function iconoPago(metodo) {
  if (metodo === 'Efectivo') return '💵'
  if (metodo === 'Transferencia') return '📱'
  if (metodo === 'Tarjeta') return '💳'
  return '💰'
}

function estrellas(numero) {
  return '★'.repeat(Math.max(0, Math.min(5, Number(numero) || 0))) + '☆'.repeat(5 - Math.max(0, Math.min(5, Number(numero) || 0)))
}
</script>

<template>
  <div class="app">
    <header>
      <div class="header-titulo">
        <h1>✂️ Barbería Don Ramiro</h1>
        <p>servicio 24/7</p>
      </div>

      <div class="header-acciones">
        <button class="btn-secundario" @click="mostrarCatalogoModal = true">⚙️ Catálogo</button>
        <button class="btn-secundario" @click="mostrarCierreModal = true">🔒 Cerrar Caja</button>
        <button class="btn-principal" @click="abrirModal">+ Registrar Servicio</button>
      </div>
    </header>

    <main class="contenido-principal">
      <section class="estadisticas">
        <div class="estadistica">
          <span>Servicios</span>
          <h2>{{ obtenerServiciosActivos().length }}</h2>
        </div>
        <div class="estadistica">
          <span>Ventas totales</span>
          <h2>{{ formatearMoneda(obtenerTotalVendido()) }}</h2>
        </div>
        <div class="estadistica">
          <span>Promedio Calificación</span>
          <h2>⭐ {{ obtenerPromedioCalificacion() }} / 5</h2>
        </div>
        <div class="estadistica">
          <span>Barbero del Día</span>
          <h2>👑 {{ obtenerBarberoTop() }}</h2>
        </div>
      </section>

      <section class="paneles-secundarios">
        <div class="panel">
          <h3>🔍 Historial por Cliente</h3>
          <input type="text" v-model="busquedaCliente" placeholder="Buscar por nombre..." class="input-busqueda">
          <div v-if="obtenerHistorialCliente()" class="resultado-historial">
            <p>Visitas totales: <strong>{{ obtenerHistorialCliente().visitas }}</strong></p>
            <p>Total gastado: <strong>{{ formatearMoneda(obtenerHistorialCliente().totalGastado) }}</strong></p>
          </div>
        </div>

        <div class="panel">
          <h3>💈 Comisiones (50%)</h3>
          <ul>
            <li v-for="item in obtenerComisionesBarberos()" :key="item.barbero">
              <span>{{ item.barbero }}:</span>
              <strong>{{ formatearMoneda(item.comision) }}</strong>
            </li>
            <li v-if="obtenerComisionesBarberos().length === 0" class="vacio">No hay ventas registradas.</li>
          </ul>
        </div>

        <div class="panel deudas">
          <h3>⚠️ Deudas Pendientes</h3>
          <ul>
            <li v-for="deuda in obtenerDeudasPendientes()" :key="deuda.cliente">
              <span>{{ deuda.cliente }}:</span>
              <strong class="texto-rojo">{{ formatearMoneda(deuda.total) }}</strong>
            </li>
            <li v-if="obtenerDeudasPendientes().length === 0" class="vacio">¡No hay deudas acumuladas!</li>
          </ul>
        </div>
      </section>

      <section class="contenedor">
        <div class="barra-filtros">
          <h2>Servicios Registrados</h2>
          <div class="grupo-ordenar">
            <span class="label-ordenar">Ordenar por:</span>
            <div class="botones-ordenar">
              <button :class="{ activo: criterioOrden === 'fecha' }" @click="criterioOrden = 'fecha'">📅 Fecha</button>
              <button :class="{ activo: criterioOrden === 'precio' }" @click="criterioOrden = 'precio'">💰 Precio</button>
              <button :class="{ activo: criterioOrden === 'calificacion' }" @click="criterioOrden = 'calificacion'">⭐ Calificación</button>
            </div>
          </div>
        </div>

        <div v-if="obtenerServiciosActivos().length === 0" class="sin-servicios">
          <h3>✂️ No hay servicios activos en este turno</h3>
        </div>

        <div v-else class="lista-turnos">
          <div v-for="(listaServicios, nombreTurno) in obtenerTurnosDelDia()" :key="nombreTurno" class="bloque-turno">
            <div v-if="listaServicios.length > 0" class="separador-turno">
              <span>🌅 Turno {{ nombreTurno }}</span>
            </div>

            <div v-if="listaServicios.length > 0" class="lista-servicios">
              <div
                v-for="servicio in listaServicios"
                :key="servicio.id"
                class="tarjeta"
                :class="{
                  tarjetaPendiente: servicio.estadoPago === 'Pendiente',
                  tarjetaFiado: servicio.estadoPago === 'Fiado',
                  tarjetaBaja: servicio.calificacion > 0 && servicio.calificacion <= 2
                }"
              >
                <div class="tarjeta-header">
                  <div class="tarjeta-info-cliente">
                    <h3>{{ servicio.cliente }}</h3>
                    <p class="corte-detalle"><b>✂️ Servicio:</b> {{ servicio.tipoServicio }}</p>
                  </div>
                  <span :class="['badge-pago', servicio.estadoPago.toLowerCase()]">{{ servicio.estadoPago }}</span>
                </div>

                <!-- CONTENEDOR DE FOTOS EN TARJETA -->
                <div v-if="servicio.fotoAntes || servicio.fotoDespues" class="fotos-preview-contenedor">
                  <div v-if="servicio.fotoAntes" class="foto-box">
                    <span class="badge-foto">Antes</span>
                    <img :src="servicio.fotoAntes" alt="Foto Antes" />
                  </div>
                  <div v-if="servicio.fotoDespues" class="foto-box">
                    <span class="badge-foto">Después</span>
                    <img :src="servicio.fotoDespues" alt="Foto Después" />
                  </div>
                </div>

                <div class="calificacion-caja">
                  <span class="titulo-calificacion">Calificación:</span>
                  <div v-if="servicio.calificacion > 0" class="casilla-estrellas">
                    <span class="estrellas-iconos">{{ estrellas(servicio.calificacion) }}</span>
                    <span class="nota-numero">({{ servicio.calificacion }}/5)</span>
                  </div>
                  <div v-else class="estrellas-selector-post">
                    <span
                      v-for="estrella in 5"
                      :key="estrella"
                      class="estrella-opcion-post"
                      @click="calificarServicioPost(servicio.id, estrella)"
                    >★</span>
                  </div>
                </div>

                <div class="informacion">
                  <p>👨‍💼 <b>Barbero:</b> {{ servicio.barbero }}</p>
                  <p>📅 <b>Fecha:</b> {{ servicio.fecha }} | ⏰ {{ servicio.hora }}</p>
                  <p>
                    💰 <b>Precio:</b>
                    <span v-if="servicio.propina > 0">
                      {{ formatearMoneda(servicio.precioSubtotal - servicio.descuento) }} + {{ formatearMoneda(servicio.propina) }} propina =
                    </span>
                    <strong>{{ formatearMoneda(servicio.precioTotal) }}</strong>
                  </p>
                  <p>{{ iconoPago(servicio.metodoPago) }} {{ servicio.metodoPago }}</p>
                  <p v-if="servicio.observaciones">📝 {{ servicio.observaciones }}</p>
                </div>

                <div class="botones">
                  <button class="editar" @click="editarServicio(servicio)">✏️ Editar</button>
                  <button class="eliminar" @click="preguntarEliminar(servicio.id)">🗑️ Eliminar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- MODAL REGISTRO / EDICIÓN -->
    <div v-show="mostrarModal" class="modal-fondo">
      <div class="modal">
        <div class="modal-header">
          <h2>{{ modoEdicion ? '✏️ Editar Servicio' : '✂️ Registrar Servicio' }}</h2>
          <button class="cerrar" @click="cerrarModal">×</button>
        </div>

        <form @submit.prevent="guardarServicio">
          <div v-if="error" class="error">
            <span class="error-icono">⚠️</span>
            <p class="error-texto">{{ error }}</p>
          </div>

          <div v-if="esClienteFrecuente()" class="alerta-fidelidad">
            🎉 ¡Cliente frecuente! Aplica 10% de descuento automáticamente.
          </div>

          <div class="campo">
            <label>Nombre del cliente <span class="obligatorio">*</span></label>
            <input type="text" v-model="cliente" placeholder="Ej. Juan Pérez">
          </div>

          <!-- SELECCIÓN DE SERVICIOS -->
          <div class="campo">
            <label>Servicios realizables <span class="obligatorio">*</span></label>
            <div class="servicios-grid">
              <label
                v-for="(valorPrecio, nombreServicio) in preciosServicios"
                :key="nombreServicio"
                class="servicio-card"
                :class="{ activo: serviciosSeleccionados.includes(nombreServicio) }"
              >
                <input
                  type="checkbox"
                  :value="nombreServicio"
                  v-model="serviciosSeleccionados"
                  @change="seleccionarServicio(nombreServicio)"
                  class="checkbox-oculto"
                >
                <div class="servicio-contenido">
                  <div class="servicio-header">
                    <span class="servicio-nombre">{{ nombreServicio }}</span>
                    <span class="check-badge">
                      <span v-if="serviciosSeleccionados.includes(nombreServicio)">✓</span>
                    </span>
                  </div>
                  <span class="servicio-precio">{{ formatearMoneda(valorPrecio) }}</span>
                </div>
              </label>
            </div>
          </div>

          <div class="campo-doble">
            <div class="campo">
              <label>Barbero <span class="obligatorio">*</span></label>
              <select v-model="barbero">
                <option value="">Seleccione</option>
                <option>Don Ramiro</option>
                <option>Gemelo</option>
                <option>Romeo</option>
              </select>
            </div>

            <div class="campo">
              <label>Propina (Opcional)</label>
              <input type="number" v-model="propina" min="0" step="500" placeholder="0">
            </div>
          </div>

          <div class="campo">
            <label>Precio Final a Cobrar</label>
            <div class="input-moneda">
              <input type="text" :value="formatearMoneda(calcularPrecioTotalFinal())" readonly class="input-precio-calculado">
            </div>
          </div>

          <div class="campo-doble">
            <div class="campo">
              <label>Fecha <span class="obligatorio">*</span></label>
              <input type="date" v-model="fecha" :min="obtenerFechaHoy()" @change="validarHora">
            </div>
            <div class="campo">
              <label>Hora <span class="obligatorio">*</span></label>
              <input type="time" v-model="hora" @input="validarHora">
            </div>
          </div>

          <div class="campo-doble">
            <div class="campo">
              <label>Método de Pago <span class="obligatorio">*</span></label>
              <select v-model="metodoPago">
                <option value="">Seleccione</option>
                <option>Efectivo</option>
                <option>Transferencia</option>
                <option>Tarjeta</option>
              </select>
            </div>
            <div class="campo">
              <label>Estado del Pago <span class="obligatorio">*</span></label>
              <select v-model="estadoPago">
                <option value="">Seleccione</option>
                <option>Pagado</option>
                <option>Pendiente</option>
                <option>Fiado</option>
              </select>
            </div>
          </div>

          <!-- INPUTS DE FOTO SEPARADOS EN MODAL -->
          <div class="campo">
            <label>Foto "Antes" (Opcional)</label>
            <input type="file" accept="image/*" @change="e => manejarSubidaFoto(e, 'antes')">
            <div v-if="fotoAntes" class="foto-contenedor mt-2">
              <img :src="fotoAntes" alt="Vista previa Antes" />
              <button type="button" class="btn-eliminar-foto" @click="eliminarFoto('antes')">×</button>
            </div>
          </div>

          <div class="campo">
            <label>Foto "Después" (Opcional)</label>
            <input type="file" accept="image/*" @change="e => manejarSubidaFoto(e, 'despues')">
            <div v-if="fotoDespues" class="foto-contenedor mt-2">
              <img :src="fotoDespues" alt="Vista previa Después" />
              <button type="button" class="btn-eliminar-foto" @click="eliminarFoto('despues')">×</button>
            </div>
          </div>

          <div class="campo">
            <label>Observaciones</label>
            <textarea v-model="observaciones" placeholder="Notas adicionales..."></textarea>
          </div>

          <div class="acciones-formulario">
            <button type="button" class="cancelar" @click="cerrarModal">Cancelar</button>
            <button type="submit" class="guardar">Guardar Servicio</button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL CIERRE DE CAJA -->
    <div v-show="mostrarCierreModal" class="modal-fondo">
      <div class="modal">
        <div class="modal-header">
          <h2>🔒 Cierre de Caja Diario</h2>
          <button class="cerrar" @click="mostrarCierreModal = false">×</button>
        </div>
        <div class="cierre-resumen">
          <p>💵 Total en Efectivo: <strong>{{ formatearMoneda(obtenerResumenCierreCaja().efectivo) }}</strong></p>
          <p>📱 Total Transferencias: <strong>{{ formatearMoneda(obtenerResumenCierreCaja().transferencia) }}</strong></p>
          <p>⏳ Pendientes por Cobrar: <strong>{{ formatearMoneda(obtenerResumenCierreCaja().pendiente) }}</strong></p>
          <hr />
          <p class="advertencia">Al archivar, estos servicios dejarán de mostrarse en la pantalla principal.</p>
        </div>
        <div class="acciones-formulario">
          <button class="cancelar" @click="mostrarCierreModal = false">Cancelar</button>
          <button class="guardar" @click="archivarCierreCaja">📦 Archivar Servicios del Día</button>
        </div>
      </div>
    </div>

    <!-- MODAL CATÁLOGO EDITABLE -->
    <div v-show="mostrarCatalogoModal" class="modal-fondo">
      <div class="modal">
        <div class="modal-header">
          <h2>⚙️ Catálogo de Servicios</h2>
          <button class="cerrar" @click="mostrarCatalogoModal = false">×</button>
        </div>
        <div class="formulario-catalogo">
          <input type="text" v-model="nuevoNombreServicio" placeholder="Nombre servicio (Ej. Corte Especial)">
          <input type="number" v-model="nuevoPrecioServicio" placeholder="Precio Base">
          <button class="guardar" @click="agregarOEditarServicioCatalogo">Guardar / Añadir</button>
        </div>
        <ul class="lista-catalogo">
          <li v-for="(precio, nombre) in preciosServicios" :key="nombre">
            <span>{{ nombre }} - <strong>{{ formatearMoneda(precio) }}</strong></span>
            <button class="btn-eliminar-item" @click="eliminarServicioCatalogo(nombre)">🗑️</button>
          </li>
        </ul>
      </div>
    </div>

    <!-- MODAL CONFIRMACIÓN ELIMINACIÓN -->
    <div v-show="mostrarConfirmacion" class="modal-fondo">
      <div class="confirmacion">
        <h2>¿Eliminar servicio?</h2>
        <p>Esta acción eliminará el registro permanentemente.</p>

        <div class="acciones-confirmacion">
          <button class="cancelar" @click="cancelarEliminar">Cancelar</button>
          <button class="eliminar" @click="eliminarServicio">Sí, eliminar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: #f4f6f8;
  font-family: 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
  color: #2c3e50;
  line-height: 1.5;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.contenido-principal {
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  padding: 20px 16px 40px;
}

/* ENCABEZADO */
header {
  background: #1a1a1a;
  color: white;
  padding: 20px 5%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.header-titulo h1 {
  font-size: 1.5rem;
  line-height: 1.2;
}

.header-titulo p {
  font-size: 0.875rem;
  color: #94a3b8;
}

.header-acciones {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

button {
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

button:active {
  transform: scale(0.98);
}

.btn-principal {
  background: #d4a017;
  color: white;
}

.btn-principal:hover {
  background: #b88a13;
}

.btn-secundario {
  background: #334155;
  color: white;
}

.btn-secundario:hover {
  background: #475569;
}

/* ESTADÍSTICAS */
.estadisticas {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.estadistica {
  background: white;
  padding: 18px 20px;
  border-radius: 12px;
  border-left: 5px solid #d4a017;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.estadistica span {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #64748b;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.estadistica h2 {
  margin-top: 6px;
  font-size: 1.35rem;
  color: #1a1a1a;
  word-break: break-word;
}

/* PANELES SECUNDARIOS */
.paneles-secundarios {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 28px;
}

.panel {
  background: white;
  padding: 18px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.panel h3 {
  font-size: 0.95rem;
  margin-bottom: 12px;
  color: #1e293b;
}

.input-busqueda {
  margin-bottom: 12px;
}

.resultado-historial p {
  font-size: 0.85rem;
  margin-top: 4px;
}

.panel ul {
  list-style: none;
}

.panel li {
  font-size: 0.85rem;
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px dashed #f1f5f9;
}

.panel li:last-child {
  border-bottom: none;
}

.texto-rojo {
  color: #dc2626;
}

.vacio {
  color: #94a3b8;
  font-style: italic;
}

/* CONTENEDOR Y BARRA DE FILTROS */
.contenedor {
  width: 100%;
}

.barra-filtros {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 20px;
}

.barra-filtros h2 {
  font-size: 1.25rem;
}

.grupo-ordenar {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.label-ordenar {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 600;
}

.botones-ordenar {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.grupo-ordenar button {
  background: #e2e8f0;
  color: #475569;
  padding: 6px 12px;
  font-size: 0.8rem;
}

.grupo-ordenar button.activo {
  background: #d4a017;
  color: white;
  box-shadow: 0 2px 6px rgba(212, 160, 23, 0.3);
}

.sin-servicios {
  text-align: center;
  padding: 40px 20px;
  background: white;
  border-radius: 12px;
  color: #64748b;
}

.separador-turno {
  background: #cbd5e1;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 700;
  margin: 20px 0 12px;
  color: #1e293b;
  font-size: 0.9rem;
}

/* LISTA DE SERVICIOS */
.lista-servicios {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 18px;
}

.tarjeta {
  background: white;
  border-radius: 12px;
  padding: 18px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  border-left: 5px solid #2ecc71;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.tarjetaPendiente { border-left-color: #f39c12; }
.tarjetaFiado { border-left-color: #e74c3c; }
.tarjetaBaja { background: #fff8f8; }

.tarjeta-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 12px;
}

.tarjeta-info-cliente h3 {
  font-size: 1.05rem;
  line-height: 1.3;
}

.corte-detalle {
  font-size: 0.8rem;
  color: #475569;
  margin-top: 2px;
}

.badge-pago {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  white-space: nowrap;
}

.pagado { background: #d1fae5; color: #065f46; }
.pendiente { background: #fef3c7; color: #92400e; }
.fiado { background: #fee2e2; color: #991b1b; }

/* CONTENEDOR DE FOTOS EN LA TARJETA */
.fotos-preview-contenedor {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
  margin: 12px 0;
}

.foto-box {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
}

.badge-foto {
  position: absolute;
  top: 6px;
  left: 6px;
  background: rgba(0, 0, 0, 0.75);
  color: #ffffff;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  z-index: 2;
}

.foto-box img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  display: block;
}

.calificacion-caja {
  margin: 10px 0;
}

.titulo-calificacion {
  display: block;
  font-weight: 600;
  font-size: 0.8rem;
  margin-bottom: 4px;
}

.estrellas-selector-post {
  display: flex;
  gap: 6px;
  background: #f8f9fa;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 6px;
}

.estrella-opcion-post {
  font-size: 18px;
  color: #cbd5e1;
  cursor: pointer;
  touch-action: manipulation;
}

.estrella-opcion-post:hover { color: #f59e0b; }

.informacion p {
  margin: 6px 0;
  font-size: 0.85rem;
  word-break: break-word;
}

.botones {
  display: flex;
  gap: 10px;
  margin-top: 16px;
}

.editar { background: #2563eb; color: white; flex: 1; }
.eliminar { background: #dc2626; color: white; flex: 1; }

/* MODALES Y FORMULARIO */
.modal-fondo {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(4px);
  display: flex; justify-content: center; align-items: center;
  padding: 16px;
  z-index: 100;
}

.modal {
  background: white;
  width: 100%;
  max-width: 580px;
  border-radius: 16px;
  padding: 24px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.modal-header h2 {
  font-size: 1.25rem;
}

.cerrar {
  background: transparent;
  font-size: 28px;
  color: #64748b;
  padding: 0 8px;
  line-height: 1;
}

.error {
  background: #fef2f2;
  border: 1px solid #fca5a5;
  color: #991b1b;
  padding: 10px 14px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  margin-bottom: 14px;
}

.alerta-fidelidad {
  background: #fef3c7;
  color: #92400e;
  padding: 10px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 0.8rem;
  margin-bottom: 14px;
}

.campo {
  margin-bottom: 14px;
}

.campo-doble {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
}

form label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 6px;
}

.obligatorio {
  color: #dc2626;
}

input, select, textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.9rem;
  background-color: white;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #d4a017;
  box-shadow: 0 0 0 3px rgba(212, 160, 23, 0.2);
}

/* TARJETAS INTERACTIVAS DE SELECCIÓN DE SERVICIOS */
.servicios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
  margin-top: 6px;
}

.servicio-card {
  position: relative;
  background: #ffffff;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
  display: flex;
  flex-direction: column;
}

.servicio-card:hover {
  border-color: #cbd5e1;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.servicio-card.activo {
  border-color: #d4a017;
  background: #fffdf7;
  box-shadow: 0 4px 14px rgba(212, 160, 23, 0.18);
}

.checkbox-oculto {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
}

.servicio-contenido {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  gap: 8px;
}

.servicio-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 6px;
}

.servicio-nombre {
  font-size: 0.85rem;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.3;
}

.servicio-card.activo .servicio-nombre {
  color: #785809;
}

.check-badge {
  width: 18px;
  height: 18px;
  min-width: 18px;
  border-radius: 50%;
  border: 2px solid #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
  color: white;
  transition: all 0.2s ease;
}

.servicio-card.activo .check-badge {
  background: #d4a017;
  border-color: #d4a017;
}

.servicio-precio {
  font-size: 0.85rem;
  font-weight: 700;
  color: #64748b;
}

.servicio-card.activo .servicio-precio {
  color: #d4a017;
}

/* FOTOS SUBIDAS EN MODAL */
.foto-contenedor {
  position: relative;
  display: inline-block;
}

.foto-contenedor img {
  width: 110px;
  height: 110px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
}

.btn-eliminar-foto {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #dc2626;
  color: white;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  font-size: 12px;
  padding: 0;
}

.mt-2 {
  margin-top: 8px;
}

.acciones-formulario {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.acciones-formulario button {
  flex: 1;
  min-width: 120px;
}

.guardar { background: #d4a017; color: white; }
.cancelar { background: #e2e8f0; color: #475569; }

/* MODAL CATÁLOGO Y RESUMEN */
.formulario-catalogo {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.formulario-catalogo input {
  flex: 1;
  min-width: 140px;
}

.lista-catalogo li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.875rem;
}

.btn-eliminar-item {
  background: transparent;
  color: #dc2626;
  padding: 4px 8px;
}

.cierre-resumen p {
  font-size: 0.9rem;
  margin: 10px 0;
}

.advertencia {
  color: #64748b;
  font-size: 0.8rem;
  margin-top: 10px;
}

.confirmacion {
  background: white;
  padding: 24px;
  border-radius: 12px;
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.confirmacion p {
  margin: 12px 0 20px;
  font-size: 0.9rem;
  color: #64748b;
}

.acciones-confirmacion {
  display: flex;
  gap: 10px;
}

.acciones-confirmacion button {
  flex: 1;
}

/* RESPONSIVO ESPECÍFICO DISPOSITIVOS MÓVILES */
@media (max-width: 640px) {
  header {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }

  .header-acciones {
    flex-direction: column;
  }

  .header-acciones button {
    width: 100%;
  }

  .barra-filtros {
    flex-direction: column;
    align-items: stretch;
  }

  .grupo-ordenar {
    flex-direction: column;
    align-items: stretch;
  }

  .botones-ordenar {
    width: 100%;
  }

  .botones-ordenar button {
    flex: 1;
  }

  .servicios-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .formulario-catalogo {
    flex-direction: column;
  }

  .formulario-catalogo input, 
  .formulario-catalogo button {
    width: 100%;
  }

  .modal {
    padding: 18px;
    border-radius: 12px;
  }

  .acciones-formulario {
    flex-direction: column-reverse;
  }

  .acciones-formulario button {
    width: 100%;
  }
}
</style>
<!-- Quasar Servicios -->
