<template>
  <div class="floating-action-container">
    <!-- 扩展的快速操作按钮 -->
    <div class="quick-actions" v-if="showActions">
      <button class="action-btn voice-btn" @click="$emit('voice-command', '录音中...')">
        <i class="icon-mic"></i>
      </button>
      <button class="action-btn upload-btn" @click="triggerFileUpload">
        <i class="icon-upload"></i>
      </button>
      <button class="action-btn ai-btn" @click="$emit('ai-assistant')">
        <i class="icon-robot"></i>
      </button>
      <input
        type="file"
        ref="fileInput"
        style="display: none"
        @change="handleFileChange"
      />
    </div>
    
    <!-- 主按钮 -->
    <button class="main-action-btn" @click="$emit('click-main')">
      <i class="icon-plus" v-if="!showActions"></i>
      <i class="icon-close" v-else></i>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  showActions: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['click-main', 'voice-command', 'file-drop', 'ai-assistant']);
const fileInput = ref(null);

const triggerFileUpload = () => {
  fileInput.value.click();
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    emit('file-drop', file);
  }
  // 重置文件输入，以便可以重新选择同一个文件
  event.target.value = '';
};
</script>

<style lang="scss" scoped>
.floating-action-container {
  position: fixed;
  right: 20px;
  bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 100;
}

.main-action-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #1890ff;
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s, transform 0.3s;
  
  &:hover {
    background: #40a9ff;
    transform: scale(1.05);
  }
  
  i {
    font-size: 24px;
  }
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;

  .action-btn {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
    
    &:hover {
      transform: scale(1.1);
    }
    
    &.voice-btn {
      background: #52c41a;
    }
    
    &.upload-btn {
      background: #faad14;
    }
    
    &.ai-btn {
      background: #722ed1;
    }
  }
}

/* 简易图标样式 - 实际项目可能使用图标库 */
.icon-plus::before { content: '+'; }
.icon-close::before { content: '×'; }
.icon-mic::before { content: '🎤'; }
.icon-upload::before { content: '📁'; }
.icon-robot::before { content: '🤖'; }
</style>
