# Nx Monorepo - Resume Agent Platform

## Overview

A full-stack application platform built with Nx monorepo, featuring a React frontend and NestJS backend service for AI-powered resume agent functionality. The platform enables resume upload, storage, AI-powered querying, and intelligent candidate management.

## Architecture

```
┌─────────────────┐
│   Frontend      │
│  (React+Vite)   │
│   Port: 4200    │
└────────┬────────┘
         │
         ▼
┌──────────────────┐     ┌──────────────────┐
│nest_resume_agent │────▶│  Vector Store    │
│   NestJS API     │     │  (HNSWLib)       │
│   Port: 3000     │     │                  │
└──────────────────┘     └──────────────────┘
```

## Projects

### Frontend Application

- **frontend** - React + Vite application for the user interface
  - Resume upload and management
  - AI-powered chat interface
  - Candidate listing and statistics
  - Real-time agent interactions

### Backend Service

- **nest_resume_agent** - NestJS-based resume agent service (Port: 3000)
  - Resume upload and storage
  - Vector database management (HNSWLib)
  - AI agent integration with LangChain
  - Natural language processing
  - Resume analysis and intelligent matching
  - Resume querying and retrieval

## Tech Stack

### Frontend
- React 18
- Vite
- TypeScript
- SCSS
- Axios (API client)

### Backend
- NestJS
- TypeScript
- Node.js
- LangChain (AI/ML)
- HNSWLib (Vector database)
- Multer (File upload)

### Tooling
- Nx (Monorepo management)
- ESLint
- Jest/Vitest
- TypeScript

## Prerequisites

- Node.js (v18 or higher)
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

### Run Backend Service

Start the resume agent service:

```bash
nx serve nest_resume_agent
```

API available at: `http://localhost:3000`

### Run All Services

To run both services simultaneously:

```bash
nx run-many --target=serve --projects=frontend,nest_resume_agent --parallel=2
```

## Project Details

### Frontend (`apps/frontend`)

#### Features
- **Resume Upload**: Drag-and-drop or file selection for resume uploads
- **Agent Chat**: Interactive AI chat interface for querying resumes
- **Candidate Cards**: Visual display of candidate information
- **Resume List**: Comprehensive list of all uploaded resumes
- **Statistics Dashboard**: Resume analytics and insights

#### Key Components
- `NestResumeAgent.tsx` - Main agent interface component
- `AgentChat.tsx` - Chat interface for AI interactions
- `ResumeUpload.tsx` - Resume upload functionality
- `ResumeList.tsx` - Resume listing component
- `CandidateCard.tsx` - Individual candidate display
- `ResumeStats.tsx` - Statistics and analytics

#### API Integration
The frontend uses `apiClient.ts` service to communicate with the backend service at `http://localhost:3000`.

#### Environment Variables

Create `apps/frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
```

### Resume Agent Service (`apps/nest_resume_agent`)

#### Features
- Resume file upload and storage
- Vector database integration (HNSWLib)
- AI-powered natural language query processing
- Resume semantic search
- Intelligent candidate matching
- Context-aware responses
- Document processing and indexing

#### Project Structure
```
src/
├── agent/                    # AI Agent module
│   ├── agent.controller.ts   # Agent endpoints
│   ├── agent.service.ts      # Agent business logic
│   ├── agent.module.ts       # Agent module definition
│   └── dto/                  # Data transfer objects
│       ├── query.dto.ts
│       └── query-response.dto.ts
├── resume/                   # Resume management module
│   ├── resume.controller.ts  # Resume endpoints
│   ├── resume.service.ts     # Resume business logic
│   └── resume.module.ts      # Resume module definition
├── config/                   # Configuration module
│   ├── app-config.service.ts
│   └── config.module.ts
├── dto/                      # Shared DTOs
│   └── agent.dto.ts
├── app.module.ts             # Root module
└── main.ts                   # Application entry point
```

#### API Endpoints

**Resume Endpoints**
- `POST /resume/upload` - Upload a resume file
- `GET /resume/list` - Get all resumes
- `GET /resume/:id` - Get specific resume
- `DELETE /resume/:id` - Delete a resume

**Agent Endpoints**
- `POST /agent/query` - Query the AI agent with natural language
- `GET /agent/status` - Get agent status
- `POST /agent/initialize` - Initialize vector store
- `POST /agent/analyze` - Analyze resume content
- `POST /agent/match` - Match candidates to job requirements

#### Storage
- **Resumes**: Stored in `apps/nest_resume_agent/resumes/`
  - Example files:
    - `mantu_nigam_resume-1768629921069-86966842.txt`
    - `sarah_johnson_resume-1768629914151-564190360.txt`
    - `vinod_malik_resume-1768629901277-220635803.txt`
- **Vector DB**: Stored in `apps/nest_resume_agent/resume_db/`
  - `args.json` - Vector store arguments
  - `docstore.json` - Document store
  - `hnswlib.index` - HNSW index file

#### Environment Variables

Create `apps/nest_resume_agent/.env`:

```env
PORT=3000
NODE_ENV=development
UPLOAD_DIR=./resumes
VECTOR_DB_DIR=./resume_db
OPENAI_API_KEY=your_openai_api_key
MODEL_NAME=gpt-3.5-turbo
TEMPERATURE=0.7
MAX_TOKENS=500
```

## Development

### Build Projects

Build a specific project:

```bash
nx build frontend
```

```bash
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
```

