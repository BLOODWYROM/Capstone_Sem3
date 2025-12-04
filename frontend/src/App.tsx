import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.tsx';
import Signup from './pages/Signup.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Activities from './pages/Activities.tsx';
import Profile from './pages/Profile.tsx';
import Analytics from './pages/Analytics.tsx';

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
