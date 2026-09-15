import { createRouter, createWebHashHistory } from 'vue-router'

import Enfermeria from "../views/enfermeria.vue"
import Bienestar from "../views/bienestar.vue"
import Biblioteca from "../views/biblioteca.vue"
import Cafeteria from "../views/cafeteria.vue"
import Coordinacion from "../views/coordinacion.vue"
import Acerca from "../views/acerca.vue"

const routes = [
  { path: "/enfermeria", component: Enfermeria },
  { path: "/bienestar", component: Bienestar },
  { path: "/biblioteca", component: Biblioteca },
  { path: "/cafeteria", component: Cafeteria },
  { path: "/coordinacion", component: Coordinacion },
  { path: "/", component: Acerca }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})



