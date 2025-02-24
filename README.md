# Modern Todo List Application

一个现代化的待办事项管理应用，使用 Vue 3 + Vite + pinia 构建。

## 功能特点

- 📅 实时时间显示与农历日期
- 🎯 任务优先级管理
- 🏷️ 标签分类系统
- 📊 任务完成度统计
- 🔄 拖拽排序

## 技术栈

- Vue 3 + Composition API
- Vite
- Pinia 状态管理
- Vue Router
- LocalStorage 数据持久化

## 快速开始

```bash
# 安装依赖
npm install

# 开发环境运行
npm run dev

# 构建生产版本
npm run build
```

## 项目结构

```
src/
├── components/         # 组件目录
│   ├── TimeDisplay.vue    # 时间显示组件
│   ├── TodoItem.vue       # 待办项组件
│   ├── TodoList.vue       # 待办列表组件
│   ├── ProgressDashboard.vue  # 进度面板
│   └── QuickCreatePanel.vue   # 快速创建面板
├── store/             # 状态管理
│   └── todoStore.js       # Todo状态管理
├── router/            # 路由配置
│   └── index.js
├── App.vue           # 根组件
└── main.js           # 入口文件
```

## 主要功能说明

### 任务管理
- 创建、编辑、删除任务
- 设置任务优先级（紧急、中度、低优）
- 添加任务标签
- 设置截止时间
- 任务拖拽排序

### 数据统计
- 任务完成率环形图
- 各优先级任务数量统计
- 已完成/未完成任务统计


