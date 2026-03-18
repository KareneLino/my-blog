# Admin V2 视觉与交互设计规范 (Visual & Interaction Guide)

本文档旨在定义 MultiTerm Blog Admin V2 重建过程中的视觉语言、交互准则及布局逻辑。

---

## 1. 设计定位：Glass-Primer Fusion
本项目定位为 **“沉浸式工业工作台”**。它结合了：
- **Glassmorphism (拟态玻璃)**：提供情感、深度、氛围和通透感。
- **Primer (GitHub Style)**：提供理性、秩序、严谨的结构和高效的交互逻辑。

---

## 2. 核心视觉原则 (Visual Principles)

### 材质与边界 (Material & Borders)
- **底层容器**：采用 `backdrop-blur-2xl` 的拟态玻璃。
- **工业级分割**：容器内部使用 Primer 风格的 `1px` 边框 (`border-zinc-200/20`) 进行严格的功能分区（Header/Body/Footer）。
- **阴影**：不使用大面积模糊阴影，改为 Primer 风格的多层精确投影，增强实体的压感。

### 页面标题标准 (Page Headers)
- **结构**：H1 主标题 + 描述性副标题。
- **字号**：H1 (`text-4xl` / `font-serif` / `font-bold`)，副标题 (`text-lg` / `text-zinc-500`)。
- **间距**：H1 与副标题之间严格保持 `space-y-1`。
- **全局一致性**：所有业务主页面必须采用此结构作为视觉起点。

### 原子组件字号标准 (Component Typography)
- **基准值**：全站核心组件（Button, Input, Table Header）主体文字统一为 `text-base` (16px)。
- **工具类组件**：导航/过滤类组件（如 SegmentedControl）使用 `text-sm` (14px) 以降低视觉干扰。
- **字重控制**：交互项使用 `font-bold` 或 `font-semibold` 以增强点击感。
- **小字例外**：仅 Slug、Badge 内部文字、代码片段可使用 `text-sm` (14px)。


### 辛克灰度阶 (Zinc Palette)
- 全站基于 `Tailwind Zinc` 色系，强调黑白灰的极简对比，避免使用高饱和度背景。

---

## 3. 布局规范 (Layout Specifications)

### 全局网格 (Global Grid)
- **容器间距**：默认使用 `gap-6` 到 `gap-10`，拒绝拥挤。
- **安全边距**：移动端 `p-6`，桌面端 `p-10` 到 `p-12`。

### 侧边栏 (Sidebar)
- **形态**：浮动卡片式边栏，带有高度模糊的背景。
- **交互**：支持完全收起，收起后仅保留图标或完全隐藏以进入“全屏创作模式”。

### 内容容器 (Content Containers)
- **列表页**：控制信息密度，行高加倍，每行数据都有清晰的悬停高亮状态。
- **编辑器**：单栏居中布局 (`max-w-4xl mx-auto`)，移除所有无关干扰，进入沉浸式写作态。

---

## 4. 交互反馈 (Interaction Feedback)

### 物理级动效 (Motion)
- **弹簧感**：所有动画使用 `type: "spring", stiffness: 300, damping: 25`。
- **序列化**：页面加载时，卡片应依次渐现，而非同时弹出。

### 即时状态 (States)
- **光标**：可点击元素强制 `cursor-pointer`。
- **反馈**：
  - **Hover**：微小的位移 (`-translate-y-0.5`) 或 缩放 (`scale-[1.02]`)。
  - **Active**：按压感 (`scale-[0.98]`)。
  - **Loading**：自定义 SVG 线性动画，符合极简审美。

---

## 5. 语义配色标准 (Semantic Color Standards)

### 数据模型状态 (Data Model Statuses)
全站状态标识（Badge）严格遵循以下语义配色，确保管理后台的信息传递具备直观的一致性。

| 业务对象 | 状态 | 语义 | 配色标准 (Tailwind) | 视觉表现 |
| :--- | :--- | :--- | :--- | :--- |
| **文章 (Article)** | `DRAFT` | 草稿 | `zinc-500` | 极简灰色，未激活的原始态。 |
| | `EDITING` | 编辑中 | `blue-500` | 科技蓝，正在创作与流转。 |
| | `PUBLISHED` | 已发布 | `emerald-500` | 生机绿，已公开、活跃的内容。 |
| | `PENDING_DELETE` | 待回收 | `red-500` | 警示红，进入回收倒计时。 |
| **用户 (User)** | `ACTIVE` | 活跃 | `emerald-500` | 安全绿，账号权限正常。 |
| | `BANNED` | 已禁用 | `amber-500` | 警告橙，强制阻断但非注销。 |
| | `PENDING_DELETE` | 待注销 | `rose-500` | 玫瑰红，处于注销冷静期。 |

### 全局消息反馈 (Global Message Feedback - Toast)
`Toaster` (基于 Sonner) 的提示消息应与系统状态标准高度对齐：

| 消息类型 | 语义 | 配色 (文字/图标) | 典型场景 |
| :--- | :--- | :--- | :--- |
| `success` | 操作成功 | `emerald-500` | 发布文章、保存设置成功。 |
| `error` | 错误/失败 | `red-500` | 接口报错、权限拒绝、校验失败。 |
| `warning` | 警告/注意 | `amber-500` | 敏感操作确认、非阻断性异常。 |
| `info` | 信息/通知 | `blue-500` | 系统公告、操作引导、中性通知。 |

### 物理级确认反馈 (Confirmation Dialogs)
`ConfirmDialog` 采用更重的语义化反馈，引导用户在关键决策点保持警觉。

| 变体 (Variant) | 语义 | 图标 (Lucide) | 按钮配色标准 |
| :--- | :--- | :--- | :--- |
| `success` | 动作确认 | `CheckCircle2` | `emerald-500` 风格。用于“确认发布”等积极操作。 |
| `warning` | 风险提醒 | `AlertTriangle` | `amber-500` 风格。用于“清空缓存”等不可逆但非破坏性操作。 |
| `danger` | 破坏性警告 | `AlertCircle` | `red-500` 风格。用于“彻底删除”等危险操作。 |
| `info` | 通用确认 | `Info` | `blue-500` 风格。用于常规路径跳转确认。 |
| `primary` | 极简确认 | `Info` | `zinc-900` / `white` 高对比度风格。系统默认行为。 |

---

## 6. 原子组件标准 (Atomic Specs - TODO)
- [ ] **Button**: 拟态主按钮，带流光或位移动效。
- [ ] **Input**: 高模糊输入框，Focus 时 Ring 环渐变。
- [ ] **Modal**: 居中弹窗，背景高强度模糊，入场带回弹效果。
