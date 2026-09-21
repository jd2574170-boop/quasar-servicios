<!-- src/views/Biblioteca.vue -->
<template>
  <q-page class="q-pa-md bg-grey-2 flex flex-center">
    <div class="full-width max-width-container">

      <!-- Hero Banner -->
      <q-card flat class="overflow-hidden rounded-borders-lg shadow-3 q-mb-md">
        <q-img src="../img/biblioteca.jpeg" height="340px" fit="cover">
          <template v-slot:error>
            <div class="absolute-full flex flex-center bg-grey-3 text-grey-7">
              <q-icon name="image_not_supported" size="48px" />
            </div>
          </template>
          <div class="absolute-full hero-gradient flex items-end q-pa-lg">
            <div class="row full-width items-center justify-between">
              <div class="row items-center q-gutter-x-md">
                <q-avatar size="56px" color="teal-8" text-color="white" icon="menu_book" class="shadow-4" />
                <div>
                  <div class="text-h5 text-weight-bolder text-white tracking-wide">Servicio de Biblioteca</div>
                  <div class="text-subtitle2 text-teal-1 opacity-90">Centro Agroturístico SENA - San Gil</div>
                </div>
              </div>
              <q-chip color="positive" text-color="white" icon="fiber_manual_record" class="text-weight-bold shadow-2 desktop-only">
                Servicio Disponible
              </q-chip>
            </div>
          </div>
        </q-img>
      </q-card>

      <!-- Grid Layout -->
      <div class="row q-col-gutter-md">

        <!-- FILA 1: Izquierda (Descripción del servicio) -->
        <div class="col-12 col-md-7">
          <q-card flat class="shadow-2 rounded-borders-lg bg-white border-left-accent full-height column justify-between">
            <q-card-section class="q-pa-lg">
              <div class="row items-center q-mb-sm">
                <q-avatar size="36px" color="teal-1" text-color="teal-9" icon="info" class="q-mr-sm" />
                <div class="text-h6 text-weight-bold text-grey-9">Descripción del Servicio</div>
              </div>
              <q-separator class="q-mb-md" color="grey-3" />
              <p class="description-text text-grey-8 q-mb-md">
                Ofrece consultas en sala, préstamos a domicilio, préstamo interbibliotecario (PIP), talleres de lectura, capacitaciones, acceso a TIC, asesorías en búsqueda de información y asesorías en el uso adecuado del catálogo bibliográfico.
              </p>

              <!-- Features / Chips decorativos -->
              <div class="row q-gutter-xs q-pt-xs">
                <q-chip outline color="teal-8" icon="auto_stories" size="sm" class="text-weight-bold">
                  Consultas en Sala
                </q-chip>
                <q-chip outline color="teal-8" icon="swap_horiz" size="sm" class="text-weight-bold">
                  Préstamo PIP
                </q-chip>
                <q-chip outline color="teal-8" icon="computer" size="sm" class="text-weight-bold">
                  Acceso a TIC
                </q-chip>
                <q-chip outline color="teal-8" icon="school" size="sm" class="text-weight-bold">
                  Capacitaciones
                </q-chip>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- FILA 1: Derecha (Contacto y Encargado) -->
        <div class="col-12 col-md-5">
          <q-card flat class="shadow-2 rounded-borders-lg bg-white text-center full-height">
            <q-card-section class="q-pa-lg column items-center justify-center">
              <div class="row items-center justify-center q-mb-md">
                <q-icon name="badge" color="teal-8" size="22px" class="q-mr-xs" />
                <div class="text-subtitle1 text-weight-bold text-grey-9">Encargado del Servicio</div>
              </div>

              <!-- Foto estilizada estática -->
              <div class="avatar-wrapper q-mb-sm">
                <div class="avatar-ring">
                  <q-avatar size="105px" class="shadow-4">
                    <img src="../img/bibliotecaria.jpeg" alt="Yudith Milagros Martínez Bautista" class="avatar-image" />
                  </q-avatar>
                </div>
                <div class="verified-badge flex flex-center shadow-3">
                  <q-icon name="verified" color="teal-8" size="20px" />
                </div>
              </div>

              <div class="text-subtitle1 text-weight-bolder text-grey-9 q-mt-xs">
                Yudith Milagros Martínez Bautista
              </div>
              <q-chip color="teal-1" text-color="teal-9" size="sm" class="text-weight-bold q-mb-md">
                Bibliotecaria
              </q-chip>

              <!-- Botones estáticos de contacto (sin clic/redirección) -->
              <div class="full-width q-gutter-y-sm">
                <q-btn
                  unelevated
                  no-caps
                  color="teal-8"
                  icon="email"
                  label="ymmartinez@sena.edu.co"
                  :ripple="false"
                  class="full-width rounded-borders text-weight-bold shadow-1 static-btn"
                />
                <q-btn
                  outline
                  no-caps
                  color="teal-9"
                  icon="phone"
                  label="+57 312 584 8032"
                  :ripple="false"
                  class="full-width rounded-borders text-weight-bold static-btn"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- FILA 2: Horarios Ancho Completo -->
        <div class="col-12">
          <q-card flat class="shadow-2 rounded-borders-lg bg-white">
            <q-card-section class="q-pa-lg">
              <div class="row items-center justify-between q-mb-sm">
                <div class="row items-center">
                  <q-avatar size="36px" color="teal-1" text-color="teal-9" icon="schedule" class="q-mr-sm" />
                  <div class="text-h6 text-weight-bold text-grey-9">Horarios de Atención</div>
                </div>
                <q-badge color="teal-1" text-color="teal-9" class="q-px-md q-py-xs text-weight-bold rounded-borders">
                  Jornada Continua
                </q-badge>
              </div>
              <q-separator class="q-mb-md" color="grey-3" />

              <q-markup-table flat class="styled-table">
                <thead>
                  <tr class="bg-teal-1 text-teal-10 text-left">
                    <th class="text-weight-bolder text-subtitle2">Día</th>
                    <th class="text-center text-weight-bolder text-subtitle2">Jornada de Atención</th>
                  </tr>
                </thead>
                <tbody class="text-grey-8">
                  <tr v-for="item in horarios" :key="item.dia">
                    <td class="text-weight-bold text-subtitle2 text-grey-9">{{ item.dia }}</td>
                    <td class="text-center">
                      <span v-if="item.horario !== 'Sin servicio'" class="time-pill">{{ item.horario }}</span>
                      <q-badge v-else outline color="grey-5" class="q-px-sm q-py-xs" label="Sin servicio" />
                    </td>
                  </tr>
                </tbody>
              </q-markup-table>
            </q-card-section>
          </q-card>
        </div>

      </div>

    </div>
  </q-page>
