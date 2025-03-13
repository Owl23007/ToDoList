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
        :disabled="showDeleted"
      >
        <template #item="{ element }">
          <todo-item
            :todo="element"
            @update="$emit('update', $event)"
            @delete="$emit('delete', element.id)"
            @restore="$emit('restore', $event)"
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

const emit = defineEmits(['update', 'delete', 'reorder', 'restore'])

const filterStatus = ref('all')
const sortBy = ref('createdAt')
const showDeleted = ref(false)

// 过滤待办事项
const filteredTodos = computed(() => {
  return props.todos.filter(todo => {
    // 先过滤软删除状态
    if (todo.softDelete) return false;
    
    switch (filterStatus.value) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      case 'overdue':
        return new Date(todo.datetime) < new Date() && !todo.completed;
      default:
        return true;
    }
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
  .todo-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background: #f8f9fa;
    border-bottom: 1px solid #e9ecef;

    .filters {
      display: flex;
      gap: 8px;

      .filter-select,
      .sort-select {
        padding: 4px 8px;
        border: 1px solid #ced4da;
        border-radius: 4px;
        background: #fff;
        font-size: 0.9em;
      }
    }
  }

  .list-container {
    padding: 16px;

    .empty-state {
      text-align: center;
      color: #999;
      font-size: 1em;
      padding: 16px;
    }
  }
}
</style>