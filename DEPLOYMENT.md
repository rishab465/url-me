# Deployment Guide for URL-Me

## Quick Fix Checklist

### Backend (Render)
1. **Environment Variables** - Set these in Render dashboard:
   ```
   PORT=5050
   ALLOWED_ORIGINS=https://your-actual-frontend.vercel.app
   JWT_SECRET=your-random-secret-key-here
   BASE_URL=https://your-backend.onrender.com
   ```

2. **Root Directory**: `backend`

3. **Build Command**: (leave blank or use default)

4. **Start Command**: `npm start`

### Frontend (Vercel)
1. **Environment Variables** - Set in Vercel dashboard:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```

2. **Root Directory**: `frontend`

3. **Build Command**: `npm run build`

4. **Output Directory**: `dist`

5. **Install Command**: `npm install`

## Step-by-Step Deployment

### 1. Deploy Backend to Render

1. Go to [render.com](https://render.com) and create a new **Web Service**
2. Connect your GitHub repo: `rishab465/url-me`
3. Configure the service:
   - **Name**: `url-me-backend` (or your choice)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: (leave blank)
   - **Start Command**: `npm start`
4. Add environment variables (click "Advanced" → "Add Environment Variable"):
   ```
   PORT = 5050
   ALLOWED_ORIGINS = (leave blank for now, will update after frontend deployment)
   JWT_SECRET = (generate a random string, e.g., use: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
   BASE_URL = (will be filled automatically as https://your-service-name.onrender.com)
   ```
5. Click **Create Web Service**
6. Wait for deployment to complete
7. **Copy the backend URL** (e.g., `https://url-me-backend.onrender.com`)

### 2. Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and create a new **Project**
2. Import your GitHub repo: `rishab465/url-me`
3. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add environment variable:
   - Click "Environment Variables"
   - Add: `VITE_API_URL` = `https://your-backend-url.onrender.com` (from step 1)
5. Click **Deploy**
6. Wait for deployment to complete
7. **Copy the frontend URL** (e.g., `https://url-me.vercel.app`)

### 3. Update Backend CORS Settings

1. Go back to Render dashboard
2. Go to your backend service → **Environment**
3. Update the `ALLOWED_ORIGINS` variable:
   ```
   ALLOWED_ORIGINS = https://your-frontend-url.vercel.app,http://localhost:5173
   ```
   (Use the actual Vercel URL from step 2)
4. Click **Save Changes**
5. The backend will automatically redeploy

### 4. Test Your Deployment

1. Visit your frontend URL (from step 2)
2. Try creating a short URL
3. Check browser console for errors
4. Check Render logs if backend issues occur

## Common Issues & Solutions

### Issue: "CORS blocked"
**Solution**: Make sure `ALLOWED_ORIGINS` in Render matches your exact Vercel URL (including https://)

### Issue: "Network Error" or "Failed to fetch"
**Solution**: 
- Check `VITE_API_URL` in Vercel is correct
- Verify backend is running on Render (check logs)
- Ensure backend URL doesn't have trailing slash

### Issue: Backend crashes on startup
**Solution**: 
- Check Render logs for specific error
- Ensure all dependencies are in `package.json`
- Verify `PORT` environment variable is set

### Issue: "Cannot GET /api/urls"
**Solution**: The backend router might not be properly configured. Check that routes are correctly imported.

### Issue: Vercel preview deployments fail CORS
**Solution**: Add Vercel preview URL pattern to `ALLOWED_ORIGINS`:
```
ALLOWED_ORIGINS=https://url-me.vercel.app,https://url-me-*.vercel.app,http://localhost:5173
```

## Local Development

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Make sure you have a `.env` file in the root with:
```
PORT=5050
ALLOWED_ORIGINS=http://localhost:5173
JWT_SECRET=local-dev-secret
BASE_URL=http://localhost:5050
```

## Notes

- **First deployment** on Render can take 5-10 minutes
- **Free tier** on Render spins down after inactivity (first request may be slow)
- **Environment variables** changes trigger automatic redeployment
- Check **Render logs** for backend errors
- Check **browser console** for frontend errors
