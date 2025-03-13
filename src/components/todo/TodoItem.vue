 <template>
  <div class="todo-item" 
    :class="{ 
      completed: todo.completed,
      ['priority-' + todo.priority]: true,
      'is-overdue': isOverdue && !todo.completed,
      'soft-delete': todo.softDelete
    }"
  >
    <div class="handle">⋮⋮</div>
    <div class="checkbox-wrapper">
      <input
        type="checkbox"
        :checked="todo.completed"
        @change="$emit('update', { ...todo, completed: !todo.completed })"
      >
    </div>
    
    <div class="content">
      <div class="main-info">
        <span class="text" :class="{ 'completed-text': todo.completed }">{{ todo.text }}</span>
        <span class="datetime" :class="{ overdue: isOverdue && !todo.completed }">
          {{ formatDateTime }}
          <span v-if="isOverdue && !todo.completed" class="overdue-tag">已逾期</span>
        </span>
      </div>
      
      <div class="meta-info">
        <div class="tags" v-if="todo.tags?.length">
          <span v-for="tag in todo.tags" :key="tag" class="tag">
            {{ tag }}
          </span>
        </div>
        <div class="priority-label" :class="`p${todo.priority}`">
          {{ priorityText }}
        </div>
      </div>
    </div>

    <div class="actions">
      <button 
        v-if="todo.softDelete" 
        class="restore-btn" 
        @click="$emit('restore', todo.id)"
        title="恢复"
      >
        <i class="icon-restore">↺</i>
      </button>
      <button 
        class="delete-btn" 
        @click="handleDelete"
        :title="todo.softDelete ? '永久删除' : '删除'"
      >
        <i class="icon-delete">×</i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  todo: {
    type: Object,
    required: true
  }
})

const priorityText = computed(() => {
  const map = { 1: '紧急', 2: '中度', 3: '低优' }
  return map[props.todo.priority] || '无'
})

// 检查是否逾期
const isOverdue = computed(() => {
  if (!props.todo.datetime) return false
  return new Date(props.todo.datetime) < new Date()
})

// 格式化日期时间
const formatDateTime = computed(() => {
  if (!props.todo.datetime) return ''
  
  const date = new Date(props.todo.datetime)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  // 格式化时间
  const timeStr = date.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit'
  })
  
  // 如果是今天
  if (date.toDateString() === today.toDateString()) {
    return `今天 ${timeStr}`
  }
  
  // 如果是明天
  if (date.toDateString() === tomorrow.toDateString()) {
    return `明天 ${timeStr}`
  }
  
  // 其他日期
  return date.toLocaleDateString('zh-CN', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

const emit = defineEmits(['update', 'delete', 'restore'])

const handleDelete = () => {
  if (confirm('确定要删除该任务吗？此操作不可恢复。')) {
    emit('delete', props.todo.id)
  }
}
</script>

<style scoped lang="scss">
.todo-item {
  min-width: 280px;  /* 调整最小宽度 */
  padding: 16px;     /* 调整内边距 */
  gap: 10px;         /* 调整间距 */
  display: flex;
  align-items: center;
  padding: 12px;
  background: rgb(251, 251, 251);
  border-radius: 8px;
  margin-bottom: 6px;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
  
  &:hover {
    background: #f8f9fa;
    transform: translateX(2px);
  }

  &.completed {
    opacity: 0.8;
    .completed-text {
      text-decoration: line-through;
      color: #666;
    }
  }

  // 优先级边框
  &.priority-1 { border-left-color: var(--danger-color); }
  &.priority-2 { border-left-color: var(--warning-color); }
  &.priority-3 { border-left-color: var(--success-color); }

  // 添加软删除样式
  &.soft-delete {
    .text {
      text-decoration: line-through;
      color: #999;
    }
    opacity: 0.6;
  }

  .handle {
    cursor: move;
    color: #ccc;
    padding: 8px 4px;
  }

  .checkbox-wrapper {
    padding: 4px;
    input {
      transform: scale(1.2);
    }
  }

  .content {
    flex: 1;
    min-width: 0; // 防止文本溢出
    
    .main-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 6px;
      
      .text {
        font-size: 1em;
        color: #2c3e50;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .datetime {
        white-space: nowrap;
        color: #666;
        font-size: 0.85em;
        
        &.overdue {
          color: var(--danger-color);
        }
        
        .overdue-tag {
          background: #ffd7d7;
          color: var(--danger-color);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.8em;
          margin-left: 4px;
        }
      }
    }

    .meta-info {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 4px;
      
      .tags {
        display: flex;
        gap: 4px;
        flex-wrap: wrap;
        
        .tag {
          padding: 2px 8px;
          border-radius: 12px;
          background: #f0f0f0;
          font-size: 0.85em;
          color: #666;
        }
      }

      .priority-label {
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 0.85em;
        
        &.p1 { background: #fef2f2; color: #dc2626; }
        &.p2 { background: #fff7ed; color: #ea580c; }
        &.p3 { background: #f0fdf4; color: #16a34a; }
      }
    }
  }

  .actions {
    display: flex;
    gap: 4px;
    opacity: 0;
    transition: opacity 0.2s;

    button {
      padding: 4px;
      background: none;
      border: none;
      border-radius: 4px;
      color: #666;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: #f0f0f0;
        
        &.edit-btn { color: var(--primary-color); }
        &.delete-btn { color: var(--danger-color); }
      }
    }
  }

  &:hover .actions {
    opacity: 1;
  }
}
</style>
