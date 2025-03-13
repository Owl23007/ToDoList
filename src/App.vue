<!-- App.vue -->
<template>
  <div class="app-container">
    <header class="app-header">
      <!-- 暂时移除 theme-toggle -->
    </header>
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
// 移除 theme store 导入
// 移除 ThemeToggle 导入

const todoStore = useTodoStore()

onMounted(() => {
  todoStore.initialize()
})
</script>

<script>
export default {
  name: 'App',
}
</script>

<style>
@import './assets/styles/themes/default.css';

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  color: #333333;
}

.app-header {
  display: flex;
  justify-content: flex-end;
  padding: 12px 16px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e8e8e8;
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