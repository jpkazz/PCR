# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
```bash
# Start full development environment (frontend + backend)
npm run dev

# Start frontend only (Vite dev server)
npm run frontend:dev

# Start backend only (TypeScript with ts-node)
npm run backend:dev

# Build for production
npm run build

# Run NW.js desktop app
npm run nw

# Package desktop app for current platform
npm run package
```

### Code Quality
```bash
# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# TypeScript type checking
npm run type-check

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Format code with Prettier
npm run format

# Prepare for release (lint + type-check + test + audit)
npm run prepare-release
```

### Database Management
```bash
# Create user accounts (admin/user with default passwords)
npm run create-accounts
```

## Architecture Overview

This is a **hybrid desktop/web PCR (Patient Care Report) application** built with:
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Express.js + TypeScript + SQLite (better-sqlite3)
- **Desktop**: NW.js for native desktop packaging
- **Canvas**: Fabric.js for interactive injury diagrams

### Key Architecture Patterns

1. **Monorepo Structure**: Frontend and backend in same repository
2. **Shared Types**: Common TypeScript interfaces in `src/shared/types/`
3. **Context-Based State**: React Context for auth, forms, notifications
4. **Component Architecture**: UI components in `src/frontend/components/ui/`, composite components in `composite/`

### Directory Structure
```
src/
├── frontend/          # React frontend application
│   ├── components/    # Reusable components
│   │   ├── ui/        # Basic UI components (Button, Modal, etc.)
│   │   ├── forms/     # Form-specific components
│   │   ├── layout/    # Layout components (Header, Sidebar)
│   │   └── composite/ # Complex domain components
│   ├── context/       # React Context providers
│   ├── hooks/         # Custom React hooks
│   ├── pages/         # Page components
│   └── services/      # API communication layer
├── backend/           # Express.js backend
│   ├── src/database/  # SQLite database setup and migrations
│   ├── src/routes/    # API route handlers
│   ├── src/services/  # Business logic layer
│   └── src/middleware/# Express middleware
└── shared/            # Shared TypeScript types and utilities
```

## Development Workflow

### Form Development
- PCR form fields defined in `form_inputs.md` specification
- Form state managed via `FormContext`
- Validation handled client-side with real-time feedback
- Draft data stored in local storage with 30-second intervals

### Component Development
- Follow existing patterns in `src/frontend/components/ui/`
- Use Tailwind CSS with healthcare-themed color palette
- Implement accessibility with ARIA labels and keyboard navigation
- Components should be typed with TypeScript interfaces

### API Development
- Routes defined in `src/backend/src/routes/`
- Authentication via JWT tokens with middleware protection
- SQLite database with better-sqlite3 for performance
- Input validation using Joi schemas

## Key Features

### Canvas Injury Diagram
- Interactive body diagram using Fabric.js
- Drawing tools for marking injuries and annotations
- Canvas data serialized to JSON for database storage
- Located in `src/frontend/components/composite/InjuryCanvas.tsx`

### Authentication System
- JWT-based authentication with role-based access (admin/user)
- Session timeout with automatic logout warnings
- Protected routes with redirect handling
- Default accounts: admin/admin and user/user

### Drafts
- Cleanup service removes old submissions after 24 hours

## Testing

- **Unit Tests**: Jest with ts-jest preset
- **E2E Tests**: Playwright for end-to-end testing
- **Test Coverage**: Coverage reports generated in `/coverage`
- Tests located alongside source files with `.test.ts` or `.spec.ts` extensions

## Build & Deployment

### NW.js Desktop App
- Cross-platform desktop packaging via nw-builder
- Build configuration in `nwbuild.config.js`
- Supports Windows, macOS, and Linux distributions
- Window configuration in `package.json` under "window" key

### Production Build
1. `npm run build` - Builds both frontend and backend
2. `npm run package` - Creates desktop app package
3. `npm run release` - Full release pipeline with signing/notarization

## Database Schema

- SQLite database (`pcr_database.db`)
- Main tables: users, pcr_reports, drafts, activity_logs
- Database initialization in `src/backend/src/database/`
- Cleanup service removes old records automatically

## Environment Configuration

- `.env` file for environment variables
- Backend runs on port 3000, frontend dev server on 5173
- CORS configured for localhost development
- Production builds disable dev-specific security policies
