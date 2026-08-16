import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import { vuetify } from "./plugins/vuetify.ts";

import '@mdi/font/css/materialdesignicons.css';


createApp(App).use(vuetify).mount('#app')
