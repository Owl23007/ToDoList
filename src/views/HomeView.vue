<template>
  <div class="dashboard-app">
    <div class="smart-bar">
      <div class="context-info">
        <time-display :show-date="true"></time-display>
      </div>
    </div>

    <div class="main-content">
      <!-- 左侧面板 -->
      <div class="left-panel">
        <progress-dashboard :todos="todoStore.todos"></progress-dashboard>
        <quick-create-panel 
          v-model="showCreatePanel"
          @create="todoStore.addTodo"
        ></quick-create-panel>
        <!-- 清空按钮 -->
        <div class="panel-footer">
          <button class="clear-btn" @click="handleClearAll">
            清空所有数据
          </button>
        </div>
      </div>

      <!-- 右侧待办列表 -->
      <div class="right-panel">
        <TodoList
          :todos="todoStore.activeTodos"
          @update="todoStore.updateTodo"
          @delete="todoStore.permanentlyDeleteTodo"
          @reorder="todoStore.reorderTodos"
        ></TodoList>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTodoStore } from '@/stores/todoStore'
import TodoList from '@/components/todo/TodoList.vue' 
import TimeDisplay from '@/components/ui/TimeDisplay.vue'
import ProgressDashboard from '@/components/dashboard/ProgressDashboard.vue'
import QuickCreatePanel from '@/components/form/QuickCreatePanel.vue'

const todoStore = useTodoStore()
const showCreatePanel = ref(false) 

const handleClearAll = () => {
  if (confirm('确定要清空所有数据吗？此操作不可恢复！')) {
    todoStore.clearAllTodos()
  }
}

onMounted(() => {
  todoStore.initializeFromStorage()
})
</script>

<style lang="scss">
.dashboard-app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.smart-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;
}

.context-info {
  display: flex;
  align-items: center;
}

.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.left-panel {
  width: 300px;
  padding: 16px;
  background: #fff;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.panel-footer {
  margin-top: auto;
  text-align: center;

  .clear-btn {
    padding: 8px 16px;
    background: #ff4d4f;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
      background: #ff7875;
    }
  }
}

.right-panel {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}
</style>