# OpsPilot Frontend

Dashboard interface for managing internal task workflows. Built with React and Tailwind CSS.

---

## UI Overview

OpsPilot provides a clean, responsive dashboard for creating, assigning, and tracking operational tasks across teams. Users log in with role-based credentials and are routed to a view tailored to their responsibilities.

## Role-Based Views

- **Admin** — Assignment dashboard for managing all work items, viewing platform metrics, and assigning tasks to operators.
- **Operator** — Execution panel for viewing assigned tasks and updating their status (Start, Complete, or Reject).
- **Viewer** — Read-only insights into all work items and their current statuses.

## UX Features

- **Smooth task updates** — Status changes and operator assignments reflect inline without full page reloads.
- **Role-based access** — JWT authentication with automatic routing per role; unauthorized paths are blocked.
- **Real-time status visibility** — Color-coded status badges with icons (Open, In Progress, Completed, Rejected) update instantly on action.
- **Toast notifications** — Contextual success/error feedback for user actions.
- **Empty states** — Informative placeholders when no data is available so the UI always feels intentional.

## Tech Stack

- **React** — Component-based UI framework
- **Tailwind CSS** — Utility-first styling
- **Axios** — HTTP client with JWT interceptors

## Backend Integration

Connects with the [OpsPilot Backend API](https://github.com/ayu2202/opspilot-backend) running on `http://localhost:8080`. A centralized contract layer keeps request/response shapes in sync with the API.

## Getting Started

```bash
npm install
npm start
```

The app runs at [http://localhost:3000](http://localhost:3000).

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin1@opspilot.com` | `Password123` |

> Use the **Load Demo Data** button on the Admin Dashboard to seed sample work items.
