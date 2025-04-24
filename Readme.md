# Express Auth & Ticketing API

A Node.js REST API built with Express and TypeScript for user authentication and ticket management.

## Features

- User registration, login, logout, and profile
- JWT-based authentication with HTTP-only cookies
- Ticket creation, retrieval (single/all)
- PostgreSQL database integration
- TypeScript strict typing

## Project Structure

```
.env
.gitignore
package.json
tsconfig.json
src/
  app.ts
  server.ts
  config/
    config.ts
    db.ts
  controllers/
    ticket.controller.ts
    user.controller.ts
  middlewares/
    auth.middleware.ts
  models/
    ticket.model.ts
    user.model.ts
  routes/
    ticket.routes.ts
    user.routes.ts
  types/
    ticket.ts
    user.ts
```

## Getting Started

### 1. Install dependencies

```sh
npm install
```

### 2. Set up environment variables

Create a `.env` file with:

```
PORT=3000
DB_URL=your_postgres_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### 3. Build and run

```sh
npm run build
npm start
```

For development with hot reload:

```sh
npm run dev
```

### 4. Database Setup

The project uses PostgreSQL. You do **not** need to manually create tables.  
Instead, after starting the server, run the `/setup` endpoint to automatically create the required tables (`users` and `tickets`):

```sh
curl -X POST http://localhost:3000/setup
```

- This will create both the `users` and `tickets` tables if they do not exist.
- The `tickets` table has foreign keys referencing the `users` table.
- You can inspect the table creation logic in [`src/app.ts`](src/app.ts).

> **Note:** Make sure your PostgreSQL server is running and the database specified in `DB_URL` exists.

## API Endpoints

### User Routes

- `POST /user/register`  
  Register a new user.  
  **Body:** `{ name, email, password }`

- `POST /user/login`  
  Login user.  
  **Body:** `{ email, password }`  
  **Response:** Sets HTTP-only cookie `token`.

- `GET /user/logout`  
  Logout user (clears cookie).

- `GET /user/profile`  
  Get current user profile.  
  **Requires:** Auth cookie

### Ticket Routes

> All ticket routes require authentication.

- `POST /ticket/generate-ticket`  
  Create a new ticket.  
  **Body:** `{ title, description, status, reporter_id, assignee_id }`

- `GET /ticket/find-ticket/:ticketId`  
  Get a ticket by ID.

- `GET /ticket/get-all-tickets`  
  Get all tickets.

## Type Definitions

See [src/types/user.ts](src/types/user.ts) and [src/types/ticket.ts](src/types/ticket.ts) for full interfaces.

## Main Files

- App entry: [src/server.ts](src/server.ts)
- Express app: [src/app.ts](src/app.ts)
- User logic: [src/controllers/user.controller.ts](src/controllers/user.controller.ts)
- Ticket logic: [src/controllers/ticket.controller.ts](src/controllers/ticket.controller.ts)
- Auth middleware: [src/middlewares/auth.middleware.ts](src/middlewares/auth.middleware.ts)
