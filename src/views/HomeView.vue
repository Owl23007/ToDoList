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
        <!-- 智能解析层 -->
        <task-parser-panel 
          v-if="showTaskParser" 
          :parsed-text="parsedText"
          @parse-complete="handleParseComplete"
          @close="showTaskParser = false"
        ></task-parser-panel>

        <!-- 动态预览区 -->
        <task-preview-panel
          v-if="showPreviewPanel"
          :task-data="parsedTaskData"
          @adjust="handleTaskAdjust"
          @confirm="handleTaskConfirm"
          @cancel="showPreviewPanel = false"
        ></task-preview-panel>
        
        <!-- AI智能助手面板 -->
        <ai-assistant-panel
          v-if="showAiAssistant"
          :user-query="userQuery"
          :chat-history="chatHistory"
          @send-query="handleAiQuery"
          @close="showAiAssistant = false"
          class="floating-assistant"
        ></ai-assistant-panel>
        
        <!-- AI任务建议区 -->
        <ai-suggestion-area
          v-if="hasAiSuggestions"
          :suggestions="aiSuggestions"
          @apply="applyAiSuggestion"
          @dismiss="dismissAiSuggestion"
        ></ai-suggestion-area>
        
        <TodoList
          :todos="todoStore.activeTodos"
          @update="todoStore.updateTodo"
          @delete="todoStore.permanentlyDeleteTodo"
          @reorder="todoStore.reorderTodos"
        ></TodoList>
      </div>
    </div>
    
    <!-- 悬浮按钮组 -->
    <floating-action-button
      @click-main="toggleQuickActions"
      @voice-command="handleVoiceCommand"
      @file-drop="handleFileDrop"
      @ai-assistant="openAiAssistant"
      :show-actions="showQuickActions"
    ></floating-action-button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTodoStore } from '@/stores/todoStore'
import TodoList from '@/components/todo/TodoList.vue' 
import TimeDisplay from '@/components/ui/TimeDisplay.vue'
import ProgressDashboard from '@/components/dashboard/ProgressDashboard.vue'
import QuickCreatePanel from '@/components/form/QuickCreatePanel.vue'
import FloatingActionButton from '@/components/ui/FloatingActionButton.vue'
import TaskParserPanel from '@/components/smart/TaskParserPanel.vue'
import TaskPreviewPanel from '@/components/smart/TaskPreviewPanel.vue'
import AiAssistantPanel from '@/components/ai/AiAssistantPanel.vue'
import AiSuggestionArea from '@/components/ai/AiSuggestionArea.vue'

const todoStore = useTodoStore()
const showCreatePanel = ref(false)
const showQuickActions = ref(false)
const showTaskParser = ref(false)
const showPreviewPanel = ref(false)
const showAiAssistant = ref(false)
const parsedText = ref('')
const parsedTaskData = ref(null)
const userQuery = ref('')
const chatHistory = ref([])
const aiSuggestions = ref([])
const hasAiSuggestions = ref(false)

// 切换快速操作菜单
const toggleQuickActions = () => {
  showQuickActions.value = !showQuickActions.value
}

// 处理语音命令
const handleVoiceCommand = (command) => {
  // 解析语音命令
  parsedText.value = command
  showTaskParser.value = true
}

// 处理文件拖拽
const handleFileDrop = (file) => {
  // 解析文件内容
  parsedText.value = '从文件中提取的内容'
  showTaskParser.value = true
}

// 处理文本解析完成
const handleParseComplete = (taskData) => {
  parsedTaskData.value = taskData
  showTaskParser.value = false
  showPreviewPanel.value = true
}

// 处理任务调整
const handleTaskAdjust = (adjustedTask) => {
  parsedTaskData.value = adjustedTask
}

// 处理任务确认
const handleTaskConfirm = (finalTask) => {
  todoStore.addTodo(finalTask)
  showPreviewPanel.value = false
}

// 打开AI助手
const openAiAssistant = () => {
  showQuickActions.value = false
  showAiAssistant.value = true
}

// 处理AI查询
const handleAiQuery = (query) => {
  userQuery.value = query
  // 模拟AI对话 - 在实际项目中会调用API
  chatHistory.value.push({ role: 'user', content: query })
  
  // 模拟AI回复
  setTimeout(() => {
    chatHistory.value.push({ 
      role: 'assistant', 
      content: '我可以帮你管理任务，你想了解什么？' 
    })
    
    // 模拟生成任务建议
    if (query.includes('建议') || query.includes('规划')) {
      generateAiSuggestions()
    }
  }, 500)
}

// 模拟生成AI建议
const generateAiSuggestions = () => {
  // 展示一些示例建议任务
  aiSuggestions.value = [
    {
      id: '1',
      title: '完成项目周报',
      description: '总结本周工作进度和下周计划',
      priority: 'high',
      dueDate: new Date(Date.now() + 86400000).toISOString()
    },
    {
      id: '2',
      title: '团队会议准备',
      description: '准备周四团队会议的演示文稿',
      priority: 'normal',
      dueDate: new Date(Date.now() + 172800000).toISOString()
    },
    {
      id: '3',
      title: '代码审查',
      description: '审查新功能的代码提交',
      priority: 'low',
      dueDate: new Date(Date.now() + 259200000).toISOString()
    }
  ]
  hasAiSuggestions.value = true
}

// 应用AI建议
const applyAiSuggestion = (suggestion) => {
  todoStore.addTodo({
    title: suggestion.title,
    description: suggestion.description,
    priority: suggestion.priority || 'normal',
    dueDate: suggestion.dueDate,
    completed: false
  })
  
  // 移除已应用的建议
  aiSuggestions.value = aiSuggestions.value.filter(s => s.id !== suggestion.id)
  if (aiSuggestions.value.length === 0) {
    hasAiSuggestions.value = false
  }
}

// 忽略AI建议
const dismissAiSuggestion = (suggestionId) => {
  aiSuggestions.value = aiSuggestions.value.filter(s => s.id !== suggestionId)
  if (aiSuggestions.value.length === 0) {
    hasAiSuggestions.value = false
  }
}

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
  position: relative;
  background-color: #f8f9fa;
}

.smart-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #ffffff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.context-info {
  display: flex;
  align-items: center;
}

.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
  padding: 20px;
  gap: 20px;
}

.left-panel {
  width: 360px;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: fit-content;
}

.panel-footer {
  margin-top: 20px;
  text-align: center;

  .clear-btn {
    width: 100%;
    padding: 12px 24px;
    background: #ff4d4f;
    color: #fff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;

    &:hover {
      background: #ff7875;
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(255, 77, 79, 0.2);
    }
  }
}

.right-panel {
  flex: 1;
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #ddd;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background-color: #f5f5f5;
  }
}

.floating-assistant {
  position: fixed;
  right: 24px;
  bottom: 90px;
  width: 380px;
  height: 520px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  background: #fff;
}

.ai-suggestion-area {
  margin-bottom: 24px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #eee;
}
</style>