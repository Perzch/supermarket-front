import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {createPinia} from "pinia";
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

import './assets/style/index.scss'

const app = createApp(App)

app.use(router).use(ElementPlus, {
    locale: zhCn
}).use(createPinia()).mount('#app')