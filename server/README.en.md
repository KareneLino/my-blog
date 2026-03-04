# API Server

[中文](README.md)

Node.js + Express + MongoDB backend providing admin / author / public APIs.

---

## Requirements

- Node.js 18+
- pnpm
- MongoDB

---

## Env

### First-time Setup: Create MongoDB Users

You must create root and app users in MongoDB before starting the server:

```javascript
// 1. Enter MongoDB Shell (run mongosh in terminal)
// 2. Create root user
use admin
db.createUser({
  user: "myroot",
  pwd: "root_password",
  roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]
})

// 3. Login as root, create app user
db.auth("myroot", "root_password")
use myblog
db.createUser({
  user: "bloguser",
  pwd: "your_password",
  roles: [
    { role: "readWrite", db: "myblog" },
    { role: "dbAdmin", db: "myblog" }
  ]
})
```

See project root `README.md` for full instructions.

### Configure .env

Copy `server/.env.example` → `server/.env`:

```bash
MONGO_USERNAME=bloguser        # app username (match createUser user field)
MONGO_PASSWORD=your_password   # app user password
MONGO_DBNAME=myblog            # database name (match use xxx)
JWT_SECRET=your_random_secret  # any long random string
```

**Note**: If app user was created in `admin` database, add `MONGO_AUTH_SOURCE=admin` to `.env`.

### Other Optional Config

- `PORT` (default 3000)
- `UPLOAD_DIR` (single path segment only; no `/` or `..`)

---

## Run

```bash
pnpm install
pnpm dev
```

Build / start:

```bash
pnpm build
pnpm start
```

---

## Auth (HttpOnly Cookie)

Server sets HttpOnly cookies on login; frontend doesn’t store tokens.  
Middlewares still accept `Authorization: Bearer ...` for compatibility/scripts.

Key endpoints:
- Admin login: `POST /api/admin/auth/login`
- Admin logout: `POST /api/admin/auth/logout`
- Author login: `POST /api/auth/login`
- Author logout: `POST /api/auth/logout`

---

## Local scripts

See `scripts/README.md` at repo root for bootstrap/seed helpers.

---

## Docs

- API doc: `docs/API.en.md`
- Deployment: `docs/DEPLOYMENT.en.md`
