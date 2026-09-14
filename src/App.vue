<script setup>
import { ref } from 'vue'

const serviciosGuardados = localStorage.getItem('servicios-barberia')
const servicios = ref(serviciosGuardados ? JSON.parse(serviciosGuardados) : [])

function persistirDatos() {
  localStorage.setItem('servicios-barberia', JSON.stringify(servicios.value))
}

const preciosServicios = {
  'Corte con maquina': 20000,
  'corte con tijera': 25000,
  'Barba': 10000,
  'limpieza facial': 60000,
  'Cejas': 5000,
  'Tinte': 40000
}

const mostrarModal = ref(false)
const modoEdicion = ref(false)
const mostrarConfirmacion = ref(false)

const idEliminar = ref(null)
const idEditar = ref(null)
const error = ref('')

const cliente = ref('')
const serviciosSeleccionados = ref([])
const barbero = ref('')
const fecha = ref('')
const hora = ref('')
const metodoPago = ref('')
const estadoPago = ref('')
const observaciones = ref('')

// Función para alternar el tipo de corte sin bloquear la selección
function seleccionarServicio(nombreServicio) {
  if (nombreServicio === 'Corte con maquina' && serviciosSeleccionados.value.includes('corte con tijera')) {
    serviciosSeleccionados.value = serviciosSeleccionados.value.filter(s => s !== 'corte con tijera')
  } else if (nombreServicio === 'corte con tijera' && serviciosSeleccionados.value.includes('Corte con maquina')) {
    serviciosSeleccionados.value = serviciosSeleccionados.value.filter(s => s !== 'Corte con maquina')
  }
}

function calcularPrecioActual() {
  return serviciosSeleccionados.value.reduce((total, servicio) => {
    return total + (preciosServicios[servicio] || 0)
  }, 0)
}

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
    error.value = 'La hora seleccionada ya transcurrió hoy. Ingrese una hora igual o posterior a la actual.'
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
  error.value = ''
  idEditar.value = null
}

