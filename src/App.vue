<!-- App.vue -->
<template>
  <div :class="['app-container', themeClass]">
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
import { computed, onMounted } from 'vue'
import { useTodoStore } from './store/todoStore'

const todoStore = useTodoStore()

onMounted(() => {
  todoStore.initialize()
})

const themeClass = computed(() => 
  todoStore.currentMode === 'dark' ? 'theme-dark' : 'theme-light'
)
</script>

<style>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
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