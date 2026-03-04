# API Service (Server)

[中文](README.md)

Node.js + Express + MongoDB backend service providing admin / author / public APIs.

---

## Requirements

- Node.js 18+
- pnpm
- MongoDB (**authentication required**)

---

## Quick Start

### 1. Prerequisite: Configure MongoDB Authentication

**⚠️ Security Requirement: You must create a database user first**

```bash
# Enter MongoDB Shell
mongosh

# Create database and user
use myblog

db.createUser({
  user: "bloguser",
  pwd: "your_secure_password",
  roles: [
    { role: "readWrite", db: "myblog" }
  ]
})

# Verify connection
exit
mongosh myblog -u bloguser -p your_secure_password --authenticationDatabase myblog
```

### 2. Configure Environment Variables

```bash
# Copy environment template
copy .env.example .env

# Edit .env, fill in database authentication info
MONGO_USERNAME=bloguser
MONGO_PASSWORD=your_secure_password
MONGO_AUTH_SOURCE=myblog  # If user created in admin db, change to admin
```

### 3. Install Dependencies and Start

```bash
# Install dependencies
pnpm install

# Start server
pnpm dev
```

Server runs at `http://localhost:3000`.

**After first start, create an admin account:**

The default admin account is already configured in `.env` (`ADMIN_USERNAME` and `ADMIN_PASSWORD`), just run:

```bash
npx ts-node src/scripts/createAdmin.ts --yes
```

To use custom credentials, add parameters (higher priority than env vars):
```bash
npx ts-node src/scripts/createAdmin.ts --yes --username myadmin --password mypass123
```

---

## Environment Variables

Copy `.env.example` → `.env`, **must fill in database authentication info**:

```bash
# Required
MONGO_DBNAME=myblog
MONGO_HOST=127.0.0.1
MONGO_PORT=27017
MONGO_USERNAME=your_db_user      # Required (security requirement)
MONGO_PASSWORD=your_db_password  # Required
MONGO_AUTH_SOURCE=myblog         # Defaults to MONGO_DBNAME
JWT_SECRET=your_jwt_secret       # Required

# Optional: Default admin account (for createAdmin script)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

### Security Configuration

- **Default behavior**: Authentication is required (`MONGO_AUTH_ENABLED` defaults to true)
- **Explicitly disable** (not recommended, for special test environments only):
  ```bash
  MONGO_AUTH_ENABLED=false
  ```

---

## Available Scripts

```bash
# Create admin user (uses ADMIN_USERNAME/PASSWORD from .env)
npx ts-node src/scripts/createAdmin.ts --yes

# Or with custom credentials
npx ts-node src/scripts/createAdmin.ts --yes --username admin --password admin123

# Clear database (for development)
npx ts-node src/scripts/clearDatabase.ts --yes

# Export frontend content
npx ts-node src/scripts/exportFrontendContent.ts --out-dir ../frontend/src/content/posts/_generated
```

---

## Build & Deploy

```bash
# Build
pnpm build

# Production
pnpm start
```

---

## Authentication

After login, server sets an HttpOnly Cookie. Frontend doesn't need to store tokens.  
Main endpoints:
- Admin login: `POST /api/admin/auth/login`
- Author login: `POST /api/auth/login`

---

## Troubleshooting

### Error: MONGO_USERNAME is required for security reasons.

**Cause**: Database username not configured  
**Fix**: Set `MONGO_USERNAME` and `MONGO_PASSWORD` in `.env`, or explicitly disable auth (not recommended)

### Error: Authentication failed.

**Cause**: Wrong username, password, or authSource  
**Fix**: 
1. Verify MongoDB user exists: `mongosh myblog -u bloguser -p password --authenticationDatabase myblog`
2. Check `MONGO_AUTH_SOURCE` in `.env` matches the database where user was created

### View MongoDB Logs

```bash
# Windows
type "C:\Program Files\MongoDB\Server\8.2\log\mongod.log"

# macOS
tail -f /usr/local/var/log/mongodb/mongo.log

# Linux
tail -f /var/log/mongodb/mongod.log
```

---

## Documentation

- API docs: `../docs/API.en.md`
- Deployment: `../docs/DEPLOYMENT.en.md`
