import { createApp } from 'vue' 
import App from './App.vue'
import { VueQueryPlugin } from "@tanstack/vue-query"
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css'; 
import { createPinia } from "pinia"
import router from "./router.js"

// const pinia = createPinia()

const app = createApp(App)
app.use(router)
app.use(createPinia())
app.use(Antd)
app.use(VueQueryPlugin)
app.mount('#app')