</template>

<script setup>
const horarios = [
  { dia: 'Lunes', horario: '07:00 AM - 10:00 PM' },
  { dia: 'Martes', horario: '07:00 AM - 10:00 PM' },
  { dia: 'Miércoles', horario: '07:00 AM - 10:00 PM' },
  { dia: 'Jueves', horario: '07:00 AM - 10:00 PM' },
  { dia: 'Viernes', horario: '07:00 AM - 10:00 PM' },
  { dia: 'Sábado', horario: 'Sin servicio' }
]
</script>

<style scoped>
.max-width-container {
  max-width: 1800px;
  margin: 0 auto;
}

.rounded-borders-lg {
  border-radius: 14px;
}

.hero-gradient {
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, rgba(15, 23, 42, 0.88) 100%);
}

.border-left-accent {
  border-left: 6px solid #00695c;
}

.full-height {
  height: 100%;
}

.description-text {
  font-size: 1.22rem;
  line-height: 1.8;
  font-weight: 400;
}

/* Avatar estilizado estático */
.avatar-wrapper {
  position: relative;
  display: inline-block;
}

.avatar-ring {
  padding: 4px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00897b, #80cbd3);
}

.avatar-image {
  object-fit: cover;
  border: 3px solid #ffffff;
}

.verified-badge {
  position: absolute;
  bottom: 4px;
  right: 4px;
  background-color: #ffffff;
  border-radius: 50%;
  width: 26px;
  height: 26px;
}

/* Botones estáticos */
.static-btn {
  cursor: default;
}

/* Tabla de horarios */
.styled-table {
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.styled-table th {
  padding: 14px 16px;
}

.styled-table td {
  padding: 12px 16px;
}

.time-pill {
  background-color: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
  padding: 4px 12px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  display: inline-block;
}
</style>