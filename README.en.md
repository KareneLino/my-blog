# MultiTerm Blog (Monorepo)

[中文](README.md)

This repo includes **Server / Admin / Frontend**:
- `server/`: Node.js + Express + MongoDB API service  
- `admin/`: React + Vite admin console  
- `frontend/`: Astro public site  

---

## Structure

```
.
├─ server/       # API service
├─ admin/        # Admin console
├─ frontend/     # Public site
├─ scripts/      # Local bootstrap/seed scripts (git-ignored)
└─ review-code/  # Review artifacts (git-ignored)
```

---

## Requirements

- Node.js 18+ (20+ recommended)
- pnpm
- MongoDB

---

## Quick Start (Local Dev)

### 1) Install deps

```bash
pnpm -C server install
pnpm -C admin install
pnpm -C frontend install
```

### 2) MongoDB Installation & Setup (Required for First-time Users)

If you haven't installed MongoDB yet:
- **Windows**: https://www.mongodb.com/try/download/community
- **macOS**: `brew tap mongodb/brew && brew install mongodb-community`
- **Ubuntu**: https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/

**You MUST complete the following steps before starting the Server:**

#### Step 1: Start MongoDB Service

```bash
# Windows (run PowerShell as Administrator)
net start MongoDB

# macOS
brew services start mongodb-community

# Ubuntu
sudo systemctl start mongod
```

#### Step 2: Create Root Admin User

Open MongoDB Shell (run `mongosh` or `mongo` in terminal), **first create the root user**:

```javascript
// Switch to admin database
use admin

// Create root user (change username and password as needed)
db.createUser({
  user: "myroot",
  pwd: "root_password",
  roles: [ 
    { role: "userAdminAnyDatabase", db: "admin" },
    "readWriteAnyDatabase"
  ]
})
```

> 💡 **Note**: MongoDB allows creating the first user without authentication when connecting from localhost. As long as you're connecting from the same machine, the above command will work directly.

#### Step 3: Create Business Database and App User

```javascript
// 1. Authenticate as root
db.auth("myroot", "root_password")

// 2. Switch to business database (name it as you like, here we use myblog)
use myblog

// 3. Create app user (for this blog system)
db.createUser({
  user: "bloguser",
  pwd: "your_password",
  roles: [
    { role: "readWrite", db: "myblog" },
    { role: "dbAdmin", db: "myblog" }
  ]
})

// 4. Verify user was created
db.getUsers()
```

You should see output like:
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

#### Step 4: Configure Server Environment Variables

Copy `server/.env.example` → `server/.env` and fill in your details:

```bash
# Server port
PORT=3000

# MongoDB connection (must match the app user created in Step 3)
MONGO_USERNAME=bloguser        # app username (NOT the root username)
MONGO_PASSWORD=your_password   # app user password
MONGO_DBNAME=myblog            # database name (must match "use xxx")
MONGO_HOST=127.0.0.1           # MongoDB address (keep default for local)
MONGO_PORT=27017               # MongoDB port (default 27017)

# JWT secret (for authentication, use any long random string)
JWT_SECRET=your_super_secret_key_here_at_least_32_chars

# Admin account (auto-created on first startup)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

> 💡 **Note**: The above configuration uses the **app user** (`bloguser`), not the root user. Since the app user was created in the `myblog` database, no additional `MONGO_AUTH_SOURCE` configuration is needed.

**⚠️ Common Issues**: If you get `Authentication failed` on startup, check:
1. Username/password match the app user created in Step 3
2. `MONGO_DBNAME` matches the database name in `use myblog`
3. MongoDB service is running (`net start MongoDB` or `brew services list`)

**Special Case**: If you created the app user in the `admin` database (instead of `myblog`), add to `.env`:
```bash
MONGO_AUTH_SOURCE=admin
```

**Admin (optional)**  
Copy `admin/.env.example` → `admin/.env.local`:

```
VITE_API_BASE_URL=http://localhost:3000/api
```

**Frontend (optional)**  
Copy `frontend/.env.example` → `frontend/.env.local`:

```
PUBLIC_API_BASE_URL=http://localhost:3000/api
```

### 3) Run dev

```bash
pnpm -C server dev
pnpm -C admin dev
pnpm -C frontend dev
```

Default ports:
- Server: `http://localhost:3000`
- Admin: `http://localhost:3001`
- Frontend: `http://localhost:4321`

---

## Auth (HttpOnly Cookie)

- Server sets HttpOnly cookies on login (frontend doesn’t store tokens).
- Frontend requests must use `credentials: 'include'` (already in admin).

Main endpoints:
- Admin login: `POST /api/admin/auth/login`
- Admin logout: `POST /api/admin/auth/logout`
- Author login: `POST /api/auth/login`
- Author logout: `POST /api/auth/logout`

---

## One‑click bootstrap + seed (DB reset)

> ⚠️ `up -Yes` **drops collections** and wipes DB data.

```powershell
powershell -ExecutionPolicy Bypass -File scripts\start-test-system.ps1 up -Yes
```

See `scripts/README.md` for details.

---

## Docs index (中文 / English)

- Server: `server/README.md` / `server/README.en.md`
- Admin: `admin/README.md` / `admin/README.en.md`
- Frontend: `frontend/README.md` / `frontend/README.en.md`
- API: `docs/API.md` / `docs/API.en.md`
- Deployment: `docs/DEPLOYMENT.md` / `docs/DEPLOYMENT.en.md`
- Env examples: `server/.env.example`, `admin/.env.example`, `frontend/.env.example`
