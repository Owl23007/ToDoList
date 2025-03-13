<!-- App.vue -->
<template>
  <div :class="['app-container', themeStore.themeClass]">
    <header class="app-header">
      <theme-toggle />
    </header>
    <!-- 主内容区 -->
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useTodoStore } from './stores/todoStore'
import { useThemeStore } from './stores/themeStore'
import ThemeToggle from './components/ui/ThemeToggle.vue'

const todoStore = useTodoStore()
const themeStore = useThemeStore()

onMounted(() => {
  todoStore.initialize()
  themeStore.initialize()
})
</script>

<style>
@import './assets/styles/themes/default.css';

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--background-color);
  color: var(--text-color);
  transition: background-color 0.3s, color 0.3s;
}

.app-header {
  display: flex;
  justify-content: flex-end;
  padding: 12px 16px;
  background-color: var(--surface-color);
  border-bottom: 1px solid var(--border-color);
}

.main-content {
  flex: 1;
  width: 100%;
  margin: 0;
  padding: 0;
  height: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>