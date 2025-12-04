import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(userData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <nav className="bg-white shadow-lg border-b-4 border-green-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">🌱</span>
              <h1 className="text-2xl font-bold text-green-700">GreenTrack Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/activities')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
              >
                My Activities
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Welcome, {user.name || 'User'}! 👋</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-green-100 to-green-200 p-6 rounded-lg">
              <p className="text-sm text-green-700 font-semibold mb-1">Name</p>
              <p className="text-xl font-bold text-green-900">{user.name || 'Not provided'}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-lg">
              <p className="text-sm text-blue-700 font-semibold mb-1">Email</p>
              <p className="text-xl font-bold text-blue-900">{user.email}</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 p-6 rounded-lg">
              <p className="text-sm text-emerald-700 font-semibold mb-1">User ID</p>
              <p className="text-xl font-bold text-emerald-900">{user.id.slice(0, 8)}...</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition">
            <div className="text-5xl mb-3">🚗</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Travel</h3>
            <p className="text-gray-600">Track your transportation emissions</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition">
            <div className="text-5xl mb-3">🍽️</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Food</h3>
            <p className="text-gray-600">Monitor your food carbon footprint</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition">
            <div className="text-5xl mb-3">⚡</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Energy</h3>
            <p className="text-gray-600">Measure your energy consumption</p>
          </div>
        </div>

        <div className="mt-6 bg-green-600 text-white rounded-xl shadow-lg p-6 text-center">
          <h3 className="text-2xl font-bold mb-2">Start Tracking Your Carbon Footprint!</h3>
          <p className="mb-4">Every small action counts towards a greener planet 🌍</p>
          <button
            onClick={() => navigate('/activities')}
            className="bg-white text-green-600 px-6 py-3 rounded-lg hover:bg-green-50 transition font-semibold shadow-lg"
          >
            Go to Activities →
          </button>
        </div>
      </div>
    </div>
  );
}
