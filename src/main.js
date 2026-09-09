import { createApp } from 'vue'
import { Quasar } from 'quasar'
import App from './App.vue'
import { router } from "./routes/routes.js"

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

const myApp = createApp(App)

myApp.use(Quasar, {
  plugins: {},
})

myApp.use(router)

myApp.mount('#app')
