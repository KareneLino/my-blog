# MultiTerm Blog（Monorepo）

[English](README.en.md)

本仓库包含 **Server / Admin / Frontend** 三端子项目：
- `server/`：Node.js + Express + MongoDB API 服务  
- `admin/`：React + Vite 管理后台  
- `frontend/`：Astro 前台站点  

---

## 目录结构

```
.
├─ server/       # API 服务
├─ admin/        # 管理后台
├─ frontend/     # 前台站点
├─ scripts/      # 本地一键启动/播种脚本（默认不进 Git）
└─ review-code/  # Review 产物（默认不进 Git）
```

---

## 运行环境

- Node.js 18+（建议 20+）
- pnpm
- MongoDB（需要启用认证）

---

## 快速开始（本地开发）

### 1) 安装 MongoDB 并启动服务

如果你还没有安装 MongoDB：
- **Windows**: https://www.mongodb.com/try/download/community
- **macOS**: `brew tap mongodb/brew && brew install mongodb-community`
- **Ubuntu**: https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/

启动服务：

```bash
# Windows (以管理员身份运行 PowerShell)
net start MongoDB

# macOS
brew services start mongodb-community

# Ubuntu
sudo systemctl start mongod
```

### 2) 配置 MongoDB 认证（安全必须）

**⚠️ 本项目要求 MongoDB 启用认证，默认配置需要你先创建数据库用户。**

进入 MongoDB Shell 创建用户：

```bash
# Windows (找到 mongosh 的安装路径，或直接使用 mongo)
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
```

验证用户创建成功：
```bash
# 退出后重新连接验证
mongosh myblog -u bloguser -p your_secure_password --authenticationDatabase myblog
```

> 💡 **关于 authSource**：如果用户创建在 `admin` 数据库，连接时需要 `authSource=admin`；如果创建在 `myblog` 数据库，使用 `authSource=myblog`（或省略，默认使用目标数据库）。

### 3) 配置 Server 环境变量

```bash
# 复制环境变量模板
copy server\.env.example server\.env

# 编辑 .env 文件，填入数据库认证信息
MONGO_USERNAME=bloguser
MONGO_PASSWORD=your_secure_password
MONGO_AUTH_SOURCE=myblog  # 如果用户创建在 admin 库，改为 admin
```

### 4) 安装依赖

```bash
pnpm -C server install
pnpm -C admin install
pnpm -C frontend install
```

### 5) 启动 Server

```bash
pnpm -C server dev
```

Server 会在 `http://localhost:3000` 启动。

**首次启动后，创建管理员账号：**

`.env` 中已配置了默认管理员账号（`ADMIN_USERNAME` 和 `ADMIN_PASSWORD`），直接运行：

```bash
cd server
npx ts-node src/scripts/createAdmin.ts --yes
```

如需自定义账号，可添加参数（优先级高于环境变量）：
```bash
npx ts-node src/scripts/createAdmin.ts --yes --username myadmin --password mypass123
```

### 6) 配置 Admin & Frontend（可选）

```bash
# Admin
copy admin\.env.example admin\.env.local
# 默认配置即可

# Frontend  
copy frontend\.env.example frontend\.env.local
# 默认配置即可
```

### 7) 启动所有服务

```bash
pnpm -C server dev      # http://localhost:3000
pnpm -C admin dev       # http://localhost:3001
pnpm -C frontend dev    # http://localhost:4321
```

---

## 认证说明（HttpOnly Cookie）

- 登录成功后由服务端写入 HttpOnly Cookie（前端不保存 token）。  
- 前端请求需带上 `credentials: 'include'`（已在 admin 中实现）。  

主要接口：
- 管理员登录：`POST /api/admin/auth/login`
- 管理员登出：`POST /api/admin/auth/logout`
- 作者登录：`POST /api/auth/login`
- 作者登出：`POST /api/auth/logout`

---

## 一键启动 + 播种数据（可重置 DB）

> ⚠️ `up -Yes` 会 **DROP collections**，清空数据库。

```powershell
powershell -ExecutionPolicy Bypass -File scripts\start-test-system.ps1 up -Yes
```

脚本说明：`scripts/README.md`

---

## 安全配置说明

本项目**默认要求 MongoDB 认证**，以防止未授权访问。如需显式禁用（不推荐，仅限特殊测试环境）：

```bash
# 在 .env 中添加
MONGO_AUTH_ENABLED=false
```

---

## 故障排查

### MongoDB 连接失败

**错误**: `MONGO_USERNAME is required for security reasons.`
- **原因**: 没有配置数据库认证信息
- **解决**: 按步骤 2 创建用户，并在 .env 中配置

**错误**: `Authentication failed.`
- **原因**: 用户名/密码错误或 authSource 不正确
- **解决**: 检查 MONGO_USERNAME、MONGO_PASSWORD 和 MONGO_AUTH_SOURCE

### 查看 MongoDB 日志

```bash
# Windows
type "C:\Program Files\MongoDB\Server\8.2\log\mongod.log"

# macOS/Linux
tail -f /var/log/mongodb/mongod.log
```

---

## 文档索引

- Server：`server/README.md`
- Admin：`admin/README.md`
- Frontend：`frontend/README.md`
- API：`docs/API.md`
- 部署：`docs/DEPLOYMENT.md`
