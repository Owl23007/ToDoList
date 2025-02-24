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
      </div>

      <!-- 右侧待办列表 -->
      <div class="right-panel">
        <TodoList
          :todos="todoStore.todos"
          @update="todoStore.updateTodo"
          @delete="todoStore.deleteTodo"
          @reorder="todoStore.reorderTodos"
        ></TodoList>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTodoStore } from '@/store/todoStore'
import TodoList from '@/components/TodoList.vue' 
import TimeDisplay from '@/components/TimeDisplay.vue'
import ProgressDashboard from '@/components/ProgressDashboard.vue'
import QuickCreatePanel from '@/components/QuickCreatePanel.vue'

const todoStore = useTodoStore()
const showCreatePanel = ref(false) 

onMounted(() => {
  todoStore.initializeFromStorage()
})
</script>

<style lang="scss">
.dashboard-app {
  --primary-color: #4a90e2;
  --success-color: #7ed321;
  --warning-color: #f5a623;
  --danger-color: #d0021b;

  max-width: 1800px;
  min-width: 1200px;
  margin: 10px 100px;  // 居中显示
  background: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.05);
  min-height: calc(100vh - 20px); // 调整最小高度
}

.smart-bar {
  display: grid;
  align-items: center;
  /*居中显示*/
  margin: auto;
  grid-template-columns: 1fr auto;
  gap: 20px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(0,0,0,0.1);

  .context-switch {
    display: flex;
    gap: 8px;
    
    button {
      padding: 8px 16px;
      border-radius: 20px;
      background: rgba(0,0,0,0.05);
      transition: all 0.2s;
      
      &.active {
        background: var(--primary-color);
        color: white;
      }
    }
  }
}

.main-content {
  display: grid;
  grid-template-columns: 380px 1fr; // 增加左侧面板宽度到380px
  gap: 30px;  // 增加间距
  max-width: 1600px; // 限制最大宽度
  width: 100%;
  margin: 0 auto;    // 居中内容
  margin-top: 12px;
  height: calc(100vh - 100px); // 调整高度计算
  overflow: hidden; // 防止内容溢出
  padding: 24px;
}

.left-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;  // 增加组件间距
  height: 100%;
 
  padding-right: 8px; // 为滚动条留出空间
  min-width: 450px; // 设置最小宽度
    width: 30%;
  
    &::-webkit-scrollbar {
      width: 6px;
    }
  
    &::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.1);
      border-radius: 3px;
  }
}

.right-panel {
  background-color: #f8f9fa;
  margin-left: auto;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);

 width: 70%;
 height: inherit;
  max-width: 1000px; // 添加最大宽度
  margin: 0 auto;    // 居中显示
  overflow-y: auto; // 添加垂直滚动
  height: 77%;    // 确保高度撑满

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0,0,0,0.1);
    border-radius: 3px;
  }
}

// 响应式布局
@media (max-width: 1024px) {
  .main-content {
    grid-template-columns: 1fr;
    height: auto;
    overflow: visible;
  }

  .left-panel,
  .right-panel {
    height: auto;
    overflow: visible;
  }
}

@media (max-width: 1280px) {
  .dashboard-app {
    margin: 10px;
    padding: 12px;
  }
  
  .main-content {
    grid-template-columns: 1fr;
  }
  
  .right-panel {
    min-width: 500px;  // 较小屏幕时调整最小宽度
  }
}

@media (max-width: 1600px) {
  .dashboard-app {
    padding: 16px 24px;
  }
  
  .main-content {
    grid-template-columns: 340px 1fr;
    gap: 24px;
  }
  
  .right-panel {
    min-width: 700px;
  }
}

@media (max-width: 768px) {
  .main-content {
    grid-template-columns: 1fr;
    height: auto;
    overflow: visible;
  }
}

.fab-container {
  position: fixed;
  bottom: 40px;
  right: calc((100% - 1200px) / 2 + 40px); // 配合 dashboard-app 的最大宽度
  z-index: 1000;
  
  @media screen and (max-width: 1280px) {
    right: 40px; // 在小屏幕上使用固定边距
  }
  
  .fab-main {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: var(--primary-color);
    color: white;
    font-size: 28px;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(74,144,226,0.3);
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(74,144,226,0.4);
    }
    
    &:active {
      transform: scale(0.95);
    }
  }
}

.rotate-enter-active,
.rotate-leave-active {
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.rotate-enter-from,
.rotate-leave-to {
  opacity: 0;
  transform: rotate(90deg);
}
</style>
