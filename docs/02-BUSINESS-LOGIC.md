# Admin 业务逻辑梳理

> 重构前提取的"业务灵魂"，包含所有 API 接口、数据模型、鉴权机制和上传逻辑

---

## 一、API 路由与接口定义

### 基础配置
```typescript
// API 基础 URL
const DEFAULT_API_BASE_URL = '/api'

// 环境变量优先级
VITE_API_BASE_URL > VITE_SERVER_API_BASE_URL > '/api'
```

### 1. 认证相关 (Auth)

| 方法 | 路径 | 角色 | 请求体 | 响应 |
|------|------|------|--------|------|
| POST | `/admin/auth/login` | Admin | `{ username, password }` | `{ user, token: 'cookie' }` |
| POST | `/auth/login` | Author | `{ username, password }` | `{ user, token: 'cookie' }` |
| POST | `/admin/auth/logout` | Admin | - | void |
| POST | `/auth/logout` | Author | - | void |
| GET | `/admin/auth/me` | Admin | - | `User` |
| PATCH | `/admin/auth/me` | Admin | `{ avatarUrl, bio, displayName, email, roleTitle, emojiStatus }` | `User` |
| POST | `/admin/auth/impersonate` | Admin | `{ authorId, reason? }` | `{ token, user }` |
| POST | `/admin/auth/exit-impersonation` | Admin | - | void |
| GET | `/profile` | Author | - | `User` |
| PATCH | `/profile` | Author | `{ avatarUrl, bio, displayName, email, roleTitle, emojiStatus }` | `User` |
| PUT | `/profile/password` | Author | `{ currentPassword, newPassword }` | void |

### 2. 用户管理 (Users) - Admin 专属

| 方法 | 路径 | 请求体 | 响应 |
|------|------|--------|------|
| GET | `/admin/users?q=&status=&role=&page=&pageSize=` | - | `PageResult<User>` |
| GET | `/admin/users/:id` | - | `User` |
| POST | `/admin/users` | `{ username, password? }` | `{ user, initialPassword }` |
| POST | `/admin/users/:id/reset` | `{ reason? }` | `{ user, initialPassword }` |
| POST | `/admin/users/:id/ban` | `{ reason? }` | `User` |
| POST | `/admin/users/:id/unban` | - | `User` |
| POST | `/admin/users/:id/delete` | `{ graceDays? }` | `User` |
| POST | `/admin/users/:id/restore` | `{ confirm: true }` | `User` |
| POST | `/admin/users/:id/purge` | `{ confirm: true }` | void |
| PATCH | `/admin/users/:id/admin-meta` | `{ remark?, tags? }` | `User` |

### 3. 文章管理 (Articles)

| 方法 | 路径 | 角色 | 请求体 | 响应 |
|------|------|------|--------|------|
| GET | `/admin/articles?status=&authorId=&q=&page=&pageSize=` | Admin | - | `PageResult<Article>` |
| GET | `/articles?status=&categoryId=&q=&page=&pageSize=` | Author | - | `PageResult<Article>` |
| GET | `/admin/articles/:id` | Admin | - | `Article` |
| GET | `/articles/:id` | Author | - | `Article` |
| POST | `/articles` | Author | `ArticleWriteInput` | `Article` |
| PUT | `/articles/:id` | Author | `ArticleWriteInput` | `Article` |
| PUT | `/articles/:id` | Author | `{ categoryId }` | void |
| POST | `/articles/:id/publish` | Author | `{ confirm: true }` | `Article` |
| POST | `/admin/articles/:id/unpublish` | Admin | `{ confirm: true }` | `Article` |
| POST | `/articles/:id/unpublish` | Author | `{ confirm: true }` | `Article` |
| POST | `/articles/:id/save-draft` | Author | `{ confirm: true }` | `Article` |
| POST | `/admin/articles/:id/delete` | Admin | `{ confirm: true, graceDays?, reason? }` | void |
| POST | `/articles/:id/delete` | Author | `{ confirm: true, graceDays? }` | void |
| POST | `/admin/articles/:id/restore` | Admin | `{ confirm: true }` | void |
| POST | `/articles/:id/restore` | Author | `{ confirm: true }` | void |
| POST | `/admin/articles/:id/purge` | Admin | `{ confirm: true }` | void |
| POST | `/articles/:id/confirm-delete` | Author | `{ confirm: true }` | void |
| POST | `/articles/:id/request-restore` | Author | `{ message? }` | `{ requestedAt, message }` |
| PATCH | `/admin/articles/:id/admin-meta` | Admin | `{ remark? }` | `Article` |

### 4. 分类管理 (Categories)

