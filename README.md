# 🌱 GreenTrack - Personal Carbon Footprint Tracker

A comprehensive full-stack web application that helps users track, analyze, and reduce their carbon footprint by monitoring emissions from daily activities across travel, food, and energy consumption.

![License](https://img.shields.io/badge/license-MIT-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![React](https://img.shields.io/badge/React-18.0-61dafb)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Usage Guide](#-usage-guide)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🔐 Authentication & User Management
- Secure user registration and login with JWT authentication
- Password hashing with bcrypt
- Profile management (update name, email, change password)
- Session management with 7-day token expiration

### 📊 Dashboard
- Real-time carbon footprint statistics
- Total CO₂ emissions tracking
- Monthly emissions comparison
- Category breakdown (Travel, Food, Energy)
- Environmental impact calculations:
  - Trees needed to offset emissions
  - Driving distance equivalent
  - Energy consumption equivalent
- Recent activities feed
- Monthly goal tracker with progress visualization

### 🎯 Activity Management
- **CRUD Operations**: Create, read, update, and delete activities
- **Quick Templates**: Pre-filled templates for common activities:
  - 🚗 Car Commute
  - ✈️ Flight
  - 🍖 Beef Meal
  - 💡 Home Electricity
- **Advanced Filtering**:
  - Search by name or description
  - Filter by type (travel, food, energy)
  - Date range filtering
  - Sort by date, CO₂, or name
  - Pagination (10 items per page)
- **CSV Export**: Download activity data for external analysis

### 📈 Analytics & Reports
- Monthly trend visualization with interactive bar charts
- Category-wise emissions breakdown
- **Global Benchmarking**: Compare against worldwide averages
- Performance ratings (Excellent, Good, Average, High, Very High)
- Best/Worst month analysis
- Top 5 highest emission activities
- Year-over-year comparison
- Detailed insights and recommendations

### ⚙️ Settings & Preferences
- Customizable monthly CO₂ reduction goals
- Email notification preferences
- Weekly report settings
- Account management

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Fetch API
- **State Management**: React Hooks (useState, useEffect)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Environment**: dotenv

### DevOps & Deployment
- **Version Control**: Git
- **Deployment**: Render (Backend), Vercel (Frontend)
- **Database Hosting**: Neon PostgreSQL

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **PostgreSQL** database (or Neon account) - [Neon](https://neon.tech/)
- **Git** - [Download](https://git-scm.com/)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/greentrack.git
cd greentrack
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## 🔑 Environment Variables

### Backend Configuration

Create a `.env` file in the `backend` directory:

```env
# Database
DATABASE_URL="postgresql://username:password@host:5432/database?sslmode=require"

# JWT Secret (use a strong random string)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Server Port
PORT=5000

# Node Environment
NODE_ENV=development
```

**Note**: You can use the `.env.example` file as a template:

```bash
cd backend
cp .env.example .env
# Then edit .env with your actual values
```

### Frontend Configuration

Create or update `frontend/src/config.ts`:

```typescript
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9000';
```

For production, create `.env` in the `frontend` directory:

```env
VITE_API_URL=https://your-backend-url.com
```

## 🗄️ Database Setup

### 1. Set Up Neon PostgreSQL (Recommended)

1. Sign up at [Neon](https://neon.tech/)
2. Create a new project
3. Copy the connection string
4. Add it to your `backend/.env` file as `DATABASE_URL`

### 2. Run Prisma Migrations

```bash
cd backend

# Generate Prisma Client
npx prisma generate

# Run migrations to create database tables
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view your database
npx prisma studio
```

### 3. Database Schema

The application uses two main models:

- **User**: Stores user authentication and profile data
- **Activity**: Stores carbon emission activities with relationships to users

## 🏃 Running the Application

### Development Mode

#### Start Backend Server

```bash
cd backend
npm run dev
```

Backend will run on `http://localhost:9000`

#### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:5173`

### Production Build

#### Build Frontend

```bash
cd frontend
npm run build
```

#### Build Backend

```bash
cd backend
npm run build
npm start
```

## 📁 Project Structure

```
greentrack/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema
│   │   └── migrations/            # Database migrations
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.ts           # Authentication routes
│   │   │   └── activities.ts     # Activity CRUD routes
│   │   └── index.ts              # Express app entry point
│   ├── .env                       # Environment variables
│   ├── .env.example              # Environment template
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.tsx         # Login page
│   │   │   ├── Signup.tsx        # Registration page
│   │   │   ├── Dashboard.tsx     # Main dashboard
│   │   │   ├── Activities.tsx    # Activity management
│   │   │   ├── Analytics.tsx     # Analytics & reports
│   │   │   └── Profile.tsx       # User profile & settings
│   │   ├── App.tsx               # Main app component
│   │   ├── main.tsx              # React entry point
│   │   ├── config.ts             # API configuration
│   │   └── index.css             # Global styles
│   ├── public/
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── vercel.json               # Vercel deployment config
│
├── README.md
└── render.yaml                    # Render deployment config
```

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |

### Activities

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/activities` | Get all activities (with filters) | Yes |
| GET | `/api/activities/:id` | Get single activity | Yes |
| POST | `/api/activities` | Create new activity | Yes |
| PUT | `/api/activities/:id` | Update activity | Yes |
| DELETE | `/api/activities/:id` | Delete activity | Yes |

### Query Parameters for GET `/api/activities`

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `sortBy` - Sort field: date, carbonCO2, name (default: date)
- `sortOrder` - asc or desc (default: desc)
- `search` - Search in name/description
- `type` - Filter by type: travel, food, energy
- `startDate` - Filter from date (ISO format)
- `endDate` - Filter to date (ISO format)

## 📖 Usage Guide

### 1. Create an Account

1. Navigate to `http://localhost:5173/signup`
2. Fill in your name, email, and password
3. Click "Create Account"

### 2. Track Your First Activity

1. Go to the Activities page
2. Click "Add New Activity" or use a quick template
3. Fill in the details:
   - Type (Travel, Food, or Energy)
   - Name and description
   - Amount and unit
   - CO₂ emissions in kg
   - Date
4. Click "Create"

### 3. View Your Dashboard

- See your total emissions
- Check monthly trends
- View category breakdown
- Track your progress toward goals

### 4. Analyze Your Impact

1. Go to the Analytics page
2. View monthly trends
3. Compare against global benchmarks
4. Identify your highest emission activities
5. Get performance ratings

### 5. Export Your Data

1. Go to Activities page
2. Apply any filters you want
3. Click "Export to CSV"
4. Open in Excel or Google Sheets

## 🎨 Screenshots

### Dashboard
![Dashboard](https://via.placeholder.com/800x400?text=Dashboard+Screenshot)

### Activities Management
![Activities](https://via.placeholder.com/800x400?text=Activities+Screenshot)

### Analytics
![Analytics](https://via.placeholder.com/800x400?text=Analytics+Screenshot)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Carbon emission benchmarks based on global averages
- Icons and emojis for enhanced user experience
- Inspired by the need for personal environmental accountability

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Made with 💚 for a greener planet**
