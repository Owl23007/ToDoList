<template>
  <div class="time-display" :class="{ compact: !showDate }">
    <div class="time-section">
      <div class="time" :class="{ 'time-only': !showDate }">
        {{ currentTime }}
        <span class="seconds" v-if="showSeconds">:{{ currentSeconds }}</span>
      </div>
      <div v-if="showDate" class="date-info">
        <div class="date">
          {{ currentDate }}
          <span class="weekday">{{ currentWeekday }}</span>
        </div>
        <div class="lunar-date" v-if="showLunar">{{ lunarDate }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  showDate: { type: Boolean, default: false },
  showSeconds: { type: Boolean, default: false },
  showLunar: { type: Boolean, default: true }
})

const currentTime = ref('')
const currentSeconds = ref('')
const currentDate = ref('')
const currentWeekday = ref('')
const lunarDate = ref('')
let timer

const updateDateTime = () => {
  const now = new Date()
  const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false }
  currentTime.value = now.toLocaleTimeString('zh-CN', timeOptions)
  currentSeconds.value = now.getSeconds().toString().padStart(2, '0')
  
  const dateOptions = { month: 'long', day: 'numeric' }
  currentDate.value = now.toLocaleDateString('zh-CN', dateOptions)
  
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  currentWeekday.value = weekdays[now.getDay()]
  
  // 简单的农历计算（这里可以集成更准确的农历库）
  try {
    lunarDate.value = now.toLocaleDateString('zh-Hans-CN-u-ca-chinese')
      .replace(/年.*月/, '月')
      .replace('日', '')
  } catch (e) {
    lunarDate.value = ''
  }
}

onMounted(() => {
  updateDateTime()
  timer = setInterval(updateDateTime, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style scoped lang="scss">
.time-display {
  padding: 8px 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &.compact {
    padding: 4px 8px;
  }

  .time-section {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .time {
    font-size: 2em;
    font-weight: 600;
    color: var(--primary-color);
    letter-spacing: 1px;
    transition: all 0.3s ease;
    
    &.time-only {
      font-size: 1.5em;
    }

    .seconds {
      font-size: 0.6em;
      opacity: 0.8;
    }
  }

  .date-info {
    .date {
      font-size: 1.1em;
      color: #666;
      display: flex;
      align-items: center;
      gap: 8px;

      .weekday {
        font-size: 0.9em;
        color: #888;
        padding: 2px 6px;
        background: #f5f5f5;
        border-radius: 4px;
      }
    }

    .lunar-date {
      font-size: 0.9em;
      color: #999;
      margin-top: 2px;
    }
  }

  @media (max-width: 768px) {
    .time { font-size: 1.5em; }
    .date-info .date { font-size: 1em; }
  }
}
</style>
