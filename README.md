# UrlMe — Minimal URL Shortener

This repository contains a simple URL shortener with a React frontend and Express/MongoDB backend.

This README includes deployment instructions for the recommended flow:
- Frontend: Vercel (static build from `frontend`)
- Backend: Render (Node web service from `backend`)
- Database: MongoDB Atlas

Prerequisites
- A GitHub repository with this code pushed.
- Accounts on Render and Vercel.

Environment variables
- `MONGO_URI` (backend): MongoDB connection string, e.g. `mongodb+srv://user:pass@cluster0.mongodb.net/dbname?retryWrites=true&w=majority`
- `BASE_URL` (backend): public URL for backend (set to Render service URL once deployed, e.g. `https://your-backend.onrender.com`)
- `VITE_API_URL` (frontend, optional): full backend API base URL, e.g. `https://your-backend.onrender.com`. If not set, the frontend defaults to `http://localhost:3000` for local dev.

1) MongoDB Atlas
- Create a new cluster and database user. Whitelist your IP or enable access from anywhere (for quick testing).
- Create a database and note the connection string. Set `MONGO_URI` on Render.

2) Deploy backend to Render
- Create a new Web Service on Render and connect the GitHub repo.
- In Render, set the root directory to `backend`.
- Build/Start command: leave blank or use default; ensure the `start` script in `backend/package.json` is `node app.js` (this repo contains it).
- Set environment variables on Render: `MONGO_URI`, `BASE_URL` (set to the Render service URL once assigned).
- Deploy. Render will provide the backend URL.

3) Deploy frontend to Vercel
- Create a new project on Vercel and connect the same GitHub repo.
- Set the root directory to `frontend`.
- Build command: `npm run build` (Vite). Output directory: `dist`.
- Optionally set `VITE_API_URL` to your backend URL (e.g. `https://your-backend.onrender.com`). If you do not set it, the frontend will try to use `http://localhost:3000`.
- Deploy.

Local development
- Backend
	```bash
	cd backend
	npm install
	npm run dev   # uses nodemon
	```

- Frontend
	```bash
	cd frontend
	npm install
	npm run dev
	```
	Open url-me-sigma.vercel.app in the browser.

Notes & next steps
- The app is currently public (no auth). If you want user accounts, analytics, rate-limiting, or deploy automation, I can add them.
- Consider enabling HTTPS and secure CORS settings when going to production.

If you want, I can push any final changes and create a deployment checklist specific to your GitHub repository name and Render/Vercel settings.
