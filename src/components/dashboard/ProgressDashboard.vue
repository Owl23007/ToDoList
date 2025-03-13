<template>
  <div class="progress-dashboard">
    <div class="progress-section">
      <div class="progress-circle">
        <svg viewBox="0 0 36 36">
          <path class="circle-bg"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path class="circle"
            :stroke-dasharray="`${completionRate}, 100`"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div class="percentage">{{ completionRate }}%</div>
        <div class="label">完成率</div>
      </div>
    </div>

    <div class="stats-section">
      <div class="stat-row">
        <div class="stat-item total">
          <div class="value">{{ todos.length }}</div>
          <div class="label">总任务</div>
        </div>
        <div class="stat-item completed">
          <div class="value">{{ completedCount }}</div>
          <div class="label">已完成</div>
        </div>
        <div class="stat-item pending">
          <div class="value">{{ pendingCount }}</div>
          <div class="label">待完成</div>
        </div>
      </div>

      <div class="priority-stats">
        <div class="stat-item" v-for="(count, priority) in priorityStats" :key="priority">
          <div class="priority-indicator" :class="'p' + priority"></div>
          <div class="value">{{ count }}</div>
          <div class="label">{{ getPriorityLabel(priority) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  todos: {
    type: Array,
    required: true
  }
})

const completedCount = computed(() => props.todos.filter(t => t.completed).length)
const pendingCount = computed(() => props.todos.length - completedCount.value)
const completionRate = computed(() => 
  Math.round((completedCount.value / (props.todos.length || 1)) * 100)
)

// 按优先级统计
const priorityStats = computed(() => {
  const stats = { 1: 0, 2: 0, 3: 0 }
  props.todos.forEach(todo => {
    if (todo.priority in stats) {
      stats[todo.priority]++
    }
  })
  return stats
})

const getPriorityLabel = (priority) => {
  const labels = {
    '1': '紧急',
    '2': '中度',
    '3': '低优'
  }
  return labels[priority]
}
</script>

<style scoped lang="scss">
.progress-dashboard {
  min-width: 300px; /* 增加最小宽度 */
  padding: 24px;    /* 增加内边距 */
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  gap: 16px; /* 减小间距 */

  .progress-section {
    text-align: center;
  }

  .progress-circle {
    position: relative;
    width: 140px; /* 增加环形图大小 */
    margin: 0 auto;
    animation: fade-in 0.6s ease-out;
    
    svg {
      transform: rotate(-90deg);
      transition: all 0.3s ease;
      
      .circle-bg {
        fill: none;
        stroke: #eee;
        stroke-width: 2.8;
      }
      
      .circle {
        fill: none;
        stroke: var(--primary-color);
        stroke-width: 2.8;
        stroke-linecap: round;
        transition: stroke-dasharray 0.8s ease;
      }
    }
    
    .percentage {
      position: absolute;
      top: 45%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 1.8em; /* 增加字体大小 */
      font-weight: bold;
      color: var(--primary-color);
    }

    .label {
      position: absolute;
      top: 65%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 0.9em;
      color: #666;
    }
  }

  .stats-section {
    display: flex;
    flex-direction: column;
    gap: 12px; /* 减小间距 */
  }

  .stat-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px; /* 减小间距 */
    padding: 16px 0; /* 增加内边距 */
    border-bottom: 1px solid #eee;

    .stat-item {
      text-align: center;
      animation: slide-up 0.4s ease-out;

      .value {
        font-size: 1.5em; /* 增加数值字体大小 */
        font-weight: bold;
        color: var(--primary-color);
      }

      .label {
        margin-top: 4px;
        color: #666;
        font-size: 0.9em;
      }

      &.total .value { color: #4a90e2; }
      &.completed .value { color: #7ed321; }
      &.pending .value { color: #f5a623; }
    }
  }

  .priority-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    padding-top: 8px;

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      animation: slide-up 0.4s ease-out;

      .priority-indicator {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-bottom: 4px;

        &.p1 { background-color: var(--danger-color); }
        &.p2 { background-color: var(--warning-color); }
        &.p3 { background-color: var(--success-color); }
      }

      .value {
        font-size: 1.2em;
        font-weight: bold;
      }

      .label {
        font-size: 0.85em;
        color: #666;
      }
    }
  }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