| 方法 | 路径 | 角色 | 请求体 | 响应 |
|------|------|------|--------|------|
| GET | `/admin/categories?status=&ownerId=&page=&pageSize=` | Admin | - | `PageResult<Category>` |
| GET | `/categories?status=` | Author/Public | - | `Category[]` |
| GET | `/admin/categories/:id` | Admin | - | `Category` |
| GET | `/categories/:id` | Author | - | `Category` |
| POST | `/categories` | Author | `{ name, slug?, description?, coverImageUrl? }` | `Category` |
| PUT | `/categories/:id` | Author | `{ name, slug?, description?, coverImageUrl? }` | `Category` |
| POST | `/admin/categories/:id/delete` | Admin | `{ confirm: true, graceDays? }` | void |
| POST | `/categories/:id/delete` | Author | `{ confirm: true, graceDays? }` | void |
| POST | `/admin/categories/:id/restore` | Admin | `{ confirm: true }` | void |
| POST | `/categories/:id/restore` | Author | `{ confirm: true }` | void |
| POST | `/admin/categories/:id/purge` | Admin | `{ confirm: true }` | void |
| POST | `/categories/:id/confirm-delete` | Author | `{ confirm: true }` | void |
| PATCH | `/admin/categories/:id/admin-meta` | Admin | `{ remark? }` | `Category` |

### 5. 标签管理 (Tags)

| 方法 | 路径 | 角色 | 请求体 | 响应 |
|------|------|------|--------|------|
| GET | `/admin/tags?q=&page=&pageSize=` | Admin | - | `PageResult<Tag>` |
| GET | `/tags?q=&page=&pageSize=` | Author | - | `PageResult<Tag>` |
| GET | `/admin/tags/:id` | Admin | - | `Tag` |
| POST | `/tags` | Author | `{ name, color?, effect?, description? }` | `Tag` |
| POST | `/admin/tags` | Admin | `{ name, color?, effect?, description? }` | `Tag` |
| PATCH | `/admin/tags/:id` | Admin | `{ name?, color?, effect?, description? }` | `Tag` |
| PATCH | `/tags/:id` | Author | `{ name?, color?, effect?, description? }` | `Tag` |
| POST | `/admin/tags/:id/delete` | Admin | `{ confirm: true }` | void |
| POST | `/tags/:id/delete` | Author | `{ confirm: true }` | void |

### 6. 系统配置 (Config)

| 方法 | 路径 | 角色 | 请求体 | 响应 |
|------|------|------|--------|------|
| GET | `/admin/config` | Admin | - | `SystemConfig` |
| GET | `/config` | Author | - | `SystemConfig` |
| PATCH | `/admin/config` | Admin | `SystemConfig` | `SystemConfig` |
| POST | `/admin/config/publish` | Admin | `SystemConfig` | `SystemConfig` |
| POST | `/admin/config/preview/theme` | Admin | `{ themes, enableSeasonEffect?, seasonEffectType?, seasonEffectIntensity?, enableAnniversaryEffect? }` | `{ path }` |
| POST | `/admin/config/preview/all` | Admin | `SystemConfig` | `{ previewPath, frontendSiteConfigPath, appliedAt }` |

### 7. AI 配置

| 方法 | 路径 | 请求体 | 响应 |
|------|------|--------|------|
| PATCH | `/profile/ai-config` | `{ vendorId?, apiKey?, baseUrl?, model?, prompt? }` | `User` |
| POST | `/profile/ai-config/models` | `{ vendorId?, apiKey?, baseUrl? }` | `{ models: string[], latencyMs }` |
| POST | `/profile/ai-config/proxy` | `{ vendorId?, apiKey?, baseUrl?, model?, prompt?, messages?, temperature?, responseFormat? }` | `AiProxyResponse` |

### 8. 上传 (Upload)

| 方法 | 路径 | 请求体 | 响应 |
|------|------|--------|------|
| POST | `/admin/upload` | `FormData: file, purpose?` | `UploadResult` |
| POST | `/uploads` | `FormData: file, purpose?` | `UploadResult` |

**UploadPurpose 类型**：`'avatar' | 'article_cover' | 'category_cover' | 'favicon' | 'character_avatar' | 'ui_icon' | 'audio' | 'video' | 'misc'`

---

## 二、全局状态与鉴权 (Auth)

### 2.1 Token 存储机制

```typescript
// 实际使用 Cookie 认证 (HttpOnly, Secure)
// token 字段仅作标识，值为 'cookie'
const data = await request<{ user: unknown; token?: string }>(path, {
  method: 'POST',
  body: { username, password },
});
return { token: 'cookie', user: toUser(data.user) };
```

**关键点**：
- 后端使用 HttpOnly Cookie 存储 JWT
- 前端不直接操作 localStorage 存 token
- `credentials: 'include'` 自动携带 Cookie

