# gxk的待办清单 (进阶版) - 技术设计文档 (TDD)

## 1. 架构与技术栈概述 (Architecture & Tech Stack)

本项目采用纯前端架构，数据持久化依赖客户端存储，状态流转采用集中式管理。

- **构建工具:** Vite
- **核心框架:** React 18 + TypeScript
- **状态管理:** Zustand (全局单例 Store)
- **样式方案:** Tailwind CSS (实用类优先，无需外部 UI 组件库)
- **日期处理:** date-fns (轻量级，替代 Moment.js)
- **图标方案:** lucide-react (按需引入 SVG 图标)
- **数据持久化:** Web LocalStorage API

------

## 2. 目录结构设计 (Directory Structure)

采用经典的“按职责划分”目录结构，保持高度模块化：

Plaintext

```
src/
├── assets/          # 静态资源 (图片、全局 css 等)
├── components/      # React 组件库
│   ├── layout/      # 布局组件 (Header, Sidebar)
│   ├── todo/        # 业务组件 (AddTodoForm, TodoList, TodoItem)
│   ├── widget/      # 扩展组件 (WeatherWidget)
│   └── common/      # 通用基础组件 (Button, Input, Select, Card 等)
├── store/           # Zustand 状态管理
│   └── useTodoStore.ts
├── types/           # TS 类型定义
│   ├── todo.ts      # 包含 Todo, Priority, Category, Filter 等接口
│   └── weather.ts   # 天气 API 响应类型
├── utils/           # 工具函数
│   ├── storage.ts   # LocalStorage 封装
│   └── weather.ts   # 天气 API 请求封装
├── hooks/           # 自定义 Hooks
│   └── useDebounce.ts # 防抖 Hook (用于搜索框和天气输入)
├── App.tsx          # 根组件，组装 Layout
└── main.tsx         # 入口文件
```

------

## 3. 组件拆分与交互层级

整个应用的界面采用高度组件化的设计，数据由外向内单向流动，交互通过触发全局 Store 的 Action 来实现。

- **布局层 (Layout)**
  - **全局容器 (AppContainer)：** 负责控制全局背景色（米黄色）、最大宽度限制以及整体居中对齐。
  - **顶部导航 (Header)：** 包含左侧的项目标题和副标题，以及右侧独立挂载的天气小组件。底部有一条贯穿的视觉分割线。
  - **主体内容区 (MainContent)：** 采用 Flex 或 Grid 布局，将页面严格按照 3:7 分割为左侧边栏和右侧主操作区。
- **左侧边栏层 (Sidebar - 30% 宽度)**
  - **统计卡片 (StatsCard)：** 一个纯展示组件。订阅 Store 中的计算属性，实时展示“总任务”、“待完成（橙色数字）”、“已完成（绿色数字）”和“完成率（百分比）”。
  - **分类筛选卡片 (FilterCard)：** 渲染“全部”、“工作”、“学习”、“生活”四个分类按钮。组件内部不需要维护选中状态，而是读取 Store 中当前的 `filter.category` 来决定哪个按钮高亮。点击按钮时，派发 `setFilter` 动作给 Store。
- **右侧主操作层 (Main Area - 70% 宽度)**
  - **任务添加区 (AddTodoCard)：** 包含标题输入框、分类下拉菜单、优先级下拉菜单和添加按钮。作为受控组件管理内部表单输入状态，点击“添加”时，组装数据并调用 Store 的 `addTodo` 方法，随后清空输入框。
  - **任务列表区 (TodoListCard)：** * **头部：** 包含动态标题（随选中分类变化）和搜索输入框（输入变化时防抖触发 `setFilter` 更新搜索词）。
    - **列表容器：** 订阅 Store 中“过滤后的任务列表（FilteredTodos）”并进行循环渲染。如果列表为空，展示空状态提示（如“暂无待办事项”）。
    - **单项任务 (TodoItem)：** 渲染单个任务的 UI。包含复选框（点击触发 `toggleTodo`）、标题与描述、分类与优先级标签。鼠标悬浮时展示编辑和删除图标（点击分别触发编辑弹窗或 `deleteTodo`）。

## 4. 状态管理设计 (Zustand Store)

全局状态采用集中式管理，严格区分原始状态数据与计算派生数据，确保单一数据源。

