<template>
  <div class="task-preview-panel">
    <div class="panel-header">
      <h3>任务预览</h3>
      <button class="close-btn" @click="$emit('cancel')">×</button>
    </div>
    
    <div class="panel-body">
      <div class="preview-card">
        <div class="card-header">
          <div class="priority-badge" :class="priorityClass">
            {{ getPriorityText(localTaskData.priority) }}
          </div>
          <div class="due-date" v-if="localTaskData.dueDate">
            期限: {{ formatDate(localTaskData.dueDate) }}
          </div>
        </div>
        
        <div class="card-title">
          <h3>{{ localTaskData.title }}</h3>
        </div>
        
        <div class="card-content" v-if="localTaskData.description">
          <p>{{ localTaskData.description }}</p>
        </div>
      </div>
      
      <div class="edit-controls">
        <div class="field-group">
          <label>标题</label>
          <input v-model="localTaskData.title" placeholder="任务标题" @input="handleAdjust" />
        </div>
        
        <div class="field-group">
          <label>描述</label>
          <textarea 
            v-model="localTaskData.description" 
            placeholder="任务描述" 
            @input="handleAdjust"
          ></textarea>
        </div>
        
        <div class="field-row">
          <div class="field-group">
            <label>优先级</label>
            <select v-model="localTaskData.priority" @change="handleAdjust">
              <option value="high">高</option>
              <option value="normal">中</option>
              <option value="low">低</option>
            </select>
          </div>
          
          <div class="field-group">
            <label>截止日期</label>
            <input 
              type="date" 
              v-model="localTaskData.dueDate" 
              @change="handleAdjust"
            />
          </div>
        </div>
      </div>
      
      <div class="panel-actions">
        <button class="primary-btn" @click="$emit('confirm', localTaskData)">添加到任务列表</button>
        <button class="cancel-btn" @click="$emit('cancel')">取消</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  taskData: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['adjust', 'confirm', 'cancel']);

const localTaskData = ref({...props.taskData});

// 当外部任务数据变化时更新本地副本
watch(() => props.taskData, (newData) => {
  if (newData) {
    localTaskData.value = {...newData};
  }
}, { deep: true });

const priorityClass = computed(() => {
  return `priority-${localTaskData.value.priority || 'normal'}`;
});

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN');
};

const getPriorityText = (priority) => {
  const mapping = {
    high: '高优先级',
    normal: '中优先级',
    low: '低优先级'
  };
  return mapping[priority] || '中优先级';
};

const handleAdjust = () => {
  emit('adjust', {...localTaskData.value});
};
</script>

<style lang="scss" scoped>
.task-preview-panel {
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

.preview-card {
  background: #f9f9f9;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 20px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    
    .priority-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      
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
    
    .due-date {
      font-size: 12px;
      color: #666;
    }
  }
  
  .card-title {
    margin-bottom: 10px;
    
    h3 {
      margin: 0;
      color: #333;
    }
  }
  
  .card-content {
    p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }
  }
}

.edit-controls {
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
