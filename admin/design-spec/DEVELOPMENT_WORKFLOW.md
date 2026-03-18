# Admin V2 开发流程规范 (Development Workflow)

本文档定义了 Admin V2 重建过程中的代码协作、组件开发及质量保障流程。

---

## 1. 协作与分支管理 (Git & Collaboration)

### 分支策略
- 所有的重建工作在 `feat/admin-rebuild-v2` 分支进行。
- 较大的功能模块（如“文章编辑器”）建议从主开发分支拉出子分支，完成后合并。

### 提交消息规范 (Commit Messages)
采用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：
- `feat(scope)`: 新功能（如：`feat(ui): 增加拟态按钮组件`）
- `fix(scope)`: 修复 Bug
- `docs(scope)`: 文档更新
- `style(scope)`: 仅样式调整，不影响逻辑
- `refactor(scope)`: 代码重构
- `chore(scope)`: 依赖更新或构建任务

---

## 2. 组件开发工作流 (Component Workflow)

### 开发顺序：从原子到页面
1.  **原子组件 (UI)**：在 `src/components/ui/` 下创建基础组件（如 `Button.tsx`, `Card.tsx`）。
2.  **复合组件 (Components)**：在 `src/components/` 下组合原子组件形成功能块。
3.  **业务页面 (Pages)**：在 `src/pages/` 下组织最终页面逻辑。

### 组件标准
- **单一职责**：一个文件只导出一个主组件。
- **Props 类型**：所有 Props 必须显式定义。
- **动效集成**：Framer Motion 逻辑应直接封装在 UI 组件内，对外部透明。
- **主题适配**：必须同时测试亮色和暗色模式。

---

## 3. 技术标准 (Technical Standards)

### TypeScript
- 开启严格模式。
- 优先使用 `interface` 定义 Props。
- 严禁使用 `any`。

### 样式 (Tailwind CSS 4)
- 遵循 `VISUAL_GUIDE.md` 中的设计 Tokens。
- 复杂的动画类或重复使用的样式，建议通过 `@theme` 定义在 CSS 中，而非冗长的行内类。

### 状态管理
- 局部状态：`useState` / `useReducer`。
- 全局状态：优先使用 React Context 或简单的全局 Store (如 Zustand)。

---

## 4. 质量保障 (Quality Assurance)

### 验证步骤
在宣布一个任务“完成”前，必须执行：
1.  **视觉走查**：对照 `VISUAL_GUIDE.md` 检查圆角、模糊度、动效。
2.  **静态检查**：运行 `pnpm -C admin lint`。
3.  **类型检查**：运行 `pnpm -C admin lint` (当前映射为 `tsc --noEmit`)。

---

## 6. 沉浸式编辑器 (ArticleEditor) 待办事项 (Pending Tasks)

虽然编辑器在视觉与基础交互上已达到较高水准，但在业务闭环与深度体验上仍有以下技术债/待办事项需要处理：

### 1. 图片占位符替换逻辑 (Placeholder Replacement)
- **现状**：本地上传图片时，已能在光标处插入类似 `![上传中...](uploading-123)` 的占位符，但上传成功后未做真实 URL 的替换。
- **目标**：在 `useArticleEditor` 的级别实现基于 ID 或正则的文本替换，确保上传完成后占位符平滑转变为真实 Markdown 语法，而不仅是追加。

### 2. 沉浸式全局图片上传 (Drag, Drop & Paste)
- **目标**：监听正文 `textarea` 的 `onDrop` (拖拽文件) 和 `onPaste` (剪贴板截图) 事件。
- **期望交互**：触发上述事件后，立刻在光标处生成占位符，并在后台静默上传，最后自动替换，实现零打断的写作心流。

### 3. API 全面对接 (API Integration)
- **依赖**：需要先封装一个带 Token 拦截、全局错误处理的统一前端 `ApiClient`（如基于 Axios 或 Fetch）。
- **待对接接口**：
  - 加载文章详情 (`GET /api/author/articles/:id`)
  - 自动保存/创建草稿 (`POST / PATCH /api/author/articles`)
  - 正式发布接口。

### 4. 预览区深度定制 (Preview Renderer Customization)
- **目标**：目前 `react-markdown` 的图片渲染是原生的。需要重写 `components.img`，为预览区的图片增加 `rounded-2xl`、高品质阴影，甚至点击放大的 Lightbox 支持。
