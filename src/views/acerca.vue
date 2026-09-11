<template>
  <q-page class="q-pa-md q-pa-md-lg max-width-container">
    
    <!-- Banner Principal -->
    <q-card flat class="bg-primary text-white q-mb-lg rounded-borders shadow-2">
      <q-card-section class="text-center q-pa-lg">
        <q-avatar size="90px" class="bg-white q-mb-md">
          <img src="../img/image.png" alt="SENA" />
        </q-avatar>
        <div class="text-h4 text-weight-bolder">Centro Agroturístico SENA</div>
        <div class="text-subtitle1">Regional Santander - San Gil</div>
      </q-card-section>
    </q-card>

    <!-- Sección Acerca de -->
    <q-card flat bordered class="q-mb-xl bg-grey-1">
      <q-card-section>
        <div class="text-h6 text-weight-bold text-primary q-mb-sm row items-center">
          <q-icon name="apartment" class="q-mr-sm" />
          Acerca de la Institución
        </div>
        <p class="text-body1 text-grey-9 leading-relaxed">
          El <strong>Centro Agroturístico SENA San Gil</strong> es una entidad pública enfocada en brindar formación profesional integral gratuita para el desarrollo técnico, tecnológico y social del sur del departamento de Santander. Cuenta con ambientes reales de aprendizaje para sectores agropecuarios, turísticos, comerciales y de las tecnologías de la información.
        </p>
      </q-card-section>

      <q-separator />

      <q-card-section class="row q-col-gutter-md">
        <div class="col-12 col-sm-6">
          <div class="text-subtitle2 text-weight-bold text-secondary">📍 Ubicación Principal</div>
          <div class="text-body2 text-grey-8">Cl. 22 #9 - 82, San Gil, Santander</div>
        </div>
        <div class="col-12 col-sm-6">
          <div class="text-subtitle2 text-weight-bold text-secondary">📞 Contacto Central</div>
          <div class="text-body2 text-grey-8">+57 607 724 8113</div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Sección Equipo Desarrollador (Sencilla) -->
    <q-card flat bordered class="q-mb-xl bg-grey-1">
      <q-card-section>
        <div class="text-h6 text-weight-bold text-primary q-mb-md row items-center">
          <q-icon name="code" class="q-mr-sm" />
          Equipo Desarrollador
        </div>

        <div class="row q-col-gutter-md justify-center">
          <div 
            v-for="(dev, index) in equipo" 
            :key="index" 
            class="col-12 col-sm-6 col-md-4"
          >
            <q-card flat bordered class="bg-white text-center q-pa-md">
              <q-avatar size="85px" class="q-mb-sm shadow-1">
                <img :src="dev.foto" :alt="dev.nombre" />
              </q-avatar>

              <div class="text-subtitle1 text-weight-bold text-grey-9">
                {{ dev.nombre }}
              </div>

              <div class="text-caption text-grey-7 q-mb-xs">
                Ficha: {{ dev.ficha }}
              </div>

              <a 
                :href="`mailto:${dev.email}`" 
                class="text-primary text-caption text-weight-bold row items-center justify-center q-gutter-xs text-decoration-none"
              >
                <q-icon name="email" size="16px" />
                <span>{{ dev.email }}</span>
              </a>
            </q-card>
          </div>
        </div>
      </q-card-section>
    </q-card>

  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const equipo = ref([
  {
    nombre: 'Jose Diaz',
    ficha: '3174193',
    foto: '../img/avartarme.png',
    email: 'jd2574170@gmail.com'
  }
])
</script>

<style scoped>
.max-width-container {
  max-width: 1000px;
  margin: 0 auto;
}

.leading-relaxed {
  line-height: 1.6;
}

.text-decoration-none {
  text-decoration: none;
}
</style>