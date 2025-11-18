# Deployment Guide

## Backend Deployment on Render

### Prerequisites
- GitHub repository connected to Render
- Neon PostgreSQL database

### Steps:

1. **Go to Render Dashboard** (https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure the Web Service:**
   - **Name:** capstone-backend
   - **Region:** Oregon (US West)
   - **Branch:** main
   - **Root Directory:** backend
   - **Runtime:** Node
   - **Build Command:** `npm install && npm run build && npx prisma migrate deploy`
   - **Start Command:** `npm start`

3. **Add Environment Variables:**
   - `DATABASE_URL` = Your Neon PostgreSQL connection string
   - `JWT_SECRET` = A secure random string (generate one)
   - `NODE_ENV` = production
   - `PORT` = 10000 (Render default, or leave empty)

4. **Deploy:**
   - Click "Create Web Service"
   - Wait for the build to complete

5. **Get Your Backend URL:**
   - After deployment, you'll get a URL like: `https://capstone-backend.onrender.com`
   - Update your frontend to use this URL instead of `http://localhost:9000`

### Important Notes:
- Free tier on Render spins down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- Your Neon database connection string should include `?sslmode=require`

### Generate a Secure JWT Secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Frontend Deployment (Optional - Vercel/Netlify)

Update the API URL in your frontend before deploying:
- Change `http://localhost:9000` to your Render backend URL
- Deploy to Vercel or Netlify
