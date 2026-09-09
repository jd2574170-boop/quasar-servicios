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
      <div class="q-pa-md q-gutter-y-sm">
        <q-btn color="primary" label="Enfermería" to="/enfermeria" class="full-width" flat align="left" @click="toggleLeftDrawer" />
        <q-btn color="primary" label="Bienestar" to="/bienestar" class="full-width" flat align="left" @click="toggleLeftDrawer" />
        <q-btn color="primary" label="Biblioteca" to="/biblioteca" class="full-width" flat align="left" @click="toggleLeftDrawer" />
        <q-btn color="primary" label="Cafetería" to="/cafeteria" class="full-width" flat align="left" @click="toggleLeftDrawer" />
        <q-btn color="primary" label="Coordinación" to="/coordinacion" class="full-width" flat align="left" @click="toggleLeftDrawer" />

        <q-separator class="q-my-md" />

        <q-btn color="secondary" label="Acerca de" to="/acerca" class="full-width" flat align="left" @click="toggleLeftDrawer" />
      </div>
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