### 2.2 请求拦截器逻辑

```typescript
// http.ts 核心逻辑
export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const url = path.startsWith('http') ? path : `${baseUrl}${path}`;
  
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(options.headers ?? {}),
  };
  
  // 仅当 token 非 'cookie' 时才添加到 Header
  if (options.token && options.token !== 'cookie') {
    headers.Authorization = `Bearer ${options.token}`;
  }
  
  const response = await fetch(url, {
    method: options.method ?? 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    credentials: 'include',  // 关键：携带 Cookie
  });
  
  // 401 未认证处理
  if (!response.ok && response.status === 401) {
    const payload = await response.json();
    if (['INVALID_TOKEN', 'NO_TOKEN', 'NOT_AUTHENTICATED'].includes(payload?.error?.code)) {
      window.dispatchEvent(new CustomEvent('admin:unauthorized'));
    }
  }
  
  return payload.data;
}
```

### 2.3 路由守卫逻辑

```typescript
// ApiService 中的权限检查
const requireAdmin = (session: Session) => {
  if (session.role !== UserRole.ADMIN) {
    throw new Error('ADMIN_REQUIRED');
  }
};

const requireAuthor = (session: Session) => {
  if (session.role !== UserRole.AUTHOR) {
    throw new Error('AUTHOR_REQUIRED');
  }
};
```

**Session 结构**：
```typescript
type Session = {
  token: string;   // 实际为 'cookie' 标识
  role: UserRole;  // 'admin' | 'author'
};
```

### 2.4 未认证事件处理

```typescript
// 全局监听未认证事件
window.addEventListener('admin:unauthorized', () => {
  // 跳转到登录页或刷新 token
});
```

---

## 三、核心数据模型 (Types/Interfaces)

### 3.1 用户 (User)

```typescript
interface User {
  id: string;
  username: string;
  role: UserRole;           // 'admin' | 'author'
  status: UserStatus;       // 'active' | 'banned' | 'deleted'
  isActive?: boolean;
  avatarUrl?: string | null;
  bio?: string | null;
  displayName?: string | null;
  email?: string | null;
  roleTitle?: string | null;
  emojiStatus?: string | null;
  bannedAt?: string | null;
  bannedReason?: string | null;
  deleteScheduledAt?: string | null;
  adminRemark?: string | null;
  adminTags?: string[];
  createdAt: string;
  updatedAt?: string;
  lastLoginAt?: string | null;
  preferences?: AuthorPreferences;
}

interface AuthorPreferences {
  articlePageSize?: number;
  recycleBinRetention?: number;
  statsLayout?: string;
  aiConfig?: {
    vendorId?: string;
    apiKey?: string;
    baseUrl?: string;
    model?: string;
    prompt?: string;
  };
}
```

### 3.2 文章 (Article)

```typescript
interface Article {
  id: string;
  authorId: string;
  title: string;
  slug: string;
  summary?: string | null;
  coverImageUrl?: string | null;
  tags: string[];
  categoryId?: string | null;
  status: ArticleStatus;    // 'draft' | 'published' | 'scheduled'
  views: number;
  likesCount?: number;
  firstPublishedAt?: string | null;
  publishedAt?: string | null;
  deletedAt?: string | null;
  deletedByRole?: UserRole | 'author' | 'admin' | null;
  deletedBy?: string | null;
  deleteScheduledAt?: string | null;
  deleteReason?: string | null;
  restoreRequestedAt?: string | null;
  restoreRequestedMessage?: string | null;
  adminRemark?: string | null;
  createdAt: string;
  updatedAt: string;
  markdown?: string;
}
```

### 3.3 分类 (Category)

```typescript
interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  coverImageUrl?: string | null;
  ownerId?: string | null;
  status?: CategoryStatus;  // 'active' | 'deleted'
  deletedAt?: string | null;
  deletedByRole?: UserRole | 'author' | 'admin' | null;
  deletedBy?: string | null;
  deleteScheduledAt?: string | null;
  adminRemark?: string | null;
  articleCount?: number;
  views?: number;
  likes?: number;
  createdAt?: string;
  updatedAt?: string;
}
```

### 3.4 标签 (Tag)

```typescript
interface Tag {
  id: string;
  name: string;
  slug: string;
  createdBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
  articleCount?: number;
  color?: string | null;
  effect?: 'glow' | 'pulse' | 'none';
  description?: string | null;
}
```

### 3.5 系统配置 (SystemConfig)

