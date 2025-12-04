# ⚡ Quick Deploy Reference

## 🗄️ Step 1: Neon Database (2 min)
1. Go to https://neon.tech/
2. Create project → Copy connection string
3. Save for later ✅

## 🔧 Step 2: Render Backend (5 min)
1. Go to https://dashboard.render.com/
2. New + → Web Service → Connect GitHub repo
3. **Settings:**
   - Root Directory: `backend`
   - Build: `npm install && npx prisma generate && npm run build && npx prisma migrate deploy`
   - Start: `npm start`
4. **Environment Variables:**
   ```
   DATABASE_URL = <your-neon-connection-string>
   JWT_SECRET = <random-string-32-chars>
   NODE_ENV = production
   ```
5. Deploy → Copy backend URL ✅

## 🎨 Step 3: Vercel Frontend (3 min)
1. Go to https://vercel.com/dashboard
2. New Project → Import GitHub repo
3. **Settings:**
   - Root Directory: `frontend`
   - Framework: Vite
4. **Environment Variable:**
   ```
   VITE_API_URL = <your-render-backend-url>
   ```
5. Deploy → Done! ✅

## 🧪 Test
1. Open Vercel URL
2. Signup → Create activity → Check dashboard
3. Success! 🎉

---

## 📋 Environment Variables Cheat Sheet

### Render (Backend)
```env
DATABASE_URL=postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
NODE_ENV=production
```

### Vercel (Frontend)
```env
VITE_API_URL=https://greentrack-backend.onrender.com
```

---

## 🔑 Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## ⚠️ Common Issues

| Issue | Solution |
|-------|----------|
| Backend 500 error | Check Render logs, verify DATABASE_URL |
| Frontend can't connect | Check VITE_API_URL in Vercel settings |
| Build fails | Check build logs, verify all env vars set |
| Slow first request | Render free tier sleeps - normal behavior |

---

## 🔄 Redeploy

**Backend:** Push to GitHub or click "Manual Deploy" in Render
**Frontend:** Push to GitHub or click "Redeploy" in Vercel

---

**Need detailed help?** See `DEPLOYMENT_GUIDE.md`
