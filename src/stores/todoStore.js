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
    // 修改 getter 过滤逻辑
    completedTodos: (state) => state.todos.filter(todo => todo.completed),
    pendingTodos: (state) => state.todos.filter(todo => !todo.completed),
    deletedTodos: (state) => state.todos.filter(todo => todo.softDelete),
    activeTodos: (state) => state.todos.filter(todo => !todo.softDelete),
    completionRate: (state) => {
      const activeTodos = state.todos.filter(todo => !todo.softDelete)
      if (activeTodos.length === 0) return 0
      const completed = activeTodos.filter(todo => todo.completed)
      return Math.round((completed.length / activeTodos.length) * 100)
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
      // 添加新的待办事项
      const newTodo = {
        id: Date.now(),
        text: todo.text,
        completed: false,
        datetime: todo.datetime,
        priority: todo.priority || 2,
        tags: todo.tags || [],
        createdAt: new Date().toISOString(),
        softDelete: false
      }
      this.todos.push(newTodo)
      this.saveToStorage()
      return newTodo
    },

    updateTodo(updatedTodo) {
      const index = this.todos.findIndex(t => t.id === updatedTodo.id)
      if (index !== -1) {
        // 保存更新时间
        updatedTodo.updatedAt = new Date().toISOString()
        this.todos[index] = { ...this.todos[index], ...updatedTodo }
        this.saveToStorage()
      }
    },

    completeTodo(todoId) {
      const todo = this.todos.find(t => t.id === todoId)
      if (todo) {
        todo.completed = !todo.completed
        todo.completedAt = todo.completed ? new Date().toISOString() : null
        this.saveToStorage()
      }
    },

    deleteTodo(todoId) {
      // 软删除 - 将项目标记为已删除而不是真正删除
      const todo = this.todos.find(t => t.id === todoId)
      if (todo) {
        todo.softDelete = true
        todo.deletedAt = new Date().toISOString()
        this.saveToStorage()
      }
    },

    // 永久删除
    permanentlyDeleteTodo(todoId) {
      this.todos = this.todos.filter(todo => todo.id !== todoId)
      this.saveToStorage()
    },

    // 恢复已删除的待办事项
    restoreTodo(todoId) {
      const todo = this.todos.find(t => t.id === todoId)
      if (todo) {
        todo.softDelete = false
        delete todo.deletedAt
        this.saveToStorage()
      }
    },

    reorderTodos(newOrder) {
      this.todos = newOrder
      this.saveToStorage()
    },

    clearAllTodos() {
      this.todos = []
      this.saveToStorage()
    },

  }
})
