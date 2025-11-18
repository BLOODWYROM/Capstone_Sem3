# Auth App - Login & Signup

Full-stack authentication app with React, Tailwind CSS, Prisma ORM, and Neon PostgreSQL.

## Setup

### Backend

1. Navigate to backend folder:
```bash
cd backend
npm install
```

2. Create `.env` file with your Neon database URL:
```
DATABASE_URL="your-neon-postgres-url"
JWT_SECRET="your-secret-key"
PORT=5000
```

3. Run Prisma migrations:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

4. Start backend server:
```bash
npm run dev
```

### Frontend

1. Navigate to frontend folder:
```bash
cd frontend
npm install
```

2. Start development server:
```bash
npm run dev
```

## Usage

- Frontend runs on `http://localhost:5173`
- Backend runs on `http://localhost:5000`
- Visit `/signup` to create an account
- Visit `/login` to sign in
- After login, you'll be redirected to the dashboard

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, TypeScript
- **Database**: Neon PostgreSQL with Prisma ORM
- **Auth**: JWT tokens, bcrypt password hashing
