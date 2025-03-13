<template>
  <div class="theme-toggle">
    <button @click="toggleTheme" class="theme-toggle-button" :title="themeButtonTitle">
      <span v-if="isDarkMode">🌙</span>
      <span v-else>☀️</span>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '@/stores/themeStore'

const themeStore = useThemeStore()

const isDarkMode = computed(() => themeStore.isDarkMode)
const themeButtonTitle = computed(() => isDarkMode.value ? '切换到亮色模式' : '切换到暗色模式')

const toggleTheme = () => {
  themeStore.toggleTheme()
}
</script>

<style scoped>
.theme-toggle {
  display: inline-flex;
  align-items: center;
}

.theme-toggle-button {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 8px;
  border-radius: var(--radius-sm);
  transition: background-color 0.3s;
}

.theme-toggle-button:hover {
  background-color: var(--divider-color);
}
</style>
