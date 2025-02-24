<template>
  <div class="quick-create-panel" :class="{ active: modelValue }">
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <input
          v-model="todoForm.text"
          type="text"
          placeholder="输入待办事项..."
          ref="inputRef"
          @input="handleInput"
        >
      </div>

      <div class="form-row datetime-row">
        <div class="datetime-picker">
          <div class="picker-group">
            <input 
              v-model="todoForm.date" 
              type="date"
              :min="currentDate"
              @change="validateDateTime"
            >
            <input 
              v-model="todoForm.time" 
              type="time"
              :min="getMinTime"
              @change="validateDateTime"
            >
          </div>
          <span class="error-message" v-if="timeError">{{ timeError }}</span>
        </div>
      </div>

      <div class="form-row priority-row">
        <div class="label">优先级：</div>
        <div class="priority-selector">
          <button 
            v-for="(label, index) in priorities" 
            :key="index"
            type="button"
            :class="{ active: todoForm.priority === index + 1 }"
            @click="todoForm.priority = index + 1"
          >
            {{ label }}
          </button>
        </div>
      </div>

      <div class="form-row tags">
        <div class="tag-input-container">
          <div class="tag-list">
            <span 
              v-for="tag in todoForm.tags" 
              :key="tag" 
              class="tag"
            >
              {{ tag }}
              <button type="button" @click="removeTag(tag)">×</button>
            </span>
            <div class="tag-input-wrapper" v-if="!isTagsLimitReached">
              <button 
                v-if="!isInputting" 
                class="add-tag-btn"
                @click="startTagInput"
              >
                <span class="plus-icon">+</span>
              </button>
              <input 
                v-else
                v-model="tagInput"
                placeholder="添加标签"
                @keydown.enter.prevent="addTag"
                @keydown.space.prevent="addTag"
                @keydown.comma.prevent="addTag"
                @blur="handleInputBlur"
                ref="tagInputRef"
              >
            </div>
          </div>
        </div>
        <div class="error-message" v-if="tagError">{{ tagError }}</div>
      </div>

      <div class="action-buttons">
        <button type="button" @click="$emit('update:modelValue', false)">取消</button>
        <button type="submit" :disabled="!isValid">创建</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'

const props = defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue', 'create'])

const inputRef = ref(null)
const tagInput = ref('')
const tagInputRef = ref(null)
const isInputting = ref(false)

const priorities = ['紧急', '中度', '低优']

const todoForm = ref({
  text: '',
  date: '',
  time: '',
  priority: 2, // 默认普通优先级
  tags: [],
  subtasks: []
})

const timeError = ref('')

// 表单验证
const isValid = computed(() => {
  return todoForm.value.text.trim() !== '' && !timeError.value
})

// 获取当前时间
const currentTime = computed(() => {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
})

// 获取当前日期
const currentDate = computed(() => {
  const now = new Date()
  return now.toISOString().split('T')[0]
})

// 获取最小可选时间
const getMinTime = computed(() => {
  if (todoForm.value.date > currentDate.value) {
    return '00:00'
  }
  return currentTime.value
})

// 初始化表单时间为当前时间
onMounted(() => {
  todoForm.value.date = currentDate.value
  todoForm.value.time = currentTime.value
})

// 验证时间是否合法
const validateDateTime = () => {
  const now = new Date()
  const [hours, minutes] = todoForm.value.time.split(':').map(Number)
  const selectedDate = new Date(todoForm.value.date)
  selectedDate.setHours(hours, minutes)
  
  if (selectedDate < now) {
    timeError.value = '不能选择过去的时间'
    todoForm.value.date = currentDate.value
    todoForm.value.time = currentTime.value
  } else {
    timeError.value = ''
  }
}

// 智能建议
const suggestions = ref([])
const handleInput = (e) => {
  const input = e.target.value.toLowerCase()
  // 这里可以实现智能建议逻辑
  suggestions.value = input ? [
    { text: input + ' - 今天完成' },
    { text: input + ' - 本周完成' }
  ] : []
}

const applySuggestion = (suggestion) => {
  todoForm.value.text = suggestion.text
  suggestions.value = []
}

const MAX_TAGS = 5
const MAX_TAG_LENGTH = 10
const tagError = ref('')

// 检查是否达到标签数量限制
const isTagsLimitReached = computed(() => {
  return todoForm.value.tags.length >= MAX_TAGS
})

// 标签管理
const addTag = () => {
  const tag = tagInput.value.trim()
  
  // 验证标签
  if (!tag) {
    return
  }
  
  if (tag.length > MAX_TAG_LENGTH) {
    tagError.value = `标签最多${MAX_TAG_LENGTH}个字符`
    return
  }
  
  if (todoForm.value.tags.includes(tag)) {
    tagError.value = '标签已存在'
    return
  }
  
  if (todoForm.value.tags.length >= MAX_TAGS) {
    tagError.value = `最多添加${MAX_TAGS}个标签`
    return
  }
  
  // 添加标签
  todoForm.value.tags.push(tag)
  tagError.value = ''
  tagInput.value = ''
}

const removeTag = (tag) => {
  todoForm.value.tags = todoForm.value.tags.filter(t => t !== tag)
  tagError.value = '' // 清除可能的错误提示
  
  // 如果之前达到上限，现在删除后要重新启用输入框
  if (todoForm.value.tags.length < MAX_TAGS) {
    nextTick(() => {
      inputRef.value?.focus()
    })
  }
}

