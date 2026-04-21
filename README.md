# Empty Full-Stack Scaffold

This project is intentionally stripped back to the minimum:

- a Vite + React frontend
- an Express backend
- a single frontend page that shows `Hello world`
- a single backend route at `GET /api/hello`

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

## Local URLs

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001/api/hello`
