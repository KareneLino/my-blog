# API 服务（Server）

[English](README.en.md)

Node.js + Express + MongoDB 后端服务，提供 admin / author / public API。

---

## 运行环境

- Node.js 18+
- pnpm
- MongoDB（**需要启用认证**）

---

## 快速开始

### 1. 前提：配置 MongoDB 认证

**⚠️ 安全要求：必须先创建数据库用户**

```bash
# 进入 MongoDB Shell
mongosh

# 创建数据库和用户
use myblog

db.createUser({
  user: "bloguser",
  pwd: "your_secure_password",
  roles: [
    { role: "readWrite", db: "myblog" }
  ]
})

# 验证连接
exit
mongosh myblog -u bloguser -p your_secure_password --authenticationDatabase myblog
```

### 2. 配置环境变量

```bash
# 复制环境变量模板
copy .env.example .env

# 编辑 .env，填写数据库认证信息
MONGO_USERNAME=bloguser
MONGO_PASSWORD=your_secure_password
MONGO_AUTH_SOURCE=myblog  # 如果用户创建在 admin 库，改为 admin
```

### 3. 安装依赖并启动

```bash
# 安装依赖
pnpm install

# 启动服务
pnpm dev
```

Server 将在 `http://localhost:3000` 启动。

**首次启动后，创建管理员账号：**

`.env` 中已配置了默认管理员账号（`ADMIN_USERNAME` 和 `ADMIN_PASSWORD`），直接运行：

```bash
npx ts-node src/scripts/createAdmin.ts --yes
```

如需自定义账号，可添加参数（优先级高于环境变量）：
```bash
npx ts-node src/scripts/createAdmin.ts --yes --username myadmin --password mypass123
```

---

## 环境变量

复制 `.env.example` → `.env`，**必须填写数据库认证信息**：

```bash
# 必需
MONGO_DBNAME=myblog
MONGO_HOST=127.0.0.1
MONGO_PORT=27017
MONGO_USERNAME=your_db_user      # 必填（安全要求）
MONGO_PASSWORD=your_db_password  # 必填
MONGO_AUTH_SOURCE=myblog         # 默认为 MONGO_DBNAME
JWT_SECRET=your_jwt_secret       # 必填

# 可选：默认管理员账号（用于 createAdmin 脚本）
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

### 安全配置说明

- **默认行为**：认证是必需的（`MONGO_AUTH_ENABLED` 默认为 true）
- **显式禁用**（不推荐，仅限特殊测试环境）：
  ```bash
  MONGO_AUTH_ENABLED=false
  ```

---

## 可用脚本

```bash
# 创建管理员（使用 .env 中的 ADMIN_USERNAME/PASSWORD）
npx ts-node src/scripts/createAdmin.ts --yes

# 或使用自定义账号
npx ts-node src/scripts/createAdmin.ts --yes --username admin --password admin123

# 清空数据库（开发调试用）
npx ts-node src/scripts/clearDatabase.ts --yes

# 导出前端内容
npx ts-node src/scripts/exportFrontendContent.ts --out-dir ../frontend/src/content/posts/_generated
```

---

## 构建与部署

```bash
# 构建
pnpm build

# 生产运行
pnpm start
```

---

## 认证说明

登录成功后服务端写入 HttpOnly Cookie，前端无需保存 token。  
主要接口：
- 管理员登录：`POST /api/admin/auth/login`
- 作者登录：`POST /api/auth/login`

---

## 故障排查

### 错误：MONGO_USERNAME is required for security reasons.

**原因**: 没有配置数据库用户名  
**解决**: 在 `.env` 中设置 `MONGO_USERNAME` 和 `MONGO_PASSWORD`，或显式禁用认证（不推荐）

### 错误：Authentication failed.

**原因**: 用户名、密码或 authSource 不正确  
**解决**: 
1. 验证 MongoDB 用户存在：`mongosh myblog -u bloguser -p password --authenticationDatabase myblog`
2. 检查 `.env` 中的 `MONGO_AUTH_SOURCE` 是否匹配用户所在数据库

### 查看 MongoDB 日志

```bash
# Windows
type "C:\Program Files\MongoDB\Server\8.2\log\mongod.log"

# macOS
tail -f /usr/local/var/log/mongodb/mongo.log

# Linux
tail -f /var/log/mongodb/mongod.log
```

---

## 文档

- API 文档：`../docs/API.md`
- 部署说明：`../docs/DEPLOYMENT.md`
