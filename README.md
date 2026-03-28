# Attendance Management System

## Phase 1: Backend & API Design

```text
backend/
  app/
    auth/
    core/
    models/
    routers/
    schemas/
    services/
    main.py
  tests/
  requirements.txt
frontend/
  src/
    components/
    contexts/
    hooks/
    pages/
    services/
    store/
    styles/
    test/
    types/
  package.json
  tailwind.config.js
```

The backend is built with FastAPI, SQLAlchemy ORM, JWT access/refresh tokens, structured JSON error responses, role-aware authorization, attendance bulk upsert logic, and a DB-aware `/health` check.

## Phase 2: CSS, Tailwind & Theme

The frontend uses Tailwind CSS for layout and utility spacing, while `frontend/src/styles/glass-neumorphic.module.css` contains reusable glass and neumorphic primitives:

- `cardGlass`
- `heroGlass`
- `btnNeumorphic`
- `inputGlass`
- `slotButton`
- `slotPending`
- `slotPresent`
- `slotAbsent`
- `skeletonShimmer`

## Phase 3: Frontend

The React frontend uses Vite, Zustand, an `AuthProvider`, protected routing, student/faculty dashboards, optimistic attendance updates, shimmer skeletons, and colocated component tests for critical flows.