- **State（核心状态对象）：**
  - `todos`：一个数组，存储所有的待办事项对象。每个对象包含唯一 ID、标题、描述、分类、优先级、完成状态、截止日期和创建时间。
  - `filter`：一个对象，记录当前的视图筛选条件，包含 `category`（当前选中分类）、`priority`（当前选中优先级）、`status`（当前选中状态）和 `searchQuery`（搜索关键词）。
- **Actions（状态变更动作）：**
  - `addTodo`：接收任务基础信息，自动生成 UUID 和当前时间戳，追加到 `todos` 数组头部。
  - `deleteTodo`：接收目标 ID，通过数组过滤方法移除对应任务。
  - `updateTodo`：接收目标 ID 和更新的字段对象，匹配 ID 后合并修改现有数据。
  - `toggleTodoStatus`：接收目标 ID，将其 `completed` 布尔值取反。
  - `setFilter`：接收部分筛选条件对象，合并到当前的 `filter` 状态中。
- **Getters（派生状态计算逻辑）：**
  - `getFilteredTodos`：内部执行链式过滤。首先用 `filter` 状态去筛选 `todos` 的分类、优先级和状态，然后使用 `searchQuery` 对标题和描述进行字符串模糊匹配（转小写比对），最终返回一个新数组供组件渲染。
  - `getStats`：遍历 `todos` 数组，累加计算出总数、已完成数量，并应用数学公式计算出百分比完成率，返回一个包含四个数字指标的对象。

## 5. 核心工具类与外部 API 集成 (Utils & API)

- **本地持久化存储 (LocalStorage Utils)：**
  - **读取逻辑 (`getTodos`)：** 在应用初始化时被调用。需要使用 `try-catch` 包裹 `JSON.parse`，以防本地数据损坏导致应用白屏。如果没有读取到数据，返回空数组。
  - **写入逻辑 (`saveTodos`)：** 接收最新的 `todos` 数组并使用 `JSON.stringify` 序列化存入浏览器。
  - **同步机制：** 利用 Zustand 的 `subscribe` 方法或直接在每个修改 `todos` 的 Action 函数内部调用 `saveTodos`，确保状态与本地存储始终强一致。
- **天气扩展组件集成 (Weather API)：**
  - **数据流向：** 天气组件内部维护自己的局部状态（loading、error、weatherData）。由于与其他待办数据无关，无需放入全局 Store。
  - **请求控制：** 当组件挂载或用户修改了城市输入框并回车时，触发网络请求函数。请求函数中需对用户输入的城市名称进行 URL 编码。
  - **数据清洗：** 接收到第三方 API（如高德、和风天气）的响应后，只提取需要的关键字段（如当前温度、天气描述文字、对应的天气图标代码），摒弃冗余数据，并渲染到 UI 上。

## 6. 样式与 UI 规范 (Tailwind CSS Guidelines)

完全基于 Tailwind CSS 的原子化类名构建，不依赖第三方组件库，通过约定的样式组合保证全站视觉统一。

- **全局色彩规范映射：**
  - **背景层：** 全局页面背景设定为较暖的浅米色，以减轻视觉疲劳。
  - **卡片层：** 所有信息容器强制设定为纯白背景，配合极细的灰色边框和非常轻柔的底层阴影（`shadow-sm`），营造悬浮感。
  - **文字层：** 标题使用深灰/近黑色，副标题、描述和时间信息使用浅灰色，确保层次分明。
- **交互状态与动画表现：**
  - **按压与悬浮：** 所有的按钮（Button）、列表项（TodoItem）必须包含悬浮态（Hover）反馈，例如背景色轻微加深。
  - **过渡动画：** 强制给所有交互元素添加基础的颜色和透明度过渡属性（`transition-all duration-200`），让状态切换显得平滑柔和。
- **业务状态视觉标识：**
  - **待办/已完成：** 未完成状态下，文字保持高对比度；复选框被勾选后，标题文字变为浅灰色，并自动加上删除线（`line-through`）。
  - **优先级标签系统：** 通过“背景浅色 + 边框同色系浅色 + 文字同色系深色”的组合来实现。高优先级使用红色系，中优先级使用蓝色系，低优先级使用灰色系。