```typescript
interface SystemConfig {
  admin: AdminConfig;
  frontend: FrontendSiteConfig;
  oss: OssConfig;
}

interface AdminConfig {
  adminEmail: string;
  systemId: string;
  siteName: string;
  siteDescription: string;
  maintenanceMode: boolean;
  dashboardRefreshRate: number;
  showQuickDraft: boolean;
  enableAiAssistant: boolean;
  autoSaveInterval: number;
  allowAuthorCustomCategories: boolean;
  statsApiEndpoint: string;
  statsTool: StatsTool;
  allowRegistration: boolean;
  defaultUserRole: UserRole;
  recycleBinRetentionDays: number;
  activeEffectMode: VisualEffectMode;
  font: AdminFontConfig;
  enableEnhancedSeo?: boolean;
  adminTitle?: string;
  adminFavicon?: string;
  enableBgEffect?: boolean;
  effectIntensity?: number;
  previewLoadCover?: boolean;
}

interface OssConfig {
  enabled: boolean;
  provider: 'oss' | 'minio';
  endpoint?: string;
  bucket?: string;
  accessKey?: string;
  secretKey?: string;
  region?: string;
  customDomain?: string;
  uploadPath?: string;
  imageCompressionQuality?: number;
}
```

---

## 四、特殊业务机制：对象存储 (OSS/Minio)

### 4.1 上传流程

```typescript
// UploadService.uploadImage
async uploadImage(session: Session, file: File, purpose?: UploadPurpose): Promise<UploadResult> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${session.role === UserRole.ADMIN ? '/admin/upload' : '/uploads'}`;

  const formData = new FormData();
  formData.append('file', file);
  if (purpose) formData.append('purpose', purpose);

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
    credentials: 'include',  // 携带认证 Cookie
  });

  return payload.data;  // UploadResult
}
```

### 4.2 上传结果结构

```typescript
interface UploadResult {
  id: string;           // 上传记录 ID
  url: string;          // 文件访问 URL (可直接用于 img src)
  storage: 'local' | 'oss' | 'minio';
  storageKey: string;   // 存储路径/Key
  fileName: string;
  mimeType: string;
  size: number;         // 字节
  purpose: UploadPurpose;
  uploadedBy: string | null;
  createdAt: string;
  updatedAt: string;
}
```

### 4.3 文件回显规则

**后端已处理 URL 拼接**：
- `result.url` 已经是完整可访问的 URL
- 无需前端拼接域名
- 可直接用于 `<img src={result.url} />`

**URL 示例**：
```typescript
// 阿里云 OSS
'https://mybucket.oss-cn-beijing.aliyuncs.com/uploads/2024/01/xxx.jpg'

// MinIO
'https://minio.example.com/mybucket/uploads/2024/01/xxx.jpg'

// 本地存储
'/uploads/2024/01/xxx.jpg'
```

### 4.4 使用场景映射

| Purpose | 用途 | 组件 |
|---------|------|------|
| `'avatar'` | 用户头像 | 个人设置页 |
| `'article_cover'` | 文章封面 | 文章编辑器 |
| `'category_cover'` | 分类封面 | 分类管理 |
| `'favicon'` | 网站图标 | 系统设置 |
| `'character_avatar'` | 角色头像 | 角色配置 |
| `'ui_icon'` | UI 图标 | 主题设置 |
| `'audio'` | 音频文件 | 附件上传 |
| `'video'` | 视频文件 | 附件上传 |
| `'misc'` | 其他 | 通用上传 |

### 4.5 上传组件关键逻辑

```typescript
// 文件选择
const handleFileSelect = async (file: File) => {
  // 1. 验证文件类型
  if (!file.type.startsWith('image/')) {
    throw new Error('仅支持图片文件');
  }
  
  // 2. 验证文件大小 (例如 10MB)
  const MAX_SIZE = 10 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    throw new Error('文件大小超过限制');
  }
  
  // 3. 上传
  const result = await UploadService.uploadImage(session, file, purpose);
  
  // 4. 使用返回的 URL
  setImageUrl(result.url);
};

// 预览
<img src={imageUrl} alt="Preview" />
```

---

## 五、通用响应格式

### 5.1 API 信封结构

```typescript
interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  error: ApiError | null;
}

interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}
```

### 5.2 分页结构

```typescript
interface PageResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
```

---

## 六、重构检查清单

重构新 Admin 时，确保以下业务逻辑完整保留：

- [ ] 所有 API 接口路径与请求/响应格式
- [ ] Cookie 认证机制 (`credentials: 'include'`)
- [ ] 401 未认证事件处理
- [ ] User/Article/Category/Tag 完整字段定义
- [ ] 上传组件与 OSS/Minio 对接逻辑
- [ ] 角色权限检查 (requireAdmin/requireAuthor)
- [ ] AI 配置接口 (如使用)
- [ ] 系统配置预览/发布流程
