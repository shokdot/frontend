# Frontend

> Part of the [ft_transcendence](https://github.com/shokdot/ft_transcendence) project.

Next.js 15 single-page application for ft_transcendence. Connects to all backend microservices (auth, user, chat, game, room, notification, stats).

## Tech Stack

- **Framework**: Next.js 15 + React 19 + TypeScript
- **Styling**: Tailwind CSS 4
- **Linting**: ESLint (eslint-config-next)

## Quick Start

```bash
npm install
npm run dev
```

Dev server runs at `http://localhost:3010` by default.

### Build

```bash
npm run build
npm start
```

### Docker

Built from monorepo root; see project `Dockerfile` and `docker-compose*.yml`.

## Backend Services

The frontend communicates with the following services (via Nginx reverse proxy in production):

| Service               | Default Port | Base Path              |
|-----------------------|--------------|------------------------|
| Auth Service          | 3000         | `/api/v1/auth`         |
| User Service          | 3001         | `/api/v1/users`        |
| Notification Service  | 3002         | `/api/v1/notifications`|
| Game Service          | 3003         | `/api/v1/games`        |
| Room Service          | 3004         | `/api/v1/rooms`        |
| Stats Service         | 3005         | `/api/v1/stats`        |
| Chat Service          | 3006         | `/api/v1/chat`         |

WebSocket connections:

| Purpose       | URL                                       | Auth               |
|---------------|-------------------------------------------|--------------------|
| Chat          | `ws://.../api/v1/chat/ws`                 | Bearer token       |
| Game          | `ws://.../api/v1/games/ws/:roomId`        | Bearer token       |
| Notifications | `ws://.../api/v1/notifications/ws`        | Bearer or `?token=`|
| Presence      | `ws://.../api/v1/notifications/status/ws` | Bearer or `?token=`|
