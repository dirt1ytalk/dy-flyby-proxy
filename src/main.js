import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'

import './index.css'

import '@vant/touch-emulator'

// 引入全局样式
import "@/global/styles/index.scss"

import { parseUrl } from "./router.js"

let info = parseUrl();
window.rid = info.rid;
window.options = info.options;
createApp(App).use(ElementPlus).mount('#app')
