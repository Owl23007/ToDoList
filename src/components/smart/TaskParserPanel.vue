<template>
  <div class="task-parser-panel">
    <div class="panel-header">
      <h3>智能解析</h3>
      <button class="close-btn" @click="$emit('close')">×</button>
    </div>
    
    <div class="panel-body">
      <div class="original-text">
        <h4>原始文本</h4>
        <div class="text-content">{{ parsedText }}</div>
      </div>
      
      <div class="parsing-result" v-if="isProcessing">
        <div class="loading-indicator">
          <div class="spinner"></div>
          <span>正在分析...</span>
        </div>
      </div>
      
      <div class="parsing-result" v-else>
        <h4>解析结果</h4>
        <div class="task-fields">
          <div class="field-group">
            <label>标题</label>
            <input v-model="taskData.title" placeholder="任务标题" />
          </div>
          
          <div class="field-group">
            <label>描述</label>
            <textarea v-model="taskData.description" placeholder="任务描述"></textarea>
          </div>
          
          <div class="field-row">
            <div class="field-group">
              <label>优先级</label>
              <select v-model="taskData.priority">
                <option value="high">高</option>
                <option value="normal">中</option>
                <option value="low">低</option>
              </select>
            </div>
            
            <div class="field-group">
              <label>截止日期</label>
              <input type="date" v-model="taskData.dueDate" />
            </div>
          </div>
        </div>
        
        <div class="panel-actions">
          <button class="primary-btn" @click="completeParsingProcess">确认</button>
          <button class="cancel-btn" @click="$emit('close')">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const props = defineProps({
  parsedText: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['parse-complete', 'close']);

const isProcessing = ref(true);
const taskData = ref({
  title: '',
  description: '',
  priority: 'normal',
  dueDate: '',
  completed: false
});

// 模拟解析过程
onMounted(() => {
  // 简单的文本解析逻辑（实际项目中可能使用NLP API）
  setTimeout(() => {
    const text = props.parsedText;
    
    // 提取优先级关键词
    let priority = 'normal';
    if (text.includes('紧急') || text.includes('重要')) {
      priority = 'high';
    } else if (text.includes('可选') || text.includes('低优先级')) {
      priority = 'low';
    }
    
    // 提取日期（简化示例）
    let dueDate = '';
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0];
    
    if (text.includes('明天')) {
      dueDate = dateString;
    }
    
    // 更新解析结果
    taskData.value = {
      title: text.split('\n')[0] || '新任务',
      description: text.length > 30 ? text : '',
      priority: priority,
      dueDate: dueDate,
      completed: false
    };
    
    isProcessing.value = false;
  }, 1000);
});

// 完成解析流程
const completeParsingProcess = () => {
  emit('parse-complete', taskData.value);
};
</script>

<style lang="scss" scoped>
.task-parser-panel {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-bottom: 20px;
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

.panel-body {
  padding: 16px;
}

.original-text {
  margin-bottom: 20px;
  
  h4 {
    margin: 0 0 8px 0;
    color: #333;
  }
  
  .text-content {
    padding: 12px;
    background: #f5f5f5;
    border-radius: 4px;
    font-family: monospace;
    white-space: pre-wrap;
  }
}

.parsing-result {
  h4 {
    margin: 0 0 8px 0;
    color: #333;
  }
  
  .loading-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    
    .spinner {
      width: 24px;
      height: 24px;
      border: 3px solid #f3f3f3;
      border-top: 3px solid #1890ff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-right: 12px;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  }
}

.task-fields {
  display: flex;
  flex-direction: column;
  gap: 12px;
  
  .field-group {
    display: flex;
    flex-direction: column;
    
    label {
      margin-bottom: 4px;
      color: #666;
      font-size: 14px;
    }
    
    input, select, textarea {
      padding: 8px;
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      
      &:focus {
        outline: none;
        border-color: #1890ff;
        box-shadow: 0 0 0 2px rgba(24,144,255,0.2);
      }
    }
    
    textarea {
      min-height: 80px;
      resize: vertical;
    }
  }
  
  .field-row {
    display: flex;
    gap: 12px;
    
    .field-group {
      flex: 1;
    }
  }
}

.panel-actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  
  button {
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    border: none;
    font-size: 14px;
    
    &.primary-btn {
      background: #1890ff;
      color: white;
      
      &:hover {
        background: #40a9ff;
      }
    }
    
    &.cancel-btn {
      background: #f5f5f5;
      color: #666;
      
      &:hover {
        background: #e8e8e8;
      }
    }
  }
}
</style>
