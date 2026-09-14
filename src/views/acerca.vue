<template>
  <q-page class="q-pa-md q-pa-md-lg max-width-container">
    
    
    <q-card flat class="bg-primary text-white q-mb-lg rounded-borders shadow-2">
      <q-card-section class="text-center q-pa-lg">
        <q-avatar size="90px" class="bg-white q-mb-md">
          <img src="../img/image.png" alt="SENA" />
        </q-avatar>
        <div class="text-h4 text-weight-bolder">Centro Agroturístico SENA</div>
        <div class="text-subtitle1">Regional Santander - San Gil</div>
      </q-card-section>
    </q-card>

    
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

    <!-- Sección Equipo Desarrollador (Texto plano sin enlace) -->
    <q-card flat bordered class="q-mb-xl">
      <q-card-section class="bg-teal text-white q-py-xs">
        <div class="text-subtitle1 text-weight-bold row items-center">
          <q-icon name="code" class="q-mr-sm" size="20px" />
          Equipo Desarrollador
        </div>
      </q-card-section>

      <q-card-section class="text-center q-pa-lg">
        <q-avatar size="90px" class="q-mb-sm shadow-1">
          <img src="../img/avatarme.png" alt="Foto Desarrollador" />
        </q-avatar>

        <div class="text-h6 text-weight-bold text-grey-9">
          José Díaz
        </div>

        <div class="q-mt-xs q-mb-sm">
          <q-badge rounded color="primary" class="q-px-md q-py-xs text-caption text-weight-bold">
            Ficha: 3174193
          </q-badge>
        </div>

        <div class="row items-center justify-center text-grey-8 text-body2 q-gutter-xs">
          <q-icon name="email" color="primary" size="18px" />
          <span class="text-weight-medium">jd2574170@gmail.com</span>
        </div>
      </q-card-section>
    </q-card>

  </q-page>
</template>

<script setup>
import { ref } from 'vue'
</script>

<style scoped>
.max-width-container {
  max-width: 1000px;
  margin: 0 auto;
}

.leading-relaxed {
  line-height: 1.6;
}
</style>