function guardarServicio() {
  error.value = ''

  if (!cliente.value.trim()) {
    error.value = 'Por favor, ingrese el nombre del cliente.'
    return
  }
  if (serviciosSeleccionados.value.length === 0) {
    error.value = 'Por favor, seleccione al menos un corte o servicio.'
    return
  }
  if (!barbero.value) {
    error.value = 'Por favor, seleccione un barbero.'
    return
  }
  if (!fecha.value) {
    error.value = 'Por favor, seleccione la fecha.'
    return
  }
  if (!hora.value) {
    error.value = 'Por favor, seleccione la hora.'
    return
  }
  if (!metodoPago.value) {
    error.value = 'Por favor, seleccione el método de pago.'
    return
  }
  if (!estadoPago.value) {
    error.value = 'Por favor, seleccione el estado del pago.'
    return
  }

  const fechaActualStr = obtenerFechaHoy()
  const horaActualStr = obtenerHoraActual()

  if (fecha.value < fechaActualStr) {
    error.value = 'La fecha del servicio no puede ser anterior al día de hoy.'
    return
  }

  if (fecha.value === fechaActualStr && hora.value < horaActualStr) {
    error.value = 'La hora seleccionada ya transcurrió hoy. Ingresa una hora igual o posterior a la actual.'
    hora.value = ''
    return
  }

  const precioFinal = calcularPrecioActual()
  if (precioFinal <= 0) {
    error.value = 'El precio debe ser mayor a $0.'
    return
  }

  const tipoServicioTexto = serviciosSeleccionados.value.join(', ')

  if (!modoEdicion.value) {
    servicios.value.push({
      id: Date.now(),
      cliente: cliente.value.trim(),
      tipoServicio: tipoServicioTexto,
      calificacion: 0,
      barbero: barbero.value,
      fecha: fecha.value,
      hora: hora.value,
      precio: precioFinal,
      metodoPago: metodoPago.value,
      estadoPago: estadoPago.value,
      observaciones: observaciones.value.trim()
    })
  } else {
    const index = servicios.value.findIndex(s => s.id === idEditar.value)
    if (index !== -1) {
      servicios.value[index] = {
        ...servicios.value[index],
        cliente: cliente.value.trim(),
        tipoServicio: tipoServicioTexto,
        barbero: barbero.value,
        fecha: fecha.value,
        hora: hora.value,
        precio: precioFinal,
        metodoPago: metodoPago.value,
        estadoPago: estadoPago.value,
        observaciones: observaciones.value.trim()
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

function totalServicios() {
  return servicios.value.length
}

function totalVentas() {
  return servicios.value.reduce((acc, s) => acc + Number(s.precio || 0), 0)
}

function totalPendiente() {
  return servicios.value
    .filter(s => s.estadoPago === 'Pendiente' || s.estadoPago === 'Fiado')
    .reduce((acc, s) => acc + Number(s.precio || 0), 0)
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
      <div>
        <h1>✂️ Barbería Don Ramiro</h1>
        <p>Registro de servicios 24/7</p>
      </div>

      <button @click="abrirModal">
        + Registrar servicio
      </button>
    </header>

    <section class="estadisticas">
      <div class="estadistica">
        <span>Servicios</span>
        <h2>{{ totalServicios() }}</h2>
      </div>

      <div class="estadistica">
        <span>Ventas totales</span>
        <h2>{{ formatearMoneda(totalVentas()) }}</h2>
      </div>

      <div class="estadistica pendiente">
        <span>Dinero pendiente</span>
        <h2>{{ formatearMoneda(totalPendiente()) }}</h2>
      </div>
    </section>

    <section class="contenedor">
      <h2>Servicios registrados</h2>

      <div v-if="servicios.length === 0" class="sin-servicios">
        <h3>✂️ Aún no hay servicios</h3>
        <p>Registra el primer servicio de la barbería.</p>
      </div>

      <div v-else class="lista-servicios">
        <div
          v-for="servicio in servicios"
          :key="servicio.id"
          class="tarjeta"
          :class="{
            tarjetaPendiente: servicio.estadoPago === 'Pendiente',
            tarjetaFiado: servicio.estadoPago === 'Fiado',
            tarjetaBaja: servicio.calificacion > 0 && servicio.calificacion <= 2
          }"
        >
          <div class="tarjeta-header">
            <div>
              <h3>{{ servicio.cliente }}</h3>
              <p class="corte-detalle">
                <b>✂️ Corte / Servicio:</b> {{ servicio.tipoServicio }}
              </p>
            </div>

            <span v-if="servicio.estadoPago === 'Pagado'" class="pagado">
              Pagado
            </span>
            <span v-else-if="servicio.estadoPago === 'Pendiente'" class="pendiente">
              ⏳ Pendiente
            </span>
            <span v-else class="fiado">
              Fiado
            </span>
          </div>

          <div class="calificacion-caja">
            <span class="titulo-calificacion">Calificación del corte:</span>

            <div v-if="servicio.calificacion > 0" class="casilla-estrellas" :class="{ 'baja-calificacion': servicio.calificacion <= 2 }">
              <span class="estrellas-iconos">{{ estrellas(servicio.calificacion) }}</span>
              <span class="nota-numero">({{ servicio.calificacion }}/5)</span>
            </div>

            <div v-else class="estrellas-selector-post">
              <span
                v-for="estrella in 5"
                :key="estrella"
                class="estrella-opcion-post"
                @click="calificarServicioPost(servicio.id, estrella)"
              >
                ★
              </span>
              <span class="indicacion-click"></span>
            </div>
          </div>

          <div class="informacion">
            <p>👨‍💼 <b>Barbero:</b> {{ servicio.barbero }}</p>
            <p>📅 <b>Fecha:</b> {{ servicio.fecha }} | ⏰ <b>Hora:</b> {{ servicio.hora }}</p>
            <p>💰 <b>Precio total:</b> {{ formatearMoneda(servicio.precio) }}</p>
            <p>{{ iconoPago(servicio.metodoPago) }} {{ servicio.metodoPago }}</p>

            <p v-if="servicio.observaciones">
              📝 {{ servicio.observaciones }}
            </p>
          </div>

          <div class="botones">
            <button class="editar" @click="editarServicio(servicio)">
              ✏️ Editar
            </button>
            <button class="eliminar" @click="preguntarEliminar(servicio.id)">
              🗑️ Eliminar
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- MODAL REGISTRO / EDICIÓN -->
    <div v-show="mostrarModal" class="modal-fondo">
      <div class="modal">

        <div class="modal-header">
          <h2>{{ modoEdicion ? '✏️ Editar servicio' : '✂️ Registrar servicio' }}</h2>
          <button class="cerrar" @click="cerrarModal">×</button>
        </div>

        <form @submit.prevent="guardarServicio">
          <div v-if="error" class="error">
            <span class="error-icono">⚠️</span>
            <p class="error-texto">{{ error }}</p>
          </div>

          <div class="campo">
            <label>Nombre del cliente <span class="obligatorio">*</span></label>
            <input type="text" v-model="cliente" placeholder="">
          </div>

          <div class="campo">
            <label>Corte / Servicios realizados <span class="obligatorio">*</span></label>
            <div class="checkbox-group">
              <label
                v-for="(valorPrecio, nombreServicio) in preciosServicios"
                :key="nombreServicio"
                class="checkbox-item"
                :class="{ seleccionado: serviciosSeleccionados.includes(nombreServicio) }"
              >
                <input
                  type="checkbox"
                  :value="nombreServicio"
                  v-model="serviciosSeleccionados"
                  @change="seleccionarServicio(nombreServicio)"
                >
                <span>{{ nombreServicio }} <strong>({{ formatearMoneda(valorPrecio) }})</strong></span>
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
              <label>Precio total</label>
              <div class="input-moneda">
                <span>$</span>
                <input type="text" :value="formatearMoneda(calcularPrecioActual())" readonly class="input-precio-calculado">
              </div>
            </div>
          </div>

          <div class="campo-doble">
            <div class="campo">
              <label>Fecha <span class="obligatorio">*</span></label>
              <input 
                type="date" 
                v-model="fecha" 
                :min="obtenerFechaHoy()"
                @change="validarHora"
              >
            </div>

            <div class="campo">
              <label>Hora <span class="obligatorio">*</span></label>
              <input 
                type="time" 
                v-model="hora"
                :min="fecha === obtenerFechaHoy() ? obtenerHoraActual() : null"
                @input="validarHora"
                @change="validarHora"
              >
            </div>
          </div>

          <div class="campo-doble">
            <div class="campo">
              <label>Método de pago <span class="obligatorio">*</span></label>
              <select v-model="metodoPago">
                <option value="">Seleccione</option>
                <option>Efectivo</option>
                <option>Transferencia</option>
                <option>Tarjeta</option>
              </select>
            </div>

            <div class="campo">
              <label>Estado del pago <span class="obligatorio">*</span></label>
              <select v-model="estadoPago">
                <option value="">Seleccione</option>
                <option>Pagado</option>
                <option>Pendiente</option>
                <option>Fiado</option>
              </select>
            </div>
          </div>

          <div class="campo">
            <label>Observaciones</label>
            <textarea v-model="observaciones" placeholder="Detalles o notas adicionales..."></textarea>
          </div>

          <div class="acciones-formulario">
            <button type="button" class="cancelar" @click="cerrarModal">Cancelar</button>
            <button type="submit" class="guardar">Guardar servicio</button>
          </div>
        </form>

      </div>
    </div>

    <!-- MODAL CONFIRMACIÓN ELIMINACIÓN -->
    <div v-show="mostrarConfirmacion" class="modal-fondo">
      <div class="confirmacion">
        <h2>¿Eliminar servicio?</h2>
        <p>Esta acción eliminará el registro permanentemente.</p>
        <div>
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
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  color: #2c3e50;
}

.app {
  min-height: 100vh;
}

header {
  background: #1a1a1a;
  color: white;
  padding: 22px 8%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

header h1 {
  font-size: 26px;
  letter-spacing: 0.5px;
}

header p {
  color: #aaa;
  margin-top: 4px;
  font-size: 14px;
}

button {
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  background: #d4a017;
  color: white;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s ease;
}

button:hover {
  background: #c29213;
  transform: translateY(-1px);
}

.estadisticas {
  padding: 25px 8%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.estadistica {
  background: white;
  padding: 20px;
  border-radius: 12px;
  border-left: 5px solid #d4a017;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.estadistica span {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #666;
  font-weight: 600;
}

.estadistica h2 {
  margin-top: 8px;
  font-size: 24px;
  color: #1a1a1a;
}

.estadistica.pendiente {
  border-left-color: #e74c3c;
}

.contenedor {
  padding: 10px 8% 40px;
}

.contenedor h2 {
  margin-bottom: 20px;
  font-size: 22px;
}

.lista-servicios {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.tarjeta {
  background: white;
  border-radius: 12px;
  padding: 22px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  border-left: 5px solid #2ecc71;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.tarjetaPendiente {
  border-left-color: #f39c12;
}

.tarjetaFiado {
  border-left-color: #e74c3c;
}

.tarjetaBaja {
  background: #fff8f8;
}

.tarjeta-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.tarjeta-header h3 {
  font-size: 19px;
  color: #111;
}

.corte-detalle {
  color: #555;
  margin-top: 6px;
  font-size: 14px;
  line-height: 1.4;
}

.calificacion-caja {
  margin: 12px 0;
}

.titulo-calificacion {
  display: block;
  font-weight: 600;
  font-size: 13px;
  margin-bottom: 6px;
  color: #444;
}

.estrellas-selector-post {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f8f9fa;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 12px;
}

.estrella-opcion-post {
  font-size: 22px;
  color: #cbd5e1;
  cursor: pointer;
  transition: color 0.15s, transform 0.1s;
  user-select: none;
}

.estrella-opcion-post:hover {
  color: #f59e0b;
  transform: scale(1.2);
}

.indicacion-click {
  font-size: 12px;
  color: #64748b;
  margin-left: 6px;
}

.casilla-estrellas {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: ghostwhite;
  border: 1px solid #fde68a;
  padding: 6px 12px;
  border-radius: 6px;
}

.casilla-estrellas.baja-calificacion {
  background: #fef2f2;
  border-color: #fecaca;
}

.estrellas-iconos {
  color: #f59e0b;
  font-size: 15px;
  letter-spacing: 2px;
}

.nota-numero {
  font-weight: 700;
  font-size: 12px;
  color: #475569;
}

.informacion p {
  margin: 8px 0;
  font-size: 14px;
}

.pagado {
  background: #d1fae5;
  color: #065f46;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
}

.pendiente {
  background: #fef3c7;
  color: #92400e;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
}

.fiado {
  background: #fee2e2;
  color: #991b1b;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
}

.botones {
  display: flex;
  gap: 10px;
  margin-top: 18px;
}

.editar {
  background: #2563eb;
  flex: 1;
}

.editar:hover {
  background: #1d4ed8;
}

.eliminar {
  background: #dc2626;
  flex: 1;
}

.eliminar:hover {
  background: #b91c1c;
}

.modal-fondo {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  z-index: 100;
}

.modal {
  background: white;
  width: 100%;
  max-width: 580px;
  border-radius: 16px;
  padding: 28px;
  max-height: 88vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 22px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h2 {
  font-size: 20px;
  color: #0f172a;
}

.cerrar {
  background: transparent;
  color: #64748b;
  font-size: 28px;
  padding: 0;
  line-height: 1;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cerrar:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.campo {
  margin-bottom: 16px;
}

.campo-doble {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

form label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 6px;
}

.obligatorio {
  color: #e11d48;
}

input,
select,
textarea {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  color: #1e293b;
  background-color: #fff;
  transition: border-color 0.2s, box-shadow 0.2s;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #d4a017;
  box-shadow: 0 0 0 3px rgba(212, 160, 23, 0.18);
}

.input-moneda {
  position: relative;
  display: flex;
  align-items: center;
}

.input-precio-calculado {
  background-color: #f8fafc;
  font-weight: bold;
  color: #0f172a;
}

.checkbox-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 8px;
  background: #f8fafc;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  padding: 8px 10px;
  border-radius: 6px;
  background: white;
  border: 1px solid #cbd5e1;
  cursor: pointer;
  transition: all 0.15s ease;
}

.checkbox-item:hover {
  border-color: #d4a017;
}

.checkbox-item.seleccionado {
  background: #fefce8;
  border-color: #d4a017;
}

.checkbox-item input {
  width: 16px;
  height: 16px;
  accent-color: #d4a017;
  cursor: pointer;
}

textarea {
  min-height: 75px;
  resize: vertical;
}

.error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 18px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.error-icono {
  font-size: 16px;
  margin-top: 1px;
}

.error-texto {
  font-size: 13px;
  white-space: pre-line;
  line-height: 1.5;
  font-weight: 500;
}

.acciones-formulario {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
  padding-top: 14px;
  border-top: 1px solid #e2e8f0;
}

.guardar {
  background: #d4a017;
}

.guardar:hover {
  background: #c29213;
}

.cancelar {
  background: #e2e8f0;
  color: #475569;
}

.cancelar:hover {
  background: #cbd5e1;
  color: #0f172a;
}

.confirmacion {
  background: white;
  width: 100%;
  max-width: 420px;
  border-radius: 14px;
  padding: 24px;
  text-align: center;
}

.confirmacion p {
  margin: 14px 0 22px;
  color: #64748b;
  font-size: 14px;
}

.confirmacion div {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.sin-servicios {
  text-align: center;
  background: white;
  padding: 50px;
  border-radius: 12px;
}

@media (max-width: 992px) {
  .lista-servicios {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .estadisticas {
    grid-template-columns: 1fr;
  }

  .campo-doble {
    grid-template-columns: 1fr;
  }

  .lista-servicios {
    grid-template-columns: 1fr;
  }
}
</style>