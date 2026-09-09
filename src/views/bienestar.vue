<!-- src/views/Bienestar.vue -->
<template>
  <q-page class="q-pa-md max-width-container">
    
    
    <q-card flat class="q-mb-md overflow-hidden rounded-borders shadow-2">
      <q-img src="../img/bienestar2.jpeg" height="240px" fit="cover">
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
      <q-icon name="favorite" color="primary" size="38px" class="q-mr-sm" />
      <h1 class="text-h4 text-weight-bolder text-primary q-my-none">Bienestar al Aprendiz</h1>
    </div>

    

    <q-card flat bordered class="q-mb-lg bg-blue-1 border-blue">
      <q-card-section>
        <div class="text-subtitle1 text-weight-bold text-primary q-mb-xs">Descripción del Servicio</div>
        <p class="text-body1 text-grey-9 leading-relaxed q-mb-none">
          Bienestar al aprendiz es una estrategia institucional para contribuir en la permanencia de los aprendices en su proceso formativo. Los servicios que presta están alineados con los objetivos estratégicos y operativos establecidos en la Política Nacional Integral de Bienestar al aprendiz, tales como el reconocimiento de la Cultura como creadora de identidad, generadora de inclusión y catalizadora de diversidad; generación en los aprendices de prácticas asociadas a la prevención de la enfermedad y promoción de la salud a través de la gestión con entidades competentes (salud física y mental); fortalecimiento de habilidades blandas y para la vida; deporte, actividad física y aprovechamiento del tiempo libre como elementos fundamentales en el mejoramiento de la formación profesional integral; y promoción de expresiones de arte de los aprendices en su formación profesional integral. Además de lo anterior, desde Bienestar al aprendiz se manejan temas como apoyos socioeconómicos (apoyos de sostenimiento regular, FIC, medios tecnológicos, alimentación y transporte), monitorías y fortalecimiento y ejercicio de liderazgo.
        </p>
      </q-card-section>
    </q-card>

    <div class="row q-col-gutter-md">
      


      <div class="col-12 col-md-7">
        <q-card flat bordered class="full-height">
          <q-card-section class="bg-primary text-white q-py-sm">
            <div class="text-subtitle1 text-weight-bold row items-center">
              <q-icon name="schedule" class="q-mr-sm" /> Horarios de Atención por Área
            </div>
          </q-card-section>
          <q-card-section class="q-pa-none">
            <q-markup-table flat separator="horizontal">
              <thead>
                <tr class="bg-grey-2">
                  <th class="text-left">Área / Servicio</th>
                  <th class="text-left">Mañana</th>
                  <th class="text-left">Tarde / Noche</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="text-weight-bold text-grey-8">Enfermería (Sede Principal)</td>
                  <td>06:30 AM - 10:30 AM</td>
                  <td>04:00 PM - 08:00 PM</td>
                </tr>
                <tr>
                  <td class="text-weight-bold text-grey-8">Enfermería (Unisangil)</td>
                  <td>08:00 AM - 12:00 PM</td>
                  <td>04:00 PM - 08:00 PM</td>
                </tr>
                <tr>
                  <td class="text-weight-bold text-grey-8">Apoyos Socioeconómicos</td>
                  <td>08:00 AM - 12:00 PM</td>
                  <td>02:00 PM - 06:00 PM</td>
                </tr>
                <tr>
                  <td class="text-weight-bold text-grey-8">Líder de Bienestar</td>
                  <td>07:30 AM - 12:00 PM</td>
                  <td>02:00 PM - 06:00 PM</td>
                </tr>
              </tbody>
            </q-markup-table>
          </q-card-section>
        </q-card>
      </div>

      
      <div class="col-12 col-md-5">
        <q-card flat bordered class="q-mb-md bg-grey-2">
          <q-card-section class="row items-center q-py-sm">
            <q-avatar color="primary" text-color="white" icon="phone" size="40px" class="q-mr-md" />
            <div>
              <div class="text-caption text-grey-7">Teléfono de Contacto</div>
              <div class="text-subtitle1 text-weight-bold text-primary">+57 317 637 7670</div>
            </div>
          </q-card-section>
        </q-card>

        <q-card flat bordered>
          <q-card-section class="bg-secondary text-white q-py-sm">
            <div class="text-subtitle1 text-weight-bold row items-center">
              <q-icon name="person_pin" class="q-mr-sm" /> Encargada de Atención
            </div>
          </q-card-section>
          <q-card-section class="text-center q-pa-md">
            

            <q-avatar size="80px" class="q-mb-sm shadow-2">
              <img src="../img/bienestar.jpeg" alt="Maria Delea Arenas Mejía" />
            </q-avatar>
            <div class="text-h6 text-weight-bold text-grey-9">Maria Delea Arenas Mejía</div>
            <q-chip color="primary" text-color="white" size="sm" class="q-mb-xs">Líder de Bienestar al Aprendiz</q-chip>
            <q-separator class="q-my-sm" />
            <div class="row items-center justify-center text-grey-8">
              <q-icon name="email" color="primary" class="q-mr-xs" />
              <a href="mailto:mdarenas@sena.edu.com" class="text-primary text-weight-bold text-caption">mdarenas@sena.edu.com</a>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
.max-width-container {
  max-width: 1000px;
  margin: 0 auto;
}
.leading-relaxed {
  line-height: 1.6;
}
.bg-gradient {
  background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%);
}
.border-blue {
  border-left: 5px solid #027be3;
}
</style>