import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

const app = createApp(App);       // Vue 앱 생성
app.use(router);                  // 라우터 사용
app.mount('#app');