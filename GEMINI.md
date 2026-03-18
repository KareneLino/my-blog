# MultiTerm Blog: Project Context & Guidelines

This document provides essential context for Gemini to assist in the development and maintenance of the MultiTerm Blog project.

## Project Overview

MultiTerm Blog is a terminal-inspired, feature-rich blog system architected as a monorepo. It focuses on high performance, secure content management, and a rich reading experience.

### Core Architecture

- **Server (`/server`)**: Node.js + Express + MongoDB (Mongoose). Handles authentication, content management, and media uploads.
- **Admin Dashboard (`/admin`)**: React 19 + Vite + Tailwind CSS 4. A modern, authenticated interface for managing posts, categories, and tags.
- **Frontend (`/frontend`)**: Astro 5 + Tailwind CSS 4. A fast, content-driven site with rich markdown/MDX support and custom plugins.

## Technical Stack

| Component | Key Technologies |
| :--- | :--- |
| **Backend** | Node.js, Express 5, MongoDB, Mongoose, JWT (HttpOnly Cookies), TypeScript, Multer, Zod |
| **Admin** | React 19, Vite, Tailwind CSS 4, React Router 7, Motion, Lucide React |
| **Frontend** | Astro 5, Tailwind CSS 4, MDX, Rehype/Remark (custom plugins), Satori (OG images) |
| **Database** | MongoDB (Authentication Required by default) |
| **Package Manager** | `pnpm` |

## Directory Structure

```text
.
├── admin/          # React Admin Dashboard
│   ├── src/        # React source code
│   └── ...         # Vite/Tailwind configs
├── frontend/       # Astro Frontend Site
│   ├── src/        # Astro components, layouts, and plugins
│   └── ...         # Astro/Tailwind configs
├── server/         # Express API Server
│   ├── src/        # TypeScript source code
│   └── ...         # Database models, routes, and services
├── docs/           # Project documentation (API, Deployment, etc.)
├── scripts/        # Automation scripts (e.g., test system startup)
└── GEMINI.md       # (This file)
```

## Setup & Development Commands

### 1. Prerequisites
- Node.js 20+
- pnpm
- MongoDB with authentication enabled.

### 2. Dependency Installation
Run in the root directory:
```bash
pnpm -C server install
pnpm -C admin install
pnpm -C frontend install
```

### 3. Running in Development
| Service | Command | Default URL |
| :--- | :--- | :--- |
| **Server** | `pnpm -C server dev` | `http://localhost:3000` |
| **Admin** | `pnpm -C admin dev` | `http://localhost:3001` |
| **Frontend** | `pnpm -C frontend dev` | `http://localhost:4321` |

### 4. Database Initialization
After starting the server, create the initial admin account:
```bash
cd server
npx ts-node src/scripts/createAdmin.ts --yes
```

## Development Conventions

### Security & Authentication
- **MongoDB Auth**: Required by default (`MONGO_AUTH_ENABLED=true`).
- **Authentication**: Uses HttpOnly Cookies. Frontend requests must include `credentials: 'include'`.
- **Validation**: Strict input validation using Zod on the backend.
- **Rate Limiting**: Implemented for sensitive endpoints (login, uploads).

### Frontend & Styling
- **Tailwind CSS 4**: Used in both Admin and Frontend. Avoid legacy Tailwind configurations where possible.
- **Rich Content**: The frontend uses several custom Rehype/Remark plugins (located in `frontend/src/plugins/`) to handle math, admonitions, and special character dialogues.

### Code Style
- **TypeScript**: Mandatory for all new code.
- **Linting & Formatting**: ESLint and Prettier are configured for each sub-project.
- **Commits**: Ensure changes are atomic and well-documented.

## Core Features
- **Markdown/MDX Support**: Advanced content rendering including KaTeX, GFM, and custom directives.
- **Media Management**: Support for local and OSS (Aliyun/MinIO) storage.
- **Theme System**: Terminal-inspired aesthetic with light/dark/auto support.
- **Automation**: PowerShell scripts in `scripts/` for seeding and testing the entire system.
