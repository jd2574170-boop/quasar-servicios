<template>
  <q-page class="q-pa-md max-width-container">
    <q-card flat class="q-mb-md overflow-hidden rounded-borders shadow-2">
      <q-img src="../img/coordinacion1.jpeg" height="240px" fit="cover">
        <template v-slot:error>
          <div class="absolute-full flex flex-center bg-grey-4 text-grey-8">
            
          </div>
        </template>
        <div class="absolute-bottom bg-gradient text-white q-pa-sm">
          <div class="text-subtitle2">Espacio Físico Real</div>
          <div class="text-caption">Centro Agroturístico SENA - San Gil</div>
        </div>
      </q-img>
    </q-card>

    <div class="row items-center q-mb-md">
      <q-icon name="school" color="primary" size="38px" class="q-mr-sm" />
      <h1 class="text-h4 text-weight-bolder text-primary q-my-none">Coordinación Académica</h1>
    </div>

    <q-card flat bordered class="q-mb-lg bg-blue-1 border-blue">
      <q-card-section>
        <div class="text-subtitle1 text-weight-bold text-primary q-mb-xs">Descripción del Servicio</div>
        <p class="text-body1 text-grey-9 leading-relaxed q-mb-none">
          La Coordinación Académica apoya la gestión y trámite de novedades de los aprendices (retiros, deserción, traslados, aplazamientos y reingresos) de la formación titulada SENA.<br />
          Supervisa la programación de instructores para la formación profesional integral.<br />
          Garantiza la logística adecuada para que los ambientes de aprendizaje se mantengan en óptimas condiciones.<br />
          Atiende requerimientos académicos directos entre instructores y comunidad estudiantil.
        </p>
      </q-card-section>
    </q-card>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-8">
        <q-card flat bordered class="full-height">
          <q-card-section class="bg-primary text-white q-py-sm">
            <div class="text-subtitle1 text-weight-bold row items-center">
              <q-icon name="schedule" class="q-mr-sm" /> Horarios de Atención
            </div>
          </q-card-section>
          <q-card-section class="q-pa-none">
            <q-markup-table flat separator="horizontal">
              <thead>
                <tr class="bg-grey-2">
                  <th class="text-left">Días</th>
                  <th class="text-left">Mañana</th>
                  <th class="text-left">Tarde</th>
                  <th class="text-left">Noche</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="text-weight-bold text-grey-8">Lunes a Viernes</td>
                  <td>07:30 AM - 12:00 PM</td>
                  <td class="text-grey-5">Sin servicio</td>
                  <td class="text-grey-5">Sin servicio</td>
                </tr>
                <tr>
                  <td class="text-weight-bold text-grey-8">Sábados</td>
                  <td class="text-grey-5">Sin servicio</td>
                  <td class="text-grey-5">Sin servicio</td>
                  <td class="text-grey-5">Sin servicio</td>
                </tr>
              </tbody>
            </q-markup-table>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat bordered class="q-mb-md bg-grey-2">
          <q-card-section class="row items-center q-py-sm">
            <q-avatar color="primary" text-color="white" icon="phone" size="40px" class="q-mr-md" />
            <div>
              <div class="text-caption text-grey-7">Teléfono de Contacto</div>
              <div class="text-subtitle1 text-weight-bold text-primary">+57 *** *** ****</div>
            </div>
          </q-card-section>
        </q-card>

        <q-card flat bordered>
          <q-card-section class="bg-secondary text-white q-py-sm">
            <div class="text-subtitle1 text-weight-bold row items-center">
              <q-icon name="person_pin" class="q-mr-sm" /> Encargado de Atención
            </div>
          </q-card-section>
          <q-card-section class="text-center q-pa-md">
            <q-avatar size="90px" class="q-mb-sm shadow-2">
              <img src="../img/coordinacion.jpeg" alt="Luis Carlos Reina" />
            </q-avatar>
            <div class="text-h6 text-weight-bold text-grey-9">Luis Carlos Reina</div>
            <q-chip color="primary" text-color="white" size="sm" class="q-mb-xs">Coordinador Académico</q-chip>
            <q-separator class="q-my-sm" />
            <div class="row items-center justify-center text-grey-8">
              <q-icon name="email" color="primary" class="q-mr-xs" />
              <span class="text-primary text-weight-bold text-caption">lreinas@sena.edu.co</span>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
.max-width-container { max-width: 1000px; margin: 0 auto; }
.leading-relaxed { line-height: 1.6; }
.bg-gradient { background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%); }
.border-blue { border-left: 5px solid #027be3; }
</style>