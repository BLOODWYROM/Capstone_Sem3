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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-green-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🌱</span>
              <h1 className="text-xl font-bold text-white">GreenTrack</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/activities')}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                My Activities
              </button>
              <button
                onClick={handleLogout}
                className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome, {user.name || 'User'}!</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 p-4 rounded">
              <p className="text-sm text-gray-600 mb-1">Name</p>
              <p className="text-lg font-semibold text-gray-900">{user.name || 'Not provided'}</p>
            </div>
            <div className="border border-gray-200 p-4 rounded">
              <p className="text-sm text-gray-600 mb-1">Email</p>
              <p className="text-lg font-semibold text-gray-900">{user.email}</p>
            </div>
            <div className="border border-gray-200 p-4 rounded">
              <p className="text-sm text-gray-600 mb-1">User ID</p>
              <p className="text-lg font-semibold text-gray-900">{user.id.slice(0, 8)}...</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
            <div className="text-4xl mb-3">🚗</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Travel</h3>
            <p className="text-gray-600 text-sm">Track transportation emissions</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
            <div className="text-4xl mb-3">🍽️</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Food</h3>
            <p className="text-gray-600 text-sm">Monitor food carbon footprint</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Energy</h3>
            <p className="text-gray-600 text-sm">Measure energy consumption</p>
          </div>
        </div>

        <div className="bg-green-700 text-white rounded-lg shadow p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Start Tracking Your Carbon Footprint</h3>
          <p className="mb-4 text-green-100">Every action counts towards a greener planet</p>
          <button
            onClick={() => navigate('/activities')}
            className="bg-white text-green-700 px-6 py-2 rounded hover:bg-gray-100 transition font-semibold"
          >
            Go to Activities →
          </button>
        </div>
      </div>
    </div>
  );
}
