import { App } from 'vue'
import { useStorage } from '@vueuse/core'
import { computed } from 'vue'

// 主题加载函数
export async function loadTheme(mode) {
  // 加载默认主题样式
  await import('@/assets/styles/themes/default.css')
  
  // 如果是暗黑模式，额外加载暗黑主题
  if (mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    await import('@/assets/styles/themes/dark.css')
    document.documentElement.classList.add('theme-dark')
  } else {
    document.documentElement.classList.remove('theme-dark')
  }
}

// 主题插件
export function createThemePlugin(options = {}) {
  const {
    storageKey = 'theme-mode',
    defaultTheme = 'system'
  } = options
  
  // 使用 VueUse 的 useStorage 来持久化主题设置
  const themeMode = useStorage(storageKey, defaultTheme)
  
  // 监听系统主题变化
  const systemThemeMedia = window.matchMedia('(prefers-color-scheme: dark)')
  const updateSystemTheme = () => {
    if (themeMode.value === 'system') {
      loadTheme('system')
    }
  }
  
  // 添加系统主题变化监听器
  systemThemeMedia.addEventListener('change', updateSystemTheme)
  
  // 安装插件的函数
  const install = (app) => {
    // 初始加载主题
    loadTheme(themeMode.value)
    
    // 提供主题相关的全局属性和方法
    app.provide('themeMode', themeMode)
    app.provide('setTheme', (mode) => {
      themeMode.value = mode
      loadTheme(mode)
    })
    
    // 全局混入(可选)
    app.mixin({
      computed: {
        $themeMode: () => themeMode.value,
      }
    })
  }
  
  return {
    install
  }
}

// 方便直接使用的 hook
export function useTheme() {
  const themeMode = useStorage('theme-mode', 'system')
  
  const setTheme = (mode) => {
    themeMode.value = mode
    loadTheme(mode)
  }
  
  const toggleTheme = () => {
    setTheme(themeMode.value === 'dark' ? 'light' : 'dark')
  }
  
  return {
    themeMode,
    setTheme,
    toggleTheme,
    isDark: computed(() => {
      if (themeMode.value === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
      }
      return themeMode.value === 'dark'
    })
  }
}
