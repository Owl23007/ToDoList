import { defineStore } from 'pinia'

const STORAGE_KEY = 'todo-list-data'
const EXPIRATION_TIME_MS = 24 * 60 * 60 * 1000  // 24小时

export const useTodoStore = defineStore('todo', {
  state: () => ({
    todos: [],
    currentMode: 'work',
    isLoading: false  // 新增加载状态
  }),

  getters: {
    completedTodos: (state) => state.todos.filter(todo => todo.completed && !todo.softDelete),
    pendingTodos: (state) => state.todos.filter(todo => !todo.completed && !todo.softDelete),
    completionRate: (state) => {
      if (state.todos.length === 0) return 0
      return Math.round((state.completedTodos.length / state.todos.length) * 100)
    }
  },

  actions: {
    initializeFromStorage() {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.timestamp && (Date.now() - parsed.timestamp) <= EXPIRATION_TIME_MS) {
          const { todos, currentMode } = parsed
          this.todos = todos
          this.currentMode = currentMode
        } else {
          localStorage.removeItem(STORAGE_KEY)
        }
      }
    },

    // 修改初始化方法
    initialize() {
      this.isLoading = true
      try {
        this.initializeFromStorage()
        // 如果没有数据，添加一些示例数据
        if (this.todos.length === 0) {
          this.todos = [
            {
              id: 1,
              text: '示例任务',
              completed: false,
              priority: 2,
              datetime: new Date().toISOString(),
              tags: ['示例']
            }
          ]
        }
      } finally {
        this.isLoading = false
      }
    },

    saveToStorage() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        todos: this.todos,
        currentMode: this.currentMode,
        timestamp: Date.now()
      }))
    },

    addTodo(todo) {
      this.todos.push({
        id: Date.now(),
        ...todo,
        completed: false
      })
      this.saveToStorage()
    },

    updateTodo(updatedTodo) {
      const index = this.todos.findIndex(t => t.id === updatedTodo.id)
      if (index !== -1) {
        this.todos[index] = updatedTodo
        this.saveToStorage()
      }
    },

    deleteTodo(todoId) {
      const todo = this.todos.find(t => t.id === todoId)
      if(todo) {
        todo.softDelete = true
        this.saveToStorage()
      }
    },

    reorderTodos(newOrder) {
      this.todos = newOrder
      this.saveToStorage()
    },

    setCurrentMode(mode) {
      this.currentMode = mode
      this.saveToStorage()
    }
  }
})
