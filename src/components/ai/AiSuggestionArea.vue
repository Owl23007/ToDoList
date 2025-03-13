<template>
  <div class="ai-suggestion-area">
    <div class="suggestion-header">
      <h3>AI 建议的任务</h3>
      <span class="suggestion-count">{{ suggestions.length }}个建议</span>
    </div>
    
    <div class="suggestions-list">
      <div v-for="suggestion in suggestions" :key="suggestion.id" class="suggestion-card">
        <div class="suggestion-content">
          <h4>{{ suggestion.title }}</h4>
          <p v-if="suggestion.description">{{ suggestion.description }}</p>
          <div class="suggestion-meta">
            <span v-if="suggestion.dueDate" class="due-date">
              期限: {{ formatDate(suggestion.dueDate) }}
            </span>
            <span v-if="suggestion.priority" 
                  :class="['priority', `priority-${suggestion.priority}`]">
              {{ getPriorityText(suggestion.priority) }}
            </span>
          </div>
        </div>
        <div class="suggestion-actions">
          <button class="apply-btn" @click="$emit('apply', suggestion)">应用</button>
          <button class="dismiss-btn" @click="$emit('dismiss', suggestion.id)">忽略</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  suggestions: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['apply', 'dismiss']);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN');
};

const getPriorityText = (priority) => {
  const mapping = {
    high: '高优先级',
    normal: '普通优先级',
    low: '低优先级'
  };
  return mapping[priority] || '普通优先级';
};
</script>

<style lang="scss" scoped>
.ai-suggestion-area {
  background: #f0f8ff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

.suggestion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  
  h3 {
    margin: 0;
    color: #1890ff;
  }
  
  .suggestion-count {
    background: #1890ff;
    color: white;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 12px;
  }
}

.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.suggestion-card {
  background: white;
  border-radius: 6px;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  .suggestion-content {
    flex: 1;
    
    h4 {
      margin: 0 0 8px 0;
    }
    
    p {
      margin: 0 0 8px 0;
      color: #666;
      font-size: 14px;
    }
  }
  
  .suggestion-meta {
    display: flex;
    gap: 8px;
    font-size: 12px;
    
    .due-date {
      color: #1890ff;
    }
    
    .priority {
      padding: 2px 6px;
      border-radius: 4px;
      
      &.priority-high {
        background: #fff1f0;
        color: #ff4d4f;
      }
      
      &.priority-normal {
        background: #e6f7ff;
        color: #1890ff;
      }
      
      &.priority-low {
        background: #f6ffed;
        color: #52c41a;
      }
    }
  }
  
  .suggestion-actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
    
    button {
      border: none;
      border-radius: 4px;
      padding: 6px 12px;
      cursor: pointer;
      font-size: 12px;
      
      &.apply-btn {
        background: #1890ff;
        color: white;
      }
      
      &.dismiss-btn {
        background: #f5f5f5;
        color: #666;
      }
    }
  }
}
</style>
