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
- MongoDB

---

## 快速开始（本地开发）

### 1) 安装依赖

```bash
pnpm -C server install
pnpm -C admin install
pnpm -C frontend install
```

### 2) MongoDB 安装与配置（首次使用必看）

如果你还没有安装 MongoDB，请先安装：
- **Windows**: https://www.mongodb.com/try/download/community
- **macOS**: `brew tap mongodb/brew && brew install mongodb-community`
- **Ubuntu**: https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/

安装完成后，**必须完成以下步骤才能启动 Server**：

#### Step 1: 启动 MongoDB 服务

```bash
# Windows (以管理员身份运行 PowerShell)
net start MongoDB

# macOS
brew services start mongodb-community

# Ubuntu
sudo systemctl start mongod
```

#### Step 2: 创建 root 管理员

打开 MongoDB Shell（终端输入 `mongosh` 或 `mongo`），**第一步先创建 root 用户**：

```javascript
// 切换到 admin 数据库
use admin

// 创建 root 用户（用户名和密码请自行修改）
db.createUser({
  user: "myroot",
  pwd: "root_password",
  roles: [ 
    { role: "userAdminAnyDatabase", db: "admin" },
    "readWriteAnyDatabase"
  ]
})
```

> 💡 **说明**：MongoDB 允许从本地（localhost）连接时无需认证即可创建第一个用户。只要你是从本机连接的，上述命令就能直接执行。

#### Step 3: 用 root 用户创建业务数据库和应用用户

```javascript
// 1. 用 root 用户登录
db.auth("myroot", "root_password")

// 2. 切换到业务数据库（名称可自定义，这里用 myblog）
use myblog

// 3. 创建应用用户（给本博客系统使用）
db.createUser({
  user: "bloguser",
  pwd: "your_password",
  roles: [
    { role: "readWrite", db: "myblog" },
    { role: "dbAdmin", db: "myblog" }
  ]
})

// 4. 验证用户创建成功
db.getUsers()
```

看到类似下面的输出说明创建成功：
```json
{
  "users": [
    {
      "user": "bloguser",
      "db": "myblog",
      "roles": [
        { "role": "readWrite", "db": "myblog" },
        { "role": "dbAdmin", "db": "myblog" }
      ]
    }
  ]
}
```

#### Step 4: 配置 Server 环境变量

复制 `server/.env.example` → `server/.env`，按实际情况填写：

```bash
# Server 端口
PORT=3000

# MongoDB 连接信息（必须与 Step 3 创建的业务用户一致）
MONGO_USERNAME=bloguser        # 业务用户名（不是 root 用户名）
MONGO_PASSWORD=your_password   # 业务用户密码
MONGO_DBNAME=myblog            # 数据库名称（必须与 use xxx 一致）
MONGO_HOST=127.0.0.1           # MongoDB 地址（本地保持默认）
MONGO_PORT=27017               # MongoDB 端口（默认 27017）

# JWT 密钥（用于登录验证，随意设置一个长字符串）
JWT_SECRET=your_super_secret_key_here_at_least_32_chars

# 管理员账号（首次启动后会自动创建）
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

> 💡 **注意**：上面的配置使用**业务用户**（`bloguser`）连接，不是 root 用户。因为业务用户创建在 `myblog` 库，所以无需额外配置 `MONGO_AUTH_SOURCE`。

**⚠️ 常见问题**：如果启动时报 `Authentication failed`，检查：
1. 用户名/密码是否与 Step 3 创建的业务用户一致
2. `MONGO_DBNAME` 是否与 `use myblog` 的数据库名一致
3. MongoDB 服务是否已启动（`net start MongoDB` 或 `brew services list`）

**特殊情况**：如果你把业务用户创建在了 `admin` 数据库（而不是 `myblog`），需要在 `.env` 中额外添加：
```bash
MONGO_AUTH_SOURCE=admin
```

**Admin（可选）**  
复制 `admin/.env.example` → `admin/.env.local`：

```
VITE_API_BASE_URL=http://localhost:3000/api
```

**Frontend（可选）**  
复制 `frontend/.env.example` → `frontend/.env.local`：

```
PUBLIC_API_BASE_URL=http://localhost:3000/api
```

### 3) 启动开发服务

```bash
pnpm -C server dev
pnpm -C admin dev
pnpm -C frontend dev
```

默认端口：
- Server：`http://localhost:3000`
- Admin：`http://localhost:3001`
- Frontend：`http://localhost:4321`

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

## 文档索引（中文 / English）

- Server：`server/README.md` / `server/README.en.md`
- Admin：`admin/README.md` / `admin/README.en.md`
- Frontend：`frontend/README.md` / `frontend/README.en.md`
- API：`docs/API.md` / `docs/API.en.md`
- 部署：`docs/DEPLOYMENT.md` / `docs/DEPLOYMENT.en.md`
- 环境变量示例：`server/.env.example`、`admin/.env.example`、`frontend/.env.example`
