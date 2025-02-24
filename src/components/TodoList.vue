<template>
  <div class="todo-list">
    <div class="todo-header">
      <div class="filters">
        <select v-model="filterStatus" class="filter-select">
          <option value="all">全部任务</option>
          <option value="active">进行中</option>
          <option value="completed">已完成</option>
          <option value="overdue">已逾期</option>
        </select>
        <select v-model="sortBy" class="sort-select">
          <option value="createdAt">创建时间</option>
          <option value="deadline">截止日期</option>
          <option value="priority">优先级</option>
        </select>
      </div>
    </div>

    <div class="list-container">
      <draggable
        v-model="sortedTodos"
        item-key="id"
        handle=".handle"
        ghost-class="ghost"
        @change="handleDragChange"
      >
        <template #item="{ element }">
          <todo-item
            :todo="element"
            @update="$emit('update', $event)"
            @delete="$emit('delete', $event)"
          />
        </template>
      </draggable>

      <div v-if="filteredTodos.length === 0" class="empty-state">
        <span>{{ getEmptyStateMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import TodoItem from './TodoItem.vue'
import draggable from 'vuedraggable'

const props = defineProps({
  todos: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update', 'delete', 'reorder'])

const filterStatus = ref('all')
const sortBy = ref('createdAt')

// 过滤待办事项
const filteredTodos = computed(() => {
  return props.todos.filter(todo => {
    if (filterStatus.value === 'active') return !todo.completed
    if (filterStatus.value === 'completed') return todo.completed
    if (filterStatus.value === 'overdue') {
      return new Date(todo.datetime) < new Date() && !todo.completed
    }
    return true
  })
})

// 排序待办事项
const sortedTodos = computed({
  get() {
    return [...filteredTodos.value].sort((a, b) => {
      switch (sortBy.value) {
        case 'deadline':
          return new Date(a.datetime) - new Date(b.datetime)
        case 'priority':
          return a.priority - b.priority
        default:
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      }
    })
  },
  set(value) {
    emit('reorder', value)
  }
})

const getEmptyStateMessage = computed(() => {
  switch (filterStatus.value) {
    case 'active': return '暂无进行中的任务'
    case 'completed': return '暂无已完成的任务'
    case 'overdue': return '暂无逾期任务'
    default: return '暂无待办事项'
  }
})

const handleDragChange = (evt) => {
  if (evt.moved) {
    emit('reorder', sortedTodos.value)
  }
}
</script>

<style lang="scss" scoped>
.todo-list {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  overflow: hidden;

  .todo-header {
    padding: 16px 24px;
    border-bottom: 1px solid #eee;

    .filters {
      display: flex;
      gap: 12px;

      select {
        padding: 8px 12px;
        border-radius: 6px;
        border: 1px solid #ddd;
        background: white;
        font-size: 0.9em;
        outline: none;
        cursor: pointer;

        &:focus {
          border-color: var(--primary-color);
        }
      }
    }
  }

  .list-container {
    flex: 1;
    overflow-y: auto;
    padding: 16px;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(0,0,0,0.1);
      border-radius: 3px;
    }
  }

  .empty-state {
    text-align: center;
    padding: 40px;
    color: #999;
    font-size: 0.95em;
  }

  .ghost {
    opacity: 0.5;
    background: #f8f9fa;
  }
}
</style>

