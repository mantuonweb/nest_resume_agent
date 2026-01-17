# Nx Monorepo - Resume Agent Platform

## Overview

A full-stack application platform built with Nx monorepo, featuring React frontend and NestJS backend services for resume agent functionality.

## Projects

### Frontend Applications

- **frontend** - React + Vite application for the user interface

### Backend Services

- **backend-nestjs** - Main NestJS backend API service
- **nest_resume_agent** - NestJS-based resume agent service

## Tech Stack

### Frontend
- React
- Vite
- TypeScript
- SCSS

### Backend
- NestJS
- TypeScript
- Node.js

### Tooling
- Nx (Monorepo management)
- ESLint
- Jest/Vitest
- TypeScript

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Nx CLI (optional, but recommended)

```bash
npm install -g nx
```

## Installation

Install all dependencies:

```bash
npm install
```

## Quick Start

### Run Frontend

Start the frontend development server:

```bash
nx serve frontend
```

Access at: `http://localhost:4200`

### Run Backend Services

Start the main backend service:

```bash
nx serve backend-nestjs
```

Start the resume agent service:

```bash
nx serve nest_resume_agent
```

### Run All Services

To run multiple services simultaneously, use:

```bash
nx run-many --target=serve --projects=frontend,backend-nestjs,nest_resume_agent
```

## Development

### Build Projects

Build a specific project:

```bash
nx build frontend
nx build backend-nestjs
nx build nest_resume_agent
```

Build all projects:

```bash
nx run-many --target=build --all
```

Build only affected projects:

```bash
nx affected --target=build
```

### Run Tests

Test a specific project:

```bash
nx test frontend
nx test backend-nestjs
nx test nest_resume_agent
```

Test all projects:

```bash
nx run-many --target=test --all
```

Test only affected projects:

```bash
nx affected --target=test
```

### Lint Code

Lint a specific project:

```bash
nx lint backend-nestjs
nx lint nest_resume_agent
```

Lint all projects:

```bash
nx run-many --target=lint --all
```

### Type Checking

For frontend (Vite projects):

```bash
nx typecheck frontend
```

## Project Structure

```
.
├── apps/
│   ├── frontend/                 # React + Vite frontend
│   │   ├── src/
│   │   ├── project.json
│   │   ├── vite.config.ts
│   │   └── README.md
│   ├── backend-nestjs/           # Main NestJS backend
│   │   ├── src/
│   │   ├── test/
│   │   ├── project.json
│   │   └── README.md
│   └── nest_resume_agent/        # Resume agent service
│       ├── src/
│       ├── test/
│       ├── project.json
│       └── README.md
├── libs/                         # Shared libraries
├── dist/                         # Build output
├── node_modules/
├── nx.json                       # Nx workspace configuration
├── package.json
├── tsconfig.base.json
└── README.md
```

## Available Commands

### Workspace Commands

| Command | Description |
|---------|-------------|
| `nx graph` | View interactive dependency graph |
| `nx show project <name>` | Show project details and targets |
| `nx list` | List installed plugins |
| `nx affected:graph` | View affected projects graph |
| `nx reset` | Clear Nx cache |

### Project Commands

| Command | Description |
|---------|-------------|
| `nx serve <project>` | Start development server |
| `nx build <project>` | Build project |
| `nx test <project>` | Run tests |
| `nx lint <project>` | Lint code |
| `nx typecheck <project>` | Type check (Vite projects) |

### Batch Commands

| Command | Description |
|---------|-------------|
| `nx run-many --target=<target> --all` | Run target on all projects |
| `nx run-many --target=<target> --projects=<p1,p2>` | Run target on specific projects |
| `nx affected --target=<target>` | Run target on affected projects |

## Environment Configuration

### Frontend Environment Variables

Create `.env` files in `apps/frontend/`:

```env
VITE_API_URL=http://localhost:3000
VITE_RESUME_AGENT_URL=http://localhost:3001
```

### Backend Environment Variables

Create `.env` files in backend projects:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/db
```

## Nx Features

### Caching

Nx caches build and test results for faster execution:

```bash
nx build frontend  # First run - slow
nx build frontend  # Second run - instant (from cache)
```

Clear cache:

```bash
nx reset
```

### Dependency Graph

Visualize project dependencies:

```bash
nx graph
```

View affected projects:

```bash
nx affected:graph
```

### Affected Commands

Only run tasks on projects affected by changes:

```bash
nx affected:build
nx affected:test
nx affected:lint
```

### Parallel Execution

Run tasks in parallel for better performance:

```bash
nx run-many --target=build --all --parallel=3
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: CI

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: nx affected --target=lint --base=origin/main
      - run: nx affected --target=test --base=origin/main
      - run: nx affected --target=build --base=origin/main
```

## Production Build

Build all projects for production:

```bash
nx run-many --target=build --all --configuration=production
```

Build outputs:
- Frontend: `dist/apps/frontend`
- Backend NestJS: `dist/apps/backend-nestjs`
- Resume Agent: `dist/apps/nest_resume_agent`

## Deployment

### Frontend Deployment

The frontend can be deployed to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static hosting service

### Backend Deployment

The backend services can be deployed to:
- AWS (EC2, ECS, Lambda)
- Google Cloud Platform
- Heroku
- Docker containers
- Kubernetes

## Troubleshooting

### Clear Nx Cache

```bash
nx reset
```

### Reinstall Dependencies

```bash
rm -rf node_modules package-lock.json
npm install
```

### View Project Configuration

```bash
nx show project frontend --web
nx show project backend-nestjs --web
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run affected tests: `nx affected:test`
4. Run affected lint: `nx affected:lint`
5. Submit a pull request

## Learn More

- [Nx Documentation](https://nx.dev)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [NestJS Documentation](https://docs.nestjs.com)
- [TypeScript Documentation](https://www.typescriptlang.org)