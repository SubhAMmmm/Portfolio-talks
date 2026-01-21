# GenAI Engineer Portfolio

## Overview

A premium, futuristic 3D interactive portfolio website for a GenAI Engineer specializing in RAG systems, LLMs, cloud deployment, and full-stack development. The site features a dark mode aesthetic with neon cyan, electric blue, and purple accents, glassmorphism panels, and an interactive 3D robot that follows cursor movement.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with custom dark theme configuration and CSS variables for theming
- **UI Components**: shadcn/ui component library (New York style) built on Radix UI primitives
- **3D Graphics**: Three.js with React Three Fiber and Drei helpers for the interactive robot scene
- **Animations**: Framer Motion for smooth page transitions and micro-interactions
- **State Management**: TanStack Query (React Query) for server state management
- **Forms**: React Hook Form with Zod validation via @hookform/resolvers

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript compiled with tsx for development, esbuild for production
- **API Design**: RESTful endpoints defined in shared/routes.ts with Zod schemas for type-safe request/response validation
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Build Process**: Custom build script that bundles server dependencies to reduce cold start times

### Data Storage
- **Database**: PostgreSQL (connection via DATABASE_URL environment variable)
- **Schema**: Drizzle schema definitions in shared/schema.ts
- **Migrations**: Drizzle Kit for database migrations stored in /migrations folder
- **Current Tables**: Messages table for contact form submissions

### Project Structure
```
├── client/           # Frontend React application
│   ├── src/
│   │   ├── components/   # React components including 3D scene
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions
│   │   └── pages/        # Page components
├── server/           # Express backend
│   ├── db.ts            # Database connection
│   ├── routes.ts        # API route handlers
│   └── storage.ts       # Database operations
├── shared/           # Shared types and schemas
│   ├── routes.ts        # API route definitions with Zod schemas
│   └── schema.ts        # Drizzle database schema
```

### Key Design Patterns
- **Type-safe API contracts**: Shared Zod schemas between frontend and backend ensure runtime validation and TypeScript type inference
- **Component composition**: shadcn/ui components provide accessible, customizable UI primitives
- **Environment-based configuration**: Development uses Vite dev server with HMR; production serves static build

## External Dependencies

### Database
- PostgreSQL database accessed via `DATABASE_URL` environment variable
- Drizzle ORM for type-safe database operations
- connect-pg-simple for session storage support

### Third-Party Libraries
- **@react-three/fiber** & **@react-three/drei**: React wrapper and helpers for Three.js 3D rendering
- **framer-motion**: Animation library for React
- **@tanstack/react-query**: Async state management
- **zod**: Runtime type validation
- **Radix UI**: Accessible component primitives (dialogs, dropdowns, tooltips, etc.)

### Build Tools
- **Vite**: Frontend development server and bundler
- **esbuild**: Fast server-side bundling for production
- **tsx**: TypeScript execution for development
- **drizzle-kit**: Database migration tooling

### Replit-Specific Integrations
- **@replit/vite-plugin-runtime-error-modal**: Error overlay for development
- **@replit/vite-plugin-cartographer**: Development tooling (dev only)
- **@replit/vite-plugin-dev-banner**: Development banner (dev only)