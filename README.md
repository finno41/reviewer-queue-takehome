# Reviewer Queue Takehome

Small local full-stack app for a reviewer workflow exercise.

## Stack

- Frontend: React + TypeScript + Tailwind via Vite
- Backend: Express + TypeScript
- Database: SQLite

## Local setup

From the project root:

```bash
cd "{INSERT_YOUR_DIRECTORY}/reviewer-queue-takehome"
nvm use
```

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

## Run

Terminal 1:

```bash
cd "{INSERT_YOUR_DIRECTORY}/reviewer-queue-takehome"
nvm use
cd backend
npm run db:reset
npm run dev
```

Terminal 2:

```bash
cd "{INSERT_YOUR_DIRECTORY}/reviewer-queue-takehome"
nvm use
cd frontend
npm run dev
```

## What `db:reset` does

`npm run db:reset` clears the SQLite database and reseeds it with the review items used by the app.

## Local URLs

- Frontend: `http://localhost:5173`
- Backend queue: `http://localhost:3001/api/review-items`
- Backend detail example: `http://localhost:3001/api/review-items/RV-1024`