```bash
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
nx lint frontend
```

```bash
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
│   ├── frontend/                      # React + Vite frontend
│   │   ├── src/
│   │   │   ├── app/                   # App component
│   │   │   │   ├── app.tsx
│   │   │   │   └── app.module.scss
│   │   │   ├── components/            # React components
│   │   │   │   ├── AgentChat.tsx
│   │   │   │   ├── CandidateCard.tsx
│   │   │   │   ├── NestResumeAgent.tsx
│   │   │   │   ├── NestResumeAgent.css
│   │   │   │   ├── ResumeList.tsx
│   │   │   │   ├── ResumeStats.tsx
│   │   │   │   └── ResumeUpload.tsx
│   │   │   ├── services/              # API services
│   │   │   │   └── apiClient.ts
│   │   │   ├── assets/                # Static assets
│   │   │   ├── main.tsx               # Entry point
│   │   │   └── styles.scss            # Global styles
│   │   ├── public/
│   │   │   └── favicon.ico
│   │   ├── index.html
│   │   ├── project.json
│   │   ├── vite.config.mts
│   │   └── tsconfig.json
│   │
│   └── nest_resume_agent/             # Resume agent service (Port: 3000)
│       ├── src/
│       │   ├── agent/                 # Agent module
│       │   │   ├── agent.controller.ts
│       │   │   ├── agent.service.ts
│       │   │   ├── agent.module.ts
│       │   │   └── dto/
│       │   │       ├── query.dto.ts
│       │   │       └── query-response.dto.ts
│       │   ├── resume/                # Resume module
│       │   │   ├── resume.controller.ts
│       │   │   ├── resume.service.ts
│       │   │   └── resume.module.ts
│       │   ├── config/                # Configuration
│       │   │   ├── app-config.service.ts
│       │   │   └── config.module.ts
│       │   ├── dto/                   # Shared DTOs
│       │   │   └── agent.dto.ts
│       │   ├── app.controller.ts
│       │   ├── app.controller.spec.ts
│       │   ├── app.module.ts
│       │   ├── app.service.ts
│       │   └── main.ts
│       ├── resumes/                   # Uploaded resume files
│       │   ├── mantu_nigam_resume-1768629921069-86966842.txt
│       │   ├── sarah_johnson_resume-1768629914151-564190360.txt
│       │   └── vinod_malik_resume-1768629901277-220635803.txt
│       ├── resume_db/                 # Vector database
│       │   ├── args.json
│       │   ├── docstore.json
│       │   └── hnswlib.index
│       ├── test/
│       │   ├── app.e2e-spec.ts
│       │   └── jest-e2e.json
│       ├── project.json
│       ├── nest-cli.json
│       ├── jest.config.js
│       └── tsconfig.json
│
├── libs/                              # Shared libraries
├── dist/                              # Build output
├── node_modules/
├── nx.json                            # Nx workspace configuration
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

## Usage Examples

### Upload a Resume

```bash
curl -X POST http://localhost:3000/resume/upload \
  -F "file=@resume.pdf" \
  -F "name=John Doe"
```

### Query the Agent

```bash
curl -X POST http://localhost:3000/agent/query \
  -H "Content-Type: application/json" \
  -d '{"query": "Find candidates with Python experience"}'
```

### Get Resume List

```bash
curl http://localhost:3000/resume/list
```

### Get Agent Status

```bash
curl http://localhost:3000/agent/status
```

## Nx Features

### Caching

Nx caches build and test results for faster execution:

```bash
nx build frontend
```

```bash
nx build frontend
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
```

```bash
nx affected:test
```

```bash
nx affected:lint
```

### Parallel Execution

Run tasks in parallel for better performance:

```bash
nx run-many --target=build --all --parallel=2
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
- Resume Agent: `dist/apps/nest_resume_agent`

## Deployment

### Frontend Deployment

The frontend can be deployed to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static hosting service

Build command:

```bash
nx build frontend --configuration=production
```

### Backend Deployment

The backend service can be deployed to:
- AWS (EC2, ECS, Lambda)
- Google Cloud Platform
- Heroku
- Docker containers
- Kubernetes

#### Docker Example

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/apps/nest_resume_agent ./
COPY apps/nest_resume_agent/resumes ./resumes
COPY apps/nest_resume_agent/resume_db ./resume_db
EXPOSE 3000
CMD ["node", "main.js"]
```

Build and run:

```bash
docker build -t resume-agent .
```

```bash
docker run -p 3000:3000 -e OPENAI_API_KEY=your_key resume-agent
```

## Troubleshooting

### Clear Nx Cache

```bash
nx reset
```

### Reinstall Dependencies

```bash
rm -rf node_modules package-lock.json
```

```bash
npm install
```

### View Project Configuration

```bash
nx show project frontend --web
```

```bash
nx show project nest_resume_agent --web
```

### Port Already in Use

If you get a port conflict error on port 3000:

```bash
lsof -ti:3000 | xargs kill -9
```

If you get a port conflict error on port 4200:

```bash
lsof -ti:4200 | xargs kill -9
```

### Vector Database Issues

If the vector database is corrupted, delete and reinitialize:

```bash
rm -rf apps/nest_resume_agent/resume_db/*
```

Then restart the backend service to reinitialize.

### Resume Upload Issues

Ensure the resumes directory exists:

```bash
mkdir -p apps/nest_resume_agent/resumes
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
- [LangChain Documentation](https://js.langchain.com)

## License

MIT