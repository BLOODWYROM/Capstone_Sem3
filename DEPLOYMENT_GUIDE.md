# 🚀 Complete Deployment Guide - GreenTrack

## Prerequisites
- GitHub account with your code pushed
- Neon PostgreSQL account (free tier)
- Render account (free tier)
- Vercel account (free tier)

---

## Step 1: Setup Neon Database (5 minutes)

### 1.1 Create Database
1. Go to [Neon.tech](https://neon.tech/)
2. Sign in or create account
3. Click **"Create Project"**
4. Name: `greentrack-db`
5. Region: Choose closest to you
6. Click **"Create Project"**

### 1.2 Get Connection String
1. After project creation, you'll see the connection string
2. Copy the **Connection String** (looks like):
   ```
   postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```
3. **Save this** - you'll need it for Render!

### 1.3 Initialize Database (Optional - Render will do this)
You can test the connection locally:
```bash
cd backend
# Add DATABASE_URL to .env
npx prisma migrate deploy
```

---

## Step 2: Deploy Backend on Render (10 minutes)

### 2.1 Create New Web Service
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account if not connected
4. Select repository: `BLOODWYROM/Capstone_Sem3`
5. Click **"Connect"**

### 2.2 Configure Service
Fill in these settings:

| Field | Value |
|-------|-------|
| **Name** | `greentrack-backend` (or any name) |
| **Region** | Oregon (US West) or closest to you |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npx prisma generate && npm run build && npx prisma migrate deploy` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

### 2.3 Add Environment Variables
Click **"Advanced"** → **"Add Environment Variable"**

Add these 3 variables:

1. **DATABASE_URL**
   - Value: `postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`
   - (Paste your Neon connection string from Step 1.2)

2. **JWT_SECRET**
   - Value: Generate a random string (use this command or any random generator):
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   - Example: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6`

3. **NODE_ENV**
   - Value: `production`

### 2.4 Deploy
1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Watch the logs for any errors
4. Once deployed, you'll get a URL like: `https://greentrack-backend.onrender.com`
5. **Copy this URL** - you'll need it for Vercel!

### 2.5 Test Backend
Open in browser: `https://your-backend-url.onrender.com/api/auth/login`

You should see: `Cannot GET /api/auth/login` (this is normal - it needs POST request)

---

## Step 3: Deploy Frontend on Vercel (5 minutes)

### 3.1 Create New Project
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository: `BLOODWYROM/Capstone_Sem3`
4. Click **"Import"**

### 3.2 Configure Project
Fill in these settings:

| Field | Value |
|-------|-------|
| **Framework Preset** | `Vite` (should auto-detect) |
| **Root Directory** | `frontend` (click Edit and select) |
| **Build Command** | `npm run build` (default) |
| **Output Directory** | `dist` (default) |
| **Install Command** | `npm install` (default) |

### 3.3 Add Environment Variable
Click **"Environment Variables"**

Add this variable:

- **Key**: `VITE_API_URL`
- **Value**: `https://your-backend-url.onrender.com` (from Step 2.4)
- **Environment**: Select all (Production, Preview, Development)

### 3.4 Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Once deployed, you'll get a URL like: `https://greentrack-xyz.vercel.app`
4. Click **"Visit"** to open your app!

---

## Step 4: Test Your Application

### 4.1 Test Signup
1. Go to your Vercel URL: `https://your-app.vercel.app`
2. Click **"Create Account"**
3. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
4. Click **"Create Account"**
5. You should be redirected to Dashboard

### 4.2 Test Features
- ✅ Dashboard loads with stats
- ✅ Add a new activity
- ✅ View activities list
- ✅ Check analytics page
- ✅ Update profile
- ✅ Logout and login again

---

## Step 5: Update Frontend Config (If Needed)

If you need to change the backend URL later:

### Option A: Update in Vercel Dashboard
1. Go to Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Edit `VITE_API_URL`
4. Redeploy from Deployments tab

### Option B: Update in Code
1. Edit `frontend/src/config.ts`:
```typescript
export const API_URL = import.meta.env.VITE_API_URL || 'https://your-backend-url.onrender.com';
```
2. Commit and push to GitHub
3. Vercel will auto-deploy

---

## Troubleshooting

### Backend Issues

**Problem**: Build fails on Render
- Check logs in Render dashboard
- Ensure `DATABASE_URL` is set correctly
- Verify Prisma migrations are running

**Problem**: 500 Internal Server Error
- Check Render logs
- Verify all environment variables are set
- Check database connection

**Problem**: CORS errors
- Backend already has CORS enabled
- Check if frontend URL is correct

### Frontend Issues

**Problem**: Can't connect to backend
- Verify `VITE_API_URL` is set in Vercel
- Check backend URL is correct (with https://)
- Test backend URL directly in browser

**Problem**: Build fails
- Check build logs in Vercel
- Verify TypeScript has no errors
- Check all dependencies are installed

**Problem**: 404 on refresh
- Already fixed with `vercel.json` rewrites
- If still happening, check vercel.json exists in frontend folder

### Database Issues

**Problem**: Prisma migration fails
- Check DATABASE_URL format
- Ensure `?sslmode=require` is at the end
- Verify Neon database is active

**Problem**: Connection timeout
- Neon free tier may sleep after inactivity
- First request might be slow (cold start)
- Subsequent requests will be faster

---

## Important Notes

### Free Tier Limitations

**Render Free Tier:**
- ⚠️ Service sleeps after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- 750 hours/month (enough for one service)

**Vercel Free Tier:**
- ✅ No sleep time
- 100 GB bandwidth/month
- Unlimited deployments

**Neon Free Tier:**
- ✅ 0.5 GB storage
- ⚠️ May sleep after inactivity
- 1 project, 10 branches

### Keep Backend Awake (Optional)

To prevent Render from sleeping, use a service like:
- [UptimeRobot](https://uptimerobot.com/) - Free, pings your backend every 5 minutes
- [Cron-job.org](https://cron-job.org/) - Free scheduled requests

Setup:
1. Create account
2. Add monitor: `https://your-backend-url.onrender.com/api/auth/login`
3. Set interval: 5 minutes

---

## Custom Domain (Optional)

### Add Custom Domain to Vercel
1. Go to Vercel Dashboard → Your Project
2. Settings → Domains
3. Add your domain
4. Follow DNS configuration instructions

### Add Custom Domain to Render
1. Go to Render Dashboard → Your Service
2. Settings → Custom Domain
3. Add your domain
4. Update DNS records

---

## Monitoring & Logs

### View Backend Logs
1. Render Dashboard → Your Service
2. Click **"Logs"** tab
3. See real-time logs

### View Frontend Logs
1. Vercel Dashboard → Your Project
2. Click on a deployment
3. Click **"Functions"** or **"Build Logs"**

### View Database
1. Neon Dashboard → Your Project
2. Click **"Tables"** to browse data
3. Or use Prisma Studio locally:
```bash
cd backend
npx prisma studio
```

---

## Redeployment

### Redeploy Backend (Render)
1. Go to Render Dashboard → Your Service
2. Click **"Manual Deploy"** → **"Deploy latest commit"**
3. Or push to GitHub (auto-deploys)

### Redeploy Frontend (Vercel)
1. Go to Vercel Dashboard → Your Project
2. Deployments tab → Click **"Redeploy"**
3. Or push to GitHub (auto-deploys)

---

## Environment Variables Summary

### Backend (Render)
```env
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
JWT_SECRET=your-random-secret-key-here
NODE_ENV=production
```

### Frontend (Vercel)
```env
VITE_API_URL=https://your-backend-url.onrender.com
```

---

## Success Checklist

- [ ] Neon database created and connection string copied
- [ ] Backend deployed on Render
- [ ] Backend environment variables set
- [ ] Backend URL copied
- [ ] Frontend deployed on Vercel
- [ ] Frontend environment variable set with backend URL
- [ ] Can signup and login
- [ ] Can create activities
- [ ] Dashboard shows data
- [ ] Analytics page works
- [ ] Profile update works

---

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review deployment logs
3. Verify all environment variables
4. Test backend URL directly
5. Check browser console for errors

---

**🎉 Congratulations! Your GreenTrack app is now live!**

Share your URLs:
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-backend.onrender.com`
