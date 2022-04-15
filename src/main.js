import { createApp } from 'vue';
import App from './App.vue';

import './index.css';

import '@vant/touch-emulator';

// 引入全局样式
import '@/global/styles/index.scss';

createApp(App).mount('#app');
