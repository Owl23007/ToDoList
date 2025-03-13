import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useStorage, usePreferredDark } from '@vueuse/core'
import { loadTheme } from '@/plugins/themes'

export const useThemeStore = defineStore('theme', () => {
  // 主题状态
  const themeMode = useStorage('theme-mode', 'system')
  const preferredDark = usePreferredDark()
  
  // 计算当前是否为深色模式
  const isDarkMode = computed(() => {
    if (themeMode.value === 'system') {
      return preferredDark.value
    }
    return themeMode.value === 'dark'
  })
  
  // 计算当前主题类名
  const themeClass = computed(() => isDarkMode.value ? 'theme-dark' : '')
  
  // 设置主题
  const setTheme = (mode) => {
    themeMode.value = mode
    applyTheme()
  }
  
  // 切换主题
  const toggleTheme = () => {
    themeMode.value = isDarkMode.value ? 'light' : 'dark'
    applyTheme()
  }
  
  // 应用主题
  const applyTheme = () => {
    loadTheme(themeMode.value)
  }
  
  // 监听系统主题变化并应用
  watch(preferredDark, () => {
    if (themeMode.value === 'system') {
      applyTheme()
    }
  })
  
  // 初始化
  const initialize = () => {
    applyTheme()
  }
  
  return {
    themeMode,
    isDarkMode,
    themeClass,
    setTheme,
    toggleTheme,
    initialize
  }
})
