# Cursor AI Agent 开发准则 (Todo List Advanced)

## 1. 核心架构与布局绝对约束 (Layout Constraints)

- **拒绝第三方组件库**：绝对禁止引入 Ant Design、MUI、Radix 等重量级 UI 库。所有 UI 必须基于原生 HTML 标签配合 Tailwind CSS 纯手写。
- **背景与居中约束**：全局 `body` 背景色强制设定为米黄色 (`bg-[#f5f5f0]`)。主体应用必须是一个最大宽度限制（如 `max-w-6xl`）且水平居中 (`mx-auto`) 的容器。
- **严格 3:7 分栏布局**：主体内容区必须使用 Flex 或 Grid 实现左右分栏：
  - 左侧 (`Sidebar`)：占据约 30% 宽度，包含统计卡片与分类筛选。
  - 右侧 (`MainArea`)：占据约 70% 宽度，承载添加任务表单与任务列表。
- **移动端降级**：当屏幕 `< 768px` 时，转为单列垂直流式排布，左侧面板移动至右侧主内容上方。

## 2. 数据与状态管理准则 (Data & State Management)

- **绝对单一数据源 (SSOT)**：所有涉及待办任务的数据流转，必须 100% 经过 `src/store/useTodoStore.ts` (Zustand)。严禁在组件内部使用 `useState` 维护影响全局业务逻辑的任务数据。
- **强制数据持久化**：只要 Zustand Store 中的 `todos` 数组发生增、删、改操作，必须立即同步调用 `utils/storage.ts` 将数据覆盖写入 Web LocalStorage。
- **防伪造/防幻觉**：严禁 AI 编造后端 API 请求逻辑，该项目的任务数据存储属于纯前端 LocalStorage 方案。
- **零 `any` 原则**：所有对象和函数参数必须具有严格的 TypeScript 类型定义，类型一律从 `src/types/todo.ts` 中引入。任务的唯一标识 ID 强制使用原生 `crypto.randomUUID()` 生成，勿引入外部 UUID 库。

## 3. 视觉与 UI 规范 (Visual UI Rules)

- **卡片基准视觉**：所有的面板容器强制使用一致的卡片样式组合：`bg-white rounded-lg border border-gray-200 shadow-sm p-4` (或 p-6)。
- **交互反馈与动效 (Micro-interactions)**：
  - 所有的按钮、可点击标签、任务项 (`TodoItem`) 必须具备 Hover 态（如背景变灰 `hover:bg-gray-50`）和过渡动画 (`transition-all duration-200`)。
  - 任务项的“编辑”和“删除”按钮默认隐藏（或透明度极低），仅在鼠标悬浮于该 `TodoItem` 时才显现。
- **业务状态视觉映射**：
  - **完成态降级**：当任务 `completed` 为 `true` 时，该任务的主标题和描述强制使用 `text-gray-400` 并添加删除线 `line-through`。
  - **优先级色彩**：必须严格遵循：高优先级使用红色系 (`text-red-600 bg-red-50 border-red-200`)，中优先级蓝色系，低优先级灰色系。

## 4. 特殊组件约束 (Specific Features Constraints)

- **时间与日期处理**：必须使用 `date-fns` 进行格式化，严禁使用过时的 `moment.js` 或手写容易出错的正则格式化。
- **图标引用**：严格使用 `lucide-react` 作为唯一图标库，按需解构引入（如 `import { Trash2, Edit } from 'lucide-react'`）。
- **强制防抖 (Debounce)**：搜索框 (`searchQuery`) 和 天气城市输入框 的内容变化，必须通过自定义 Hook (`useDebounce`) 进行延迟处理（300ms-500ms），严禁每一次按键都触发全局状态重新过滤或网络请求。
- **天气 API 安全准则**：外部天气 API 的密钥必须通过 `import.meta.env.VITE_WEATHER_API_KEY` 读取，绝对不能在组件或工具函数中硬编码暴露 Key。

## 5. 代码质量与交付规范 (Code Quality)

- 全部使用 Functional Components + React Hooks。
- 组件保持单一职责：例如 `TodoList` 组件只负责遍历渲染，单项的具体 UI 和状态切换需下放给独立的 `TodoItem` 组件。
- 在涉及复杂业务逻辑（如 Store 中的 `getFilteredTodos` 链式过滤逻辑、天气 API 数据清洗逻辑）时，必须保留简明扼要的中文注释。