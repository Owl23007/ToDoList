import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'
import { createPinia } from 'pinia'

const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)

app.config.errorHandler = (err, instance, info) => {
  // 处理错误，例如：
  console.error('全局错误处理：', err, instance, info)
  //   useAppStore().setError(err)
  // 将错误发送到分析服务
}

app.mount('#app')
