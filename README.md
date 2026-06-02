# SWAN Circuit LLM Frontend

Frontend application for **SWAN AI**, a web interface that lets users chat with an LLM to generate:
- C++ code
- structured circuit JSON
- interactive circuit visualizations

Built with Next.js (App Router), React, Redux, Monaco Editor, and a custom diagram rendering layer.

## Project Description

This app provides an authenticated chat experience where each prompt can produce both natural-language output and machine-usable circuit artifacts.

Key capabilities:
- User authentication (register/login)
- Chat session management (create, list, resume)
- Streaming AI responses in real time
- Side-by-side code + circuit output rendering
- Fullscreen editor/viewer for feedback and post-generation edits

## Tech Stack

### Core
- **Next.js 15** (App Router)
- **React 19**
- **Redux Toolkit + React Redux** (global auth state)
- **Axios** (API client + interceptors)

### UI & UX
- **Tailwind CSS v4**
- **Lucide React** icons
- **Sonner** toasts
- **Radix UI Avatar**

### Specialized Integration
- **Monaco Editor** (`@monaco-editor/react`) for code/json editing
- **D3** and custom viewer components for circuit layout/visualization
- **@wokwi/elements** support for hardware/circuit-oriented rendering

## Architectural Choices

- **App Router routing** (`src/app`) for page-driven structure (`/`, `/login`, `/register`, `/chat/[id]`).
- **Client-heavy interaction model** for real-time streaming chat and editor behavior.
- **Redux for auth state** to keep login state and token usage consistent across pages.
- **Custom Axios hook (`hooks/useAxios.js`)** for:
  - injecting bearer tokens on requests
  - centralized unauthorized handling/refresh flow
- **React Context layers** for UI state and “full code + diagram” modal state:
  - `contexts/useUIContext.js`
  - `contexts/useFullCodeDiagramContext.js`
- **Componentized rendering pipeline**:
  - chat and message UI (`src/components/ui/*`)
  - diagram-safe rendering (`SafeDiagramViewer`, `NewDiagramViewer`)

## Repository Structure

```text
src/
  app/                 # Next.js routes and pages
  components/          # Diagram + UI components
  lib/                 # Shared helpers
  utils/               # Utility functions
contexts/              # React context providers
hooks/                 # Custom hooks (API, canvas, D3)
redux/                 # Store and slices
public/                # Static assets
```

## Prerequisites

- Node.js 18+ (recommended: latest LTS)
- npm 9+
- Running SWAN backend service

## Environment Variables

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_BACKEND_URL_DOMAIN=http://localhost:8000
```

This variable is required for auth and chat API requests.

## Setup

```bash
# 1) Install dependencies
npm install

# 2) Add environment variables
# create .env.local manually in the project root

# 3) Start development server
npm run dev
```

Open: [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` — start local dev server (Turbopack)
- `npm run lint` — run ESLint checks
- `npm run build` — create production build
- `npm run start` — run production server

## How to Use

1. Register or log in.
2. Create a new chat from the home page.
3. Select a model mode (e.g., chained/baseline/graph) in chat input.
4. Submit prompts for circuit/code generation.
5. Review generated message output, C++ code, and JSON-based circuit diagram.
6. Open fullscreen mode to refine generated artifacts and submit feedback.

## Backend Integration Notes

The frontend expects backend endpoints such as:
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/token`
- `GET /user/all_chats`
- `GET /user/chat?id=<chatId>`
- `POST /user/new_chat?model=<type>` (streaming)
- `POST /user/chat_stream?model=<type>` (streaming)
- `PUT /user/feedback`

Ensure CORS, auth cookie/token behavior, and streaming responses are configured correctly in the backend.

## Notes

- Build may fail in restricted/offline environments if Google Fonts cannot be fetched via `next/font`.
- Lint currently reports existing warnings in chat/home pages (non-blocking).
