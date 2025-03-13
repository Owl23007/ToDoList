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
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue', 'create'])

const todoForm = ref({
  text: '',
  date: '',
  time: '',
  priority: 1,
  tags: []
})

const tagInput = ref('')
const tagInputRef = ref(null)
const inputRef = ref(null)
const timeError = ref('')
const tagError = ref('')
const isInputting = ref(false)
const priorities = ['低', '中', '高']

const currentDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const getMinTime = computed(() => {
  if (todoForm.value.date === currentDate.value) {
    const now = new Date()
    return now.toTimeString().split(' ')[0].substring(0, 5)
  }
  return '00:00'
})

const isTagsLimitReached = computed(() => todoForm.value.tags.length >= 5)

const isValid = computed(() => {
  return todoForm.value.text.trim() !== '' && !timeError.value && !tagError.value
})

const handleInput = () => {
  timeError.value = ''
  tagError.value = ''
}

const handleSubmit = () => {
  if (!isValid.value) return
  emit('create', { ...todoForm.value })
  resetForm()
}

const resetForm = () => {
  todoForm.value = {
    text: '',
    date: '',
    time: '',
    priority: 1,
    tags: []
  }
  tagInput.value = ''
  timeError.value = ''
  tagError.value = ''
  isInputting.value = false
}

const validateDateTime = () => {
  if (todoForm.value.date === currentDate.value && todoForm.value.time < getMinTime.value) {
    timeError.value = '时间不能早于当前时间'
  } else {
    timeError.value = ''
  }
}

const startTagInput = () => {
  isInputting.value = true
  nextTick(() => {
    tagInputRef.value.focus()
  })
}

const addTag = () => {
  const newTag = tagInput.value.trim()
  if (newTag && !todoForm.value.tags.includes(newTag)) {
    todoForm.value.tags.push(newTag)
    tagInput.value = ''
    tagError.value = ''
  } else if (todoForm.value.tags.includes(newTag)) {
    tagError.value = '标签已存在'
  }
  isInputting.value = false
}

const removeTag = (tag) => {
  todoForm.value.tags = todoForm.value.tags.filter(t => t !== tag)
}

const handleInputBlur = () => {
  if (tagInput.value.trim()) {
    addTag()
  }
  isInputting.value = false
}

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    nextTick(() => {
      inputRef.value.focus()
    })
  }
})

onMounted(() => {
  if (props.modelValue) {
    inputRef.value.focus()
  }
})
</script>

<style lang="scss" scoped>
.quick-create-panel {
  display: none;
  &.active {
    display: block;
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .form-group {
    input {
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
  }
  .form-row {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .datetime-row {
    .datetime-picker {
      display: flex;
      flex-direction: column;
      gap: 8px;
      .picker-group {
        display: flex;
        gap: 8px;
        input {
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
      }
      .error-message {
        color: red;
        font-size: 0.85em;
      }
    }
  }
  .priority-row {
    display: flex;
    align-items: center;
    gap: 8px;
    .label {
      font-weight: bold;
    }
    .priority-selector {
      display: flex;
      gap: 8px;
      button {
        padding: 8px 16px;
        border: 1px solid #ccc;
        border-radius: 4px;
        background: none;
        cursor: pointer;
        &.active {
          background: #007bff;
          color: white;
        }
      }
    }
  }
  .tags {
    .tag-input-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
      .tag-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        .tag {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          background: #f0f0f0;
          border-radius: 4px;
          button {
            background: none;
            border: none;
            cursor: pointer;
          }
        }
        .tag-input-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
          .add-tag-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            border: 1px solid #ccc;
            border-radius: 4px;
            background: none;
            cursor: pointer;
            .plus-icon {
              font-size: 1.5em;
            }
          }
          input {
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
          }
        }
      }
      .error-message {
        color: red;
        font-size: 0.85em;
      }
    }
  }
  .action-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    button {
      padding: 8px 16px;
      border: 1px solid #ccc;
      border-radius: 4px;
      background: none;
      cursor: pointer;
      &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }
    }
  }
}
</style>