const startTagInput = () => {
  isInputting.value = true
  nextTick(() => {
    tagInputRef.value?.focus()
  })
}

const handleInputBlur = () => {
  if (tagInput.value.trim()) {
    addTag()
  }
  isInputting.value = false
  tagInput.value = ''
}

// 监听标签输入，清除错误提示
watch(tagInput, () => {
  tagError.value = ''
})

// 表单提交
const handleSubmit = () => {
  if (!isValid.value) return
  
  const formData = { 
    ...todoForm.value,
    // 合并日期和时间
    datetime: new Date(`${todoForm.value.date}T${todoForm.value.time}`)
  }
  
  emit('create', formData)
  todoForm.value = {
    text: '',
    date: currentDate.value,
    time: currentTime.value,
    priority: 2,
    tags: [],
    subtasks: []
  }
}

// 自动聚焦
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    nextTick(() => {
      inputRef.value?.focus()
    })
  }
})
</script>

<style lang="scss" scoped>
.quick-create-panel {
  min-width: 340px;    // 增加最小宽度
  width: 100%;         // 占满容器宽度
  padding: 24px;       // 增加内边距
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  max-width: 400px;  /* 调整最大宽度 */
  
  .form-group {
    position: relative;
    margin-bottom: 16px;
    margin-right: 24px;

    input {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 16px;
      
      &:focus {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 2px rgba(74,144,226,0.2);
      }
    }
  }

  .suggestions {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    z-index: 10;

    .suggestion-item {
      padding: 8px 12px;
      cursor: pointer;
      
      &:hover {
        background: #f5f5f5;
      }
    }
  }

  .form-row {
    display: flex;
    gap: 16px;  // 增加间距
    margin-bottom: 20px;
    align-items: center;
    
    &.tags {
      flex-direction: column;
      align-items: stretch;
    }
  }

  .datetime-row {
    margin-bottom: 16px;
    
    .datetime-picker {
      width: 100%;
      margin-right: 0;
    }
  }

  .priority-row {
    margin-bottom: 20px;
    
    .label {
      font-size: 14px;
      color: #666;
      margin-right: 8px;
      padding: 8px 0;
    }

    .priority-selector {
      flex: 1;
      justify-content: flex-start;
      
      button {
        min-width: 60px;
      }
    }
  }

  .datetime-picker {
    flex: 1;
    position: relative;
    margin-right: 15px;

    .picker-group {
      display: flex;
      gap: 8px;
      
      input {
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 6px;
        font-size: 14px;
        
        &[type="date"] {
          flex: 3;
          min-width: 130px;
        }
        
        &[type="time"] {
          flex: 2;
          min-width: 100px;
        }
        
        &:focus {
          border-color: var(--primary-color);
          outline: none;
        }
      }
    }

    .error-message {
      position: absolute;
      bottom: -20px;
      left: 0;
      font-size: 12px;
      color: red;
    }
  }

  .priority-selector {
    display: flex;
    gap: 8px;

    button {
      padding: 8px 16px;
      border-radius: 6px;
      background: #f5f5f5;
      border: none;
      cursor: pointer;
      min-width: 64px;       // 添加最小宽度
      text-align: center;    // 文字居中
      line-height: 1.2;      // 调整行高
      height: 36px;          // 固定高度
      display: flex;         // 使用flex布局
      align-items: center;   // 垂直居中
      justify-content: center; // 水平居中

      &.active {
        background: var(--primary-color);
        color: white;
      }
    }
  }

  .tag-input-container {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 8px;
    min-height: 42px;
    
    .tag-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
    }

    .tag-input-wrapper {
      display: inline-flex;
      align-items: center;

      .add-tag-btn {
        border: none;
        background: none;
        padding: 4px 8px;
        cursor: pointer;
        color: var(--primary-color);
        font-size: 16px;
        
        .plus-icon {
          display: inline-block;
          width: 20px;
          height: 20px;
          line-height: 18px;
          text-align: center;
          border-radius: 50%;
          border: 2px solid currentColor;
        }

        &:hover {
          opacity: 0.8;
        }
      }

      input {
        width: 80px;
        border: none;
        outline: none;
        padding: 4px 8px;
        margin-right: 18px;
        font-size: 14px;

        &:focus {
          box-shadow: none;
        }
      }
    }
  }

  .tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    background: #f0f0f0;
    border-radius: 4px;
    font-size: 14px;

    button {
      border: none;
      background: none;
      padding: 0;
      cursor: pointer;
      opacity: 0.5;
      
      &:hover {
        opacity: 1;
      }
    }
  }

  .tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 8px;

    .tag {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      background: #f0f0f0;
      border-radius: 4px;
      font-size: 14px;

      button {
        border: none;
        background: none;
        padding: 0;
        cursor: pointer;
        opacity: 0.5;
        
        &:hover {
          opacity: 1;
        }
      }
    }
  }

  .action-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 20px;

    button {
      padding: 8px 16px;
      border-radius: 6px;
      border: none;
      cursor: pointer;

      &[type="submit"] {
        background: var(--primary-color);
        color: white;

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }

      &[type="button"] {
        background: #f5f5f5;
      }
    }
  }
}

.form-row.tags {
  .error-message {
    font-size: 12px;
    color: red;
    margin-top: 4px;
  }
  
  input:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
}
</style>
