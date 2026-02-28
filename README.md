# OpsPilot — Operations Platform Frontend

A modern, role-based operations management UI built with React and Tailwind CSS. Designed for streamlined work item tracking, operator assignment, and real-time status updates.

---

## Overview

OpsPilot provides three role-specific dashboards behind JWT authentication:

| Role | Dashboard | Capabilities |
|------|-----------|-------------|
| **Admin** | `/admin` | View metrics, manage all work items, assign operators, load demo data |
| **Operator** | `/operator` | View assigned tasks, update status (Start / Complete / Reject) |
| **Viewer** | `/viewer` | Read-only overview of all work items |

## Key UX Features

- **Inline updates** — Status changes and operator assignments update the row in-place without full page reloads.
- **Per-row loading spinners** — Inline spinners appear on the control being acted on, keeping the rest of the UI interactive.
- **Status badges with icons** — Color-coded badges (gray/blue/green/red) with contextual icons for OPEN, IN_PROGRESS, COMPLETED, and REJECTED.
- **Smart assignment dropdown** — Shows the currently assigned operator as selected and disabled with a "(Currently Assigned)" label; prevents redundant API calls.
- **Toast notifications** — Success/error toasts for actions like demo data loading.
- **Empty states** — Intentional empty-state illustrations with helpful messages so the UI never looks broken with no data.
- **Fade-in transitions** — Subtle page-enter animations for a polished feel.
- **Full-screen overlay spinner** — Shown during login and initial auth verification.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 (Create React App) |
| Styling | Tailwind CSS 3.4 + @tailwindcss/forms |
| HTTP | Axios with JWT interceptors |
| Routing | React Router 7 |
| Icons | Lucide React |

## Project Structure

```
src/
├── api/              # Axios instance, endpoint functions
├── components/       # Layout, ProtectedRoute, LoadingSpinner, StatusBadge, Toast
├── context/          # AuthContext (JWT + role state)
├── contracts/        # API request builders & response parsers
├── pages/            # LoginPage, AdminDashboard, OperatorDashboard, ViewerDashboard
├── App.js            # Router + providers
└── index.js          # Entry point
```

## Backend Integration

The frontend expects a Spring Boot backend running at `http://localhost:8080` with these endpoints:

| Method | Endpoint | Used by |
|--------|----------|---------|
| POST | `/api/auth/login` | Login |
| GET | `/api/admin/dashboard` | Admin metrics |
| GET | `/api/admin/employees/operators` | Operator list |
| GET | `/api/admin/workitems` | Admin work item table |
| PUT | `/api/admin/workitems/:id/assign` | Assign operator |
| POST | `/api/admin/demo-data` | Seed demo data |
| GET | `/api/workitems/my/paginated` | Operator & Viewer items |
| PUT | `/api/workitems/:id/status` | Status update |

A centralized **contract layer** (`src/contracts/`) defines all request shapes and response parsers so the UI stays in sync with the API.

## Getting Started

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm start

# Production build
npm run build
```

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@opspilot.com` | `admin123` |
| Operator | `operator@opspilot.com` | `operator123` |
| Viewer | `viewer@opspilot.com` | `viewer123` |

> Use the **Load Demo Data** button on the Admin Dashboard to seed sample work items.

---

**OpsPilot** &copy; 2026
