<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-avatar class="q-ml-sm" size="45px">
          <img src="./img/image.png" alt="Logo SENA" />
        </q-avatar>

        <q-toolbar-title>
          Centro Agroturístico
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" overlay behavior="mobile" bordered>
      <q-list padding class="text-grey-8">
        <q-item-label header class="text-weight-bold text-uppercase">
          Menú Principal
        </q-item-label>

        <q-item clickable v-ripple to="/enfermeria" active-class="bg-blue-1 text-primary" @click="toggleLeftDrawer">
          <q-item-section avatar>
            <q-icon name="medical_services" color="primary" />
          </q-item-section>
          <q-item-section class="text-weight-medium">Enfermería</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/bienestar" active-class="bg-blue-1 text-primary" @click="toggleLeftDrawer">
          <q-item-section avatar>
            <q-icon name="sentiment_satisfied_alt" color="primary" />
          </q-item-section>
          <q-item-section class="text-weight-medium">Bienestar</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/biblioteca" active-class="bg-blue-1 text-primary" @click="toggleLeftDrawer">
          <q-item-section avatar>
            <q-icon name="local_library" color="primary" />
          </q-item-section>
          <q-item-section class="text-weight-medium">Biblioteca</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/cafeteria" active-class="bg-blue-1 text-primary" @click="toggleLeftDrawer">
          <q-item-section avatar>
            <q-icon name="local_cafe" color="primary" />
          </q-item-section>
          <q-item-section class="text-weight-medium">Cafetería</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/coordinacion" active-class="bg-blue-1 text-primary" @click="toggleLeftDrawer">
          <q-item-section avatar>
            <q-icon name="apartment" color="primary" />
          </q-item-section>
          <q-item-section class="text-weight-medium">Coordinación</q-item-section>
        </q-item>

        <q-separator class="q-my-md" />

        <q-item clickable v-ripple to="/acerca" active-class="bg-teal-1 text-secondary" @click="toggleLeftDrawer">
          <q-item-section avatar>
            <q-icon name="info" color="secondary" />
          </q-item-section>
          <q-item-section class="text-weight-medium">Acerca de</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div class="text-caption text-center">Centro Agroturístico SENA - San Gil</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const leftDrawerOpen = ref(false)
function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}   
</script>