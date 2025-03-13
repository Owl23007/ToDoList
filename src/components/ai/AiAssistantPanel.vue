<template>
  <div class="ai-assistant-panel">
    <div class="panel-header">
      <h3>AI 助手</h3>
      <button class="close-btn" @click="$emit('close')">×</button>
    </div>
    
    <div class="chat-container">
      <div v-for="(message, index) in chatHistory" :key="index" 
           :class="['chat-message', message.role]">
        <div class="message-content">{{ message.content }}</div>
      </div>
    </div>
    
    <div class="input-area">
      <input 
        v-model="inputQuery" 
        placeholder="问我任何关于任务管理的问题..." 
        @keyup.enter="sendQuery"
      />
      <button class="send-btn" @click="sendQuery">发送</button>
    </div>
    
    <div class="suggestion-chips">
      <button class="chip" @click="applyTemplate('今天我需要做什么？')">
        今天我需要做什么？
      </button>
      <button class="chip" @click="applyTemplate('帮我规划本周任务')">
        帮我规划本周任务
      </button>
      <button class="chip" @click="applyTemplate('分析我的任务完成情况')">
        分析完成情况
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  userQuery: String,
  chatHistory: Array
});

const emit = defineEmits(['send-query', 'close']);

const inputQuery = ref('');

const sendQuery = () => {
  if (inputQuery.value.trim()) {
    emit('send-query', inputQuery.value);
    inputQuery.value = '';
  }
};

const applyTemplate = (template) => {
  inputQuery.value = template;
};

// 当外部userQuery变化时更新本地输入
watch(() => props.userQuery, (newVal) => {
  if (newVal) {
    inputQuery.value = newVal;
  }
});
</script>

<style lang="scss" scoped>
.ai-assistant-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 500px;
  border-radius: 8px;
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #1890ff;
  color: white;
  
  h3 {
    margin: 0;
  }
  
  .close-btn {
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
  }
}

.chat-container {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background: #f9f9f9;
  
  .chat-message {
    margin-bottom: 12px;
    max-width: 80%;
    
    &.user {
      margin-left: auto;
      
      .message-content {
        background: #e1f5fe;
        border-radius: 18px 18px 4px 18px;
      }
    }
    
    &.assistant {
      margin-right: auto;
      
      .message-content {
        background: #fff;
        border-radius: 18px 18px 18px 4px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      }
    }
    
    .message-content {
      padding: 10px 14px;
      word-break: break-word;
    }
  }
}

.input-area {
  display: flex;
  padding: 12px;
  background: #fff;
  border-top: 1px solid #eee;
  
  input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 20px;
    margin-right: 8px;
  }
  
  .send-btn {
    background: #1890ff;
    color: white;
    border: none;
    border-radius: 20px;
    padding: 0 16px;
    cursor: pointer;
  }
}

.suggestion-chips {
  display: flex;
  padding: 8px 12px;
  gap: 8px;
  overflow-x: auto;
  background: #fff;
  
  .chip {
    white-space: nowrap;
    padding: 6px 12px;
    background: #f0f8ff;
    border: 1px solid #d0e7ff;
    border-radius: 16px;
    font-size: 12px;
    cursor: pointer;
    
    &:hover {
      background: #d0e7ff;
    }
  }
}
</style>
