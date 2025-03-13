import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { createThemePlugin } from './plugins/themes.js'
import { installI18n } from './plugins/i18n.js'

// 创建应用
const app = createApp(App)

// 使用插件
app.use(createPinia())
app.use(router)
app.use(createThemePlugin({
  defaultTheme: 'system'
}))

// 初始化国际化
installI18n(app).then(() => {
  // 挂载应用
  app.mount('#app')
})
