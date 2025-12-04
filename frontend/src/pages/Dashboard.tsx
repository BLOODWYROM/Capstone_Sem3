import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

interface Stats {
  totalActivities: number;
  totalCO2: number;
  travelCO2: number;
  foodCO2: number;
  energyCO2: number;
  thisMonthCO2: number;
  lastMonthCO2: number;
}

interface Activity {
  id: string;
  type: string;
  name: string;
  carbonCO2: number;
  date: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<Stats>({
    totalActivities: 0,
    totalCO2: 0,
    travelCO2: 0,
    foodCO2: 0,
    energyCO2: 0,
    thisMonthCO2: 0,
    lastMonthCO2: 0
  });
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(userData));
    fetchStats(token);
  }, [navigate]);

  const fetchStats = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/api/activities?limit=1000`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();
      const activities = data.activities;

      // Calculate stats
      const totalCO2 = activities.reduce((sum: number, a: any) => sum + a.carbonCO2, 0);
      const travelCO2 = activities.filter((a: any) => a.type === 'travel').reduce((sum: number, a: any) => sum + a.carbonCO2, 0);
      const foodCO2 = activities.filter((a: any) => a.type === 'food').reduce((sum: number, a: any) => sum + a.carbonCO2, 0);
      const energyCO2 = activities.filter((a: any) => a.type === 'energy').reduce((sum: number, a: any) => sum + a.carbonCO2, 0);

      const now = new Date();
      const thisMonth = activities.filter((a: any) => {
        const date = new Date(a.date);
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      }).reduce((sum: number, a: any) => sum + a.carbonCO2, 0);

      const lastMonth = activities.filter((a: any) => {
        const date = new Date(a.date);
        const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1);
        return date.getMonth() === lastMonthDate.getMonth() && date.getFullYear() === lastMonthDate.getFullYear();
      }).reduce((sum: number, a: any) => sum + a.carbonCO2, 0);

      setStats({
        totalActivities: activities.length,
        totalCO2: Math.round(totalCO2 * 100) / 100,
        travelCO2: Math.round(travelCO2 * 100) / 100,
        foodCO2: Math.round(foodCO2 * 100) / 100,
        energyCO2: Math.round(energyCO2 * 100) / 100,
        thisMonthCO2: Math.round(thisMonth * 100) / 100,
        lastMonthCO2: Math.round(lastMonth * 100) / 100
      });

      // Get recent 5 activities
      setRecentActivities(activities.slice(0, 5));
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'travel': return '🚗';
      case 'food': return '🍽️';
      case 'energy': return '⚡';
      default: return '📊';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user || loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-xl text-gray-700">Loading...</div>
    </div>
  );

  const changePercent = stats.lastMonthCO2 > 0 
    ? Math.round(((stats.thisMonthCO2 - stats.lastMonthCO2) / stats.lastMonthCO2) * 100)
    : 0;

  const travelPercent = stats.totalCO2 > 0 ? Math.round((stats.travelCO2 / stats.totalCO2) * 100) : 0;
  const foodPercent = stats.totalCO2 > 0 ? Math.round((stats.foodCO2 / stats.totalCO2) * 100) : 0;
  const energyPercent = stats.totalCO2 > 0 ? Math.round((stats.energyCO2 / stats.totalCO2) * 100) : 0;

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
                className="text-white hover:text-gray-200"
              >
                Activities
              </button>
              <button
                onClick={() => navigate('/analytics')}
                className="text-white hover:text-gray-200"
              >
                Analytics
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="text-white hover:text-gray-200"
              >
                Profile
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-700 to-green-600 text-white rounded-lg shadow-lg p-8 mb-6">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name || 'User'}! 👋</h1>
          <p className="text-green-100 text-lg">Track, analyze, and reduce your carbon footprint</p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total CO₂ Emissions</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalCO2}</p>
                <p className="text-xs text-gray-500 mt-1">kg CO₂</p>
              </div>
              <div className="text-4xl">💨</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Activities</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalActivities}</p>
                <p className="text-xs text-gray-500 mt-1">tracked</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">This Month</p>
                <p className="text-3xl font-bold text-gray-900">{stats.thisMonthCO2}</p>
                <p className="text-xs text-gray-500 mt-1">kg CO₂</p>
              </div>
              <div className="text-4xl">📅</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Monthly Change</p>
                <p className={`text-3xl font-bold ${changePercent > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {changePercent > 0 ? '+' : ''}{changePercent}%
                </p>
                <p className="text-xs text-gray-500 mt-1">vs last month</p>
              </div>
              <div className="text-4xl">{changePercent > 0 ? '📈' : '📉'}</div>
            </div>
          </div>
        </div>

        {/* Emissions Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Emissions by Category</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">🚗 Travel</span>
                  <span className="text-sm font-bold text-gray-900">{stats.travelCO2} kg ({travelPercent}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-blue-600 h-3 rounded-full" style={{width: `${travelPercent}%`}}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">🍽️ Food</span>
                  <span className="text-sm font-bold text-gray-900">{stats.foodCO2} kg ({foodPercent}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-orange-600 h-3 rounded-full" style={{width: `${foodPercent}%`}}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">⚡ Energy</span>
                  <span className="text-sm font-bold text-gray-900">{stats.energyCO2} kg ({energyPercent}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-yellow-600 h-3 rounded-full" style={{width: `${energyPercent}%`}}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Environmental Impact</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded">
                <span className="text-2xl">🌳</span>
                <div>
                  <p className="font-semibold text-gray-900">Trees Needed</p>
                  <p className="text-sm text-gray-600">~{Math.ceil(stats.totalCO2 / 21)} trees to offset your emissions</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded">
                <span className="text-2xl">🚗</span>
                <div>
                  <p className="font-semibold text-gray-900">Driving Equivalent</p>
                  <p className="text-sm text-gray-600">~{Math.round(stats.totalCO2 * 4.5)} km driven</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded">
                <span className="text-2xl">💡</span>
                <div>
                  <p className="font-semibold text-gray-900">Energy Equivalent</p>
                  <p className="text-sm text-gray-600">~{Math.round(stats.totalCO2 * 1.2)} kWh of electricity</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities & Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Recent Activities</h3>
              <button
                onClick={() => navigate('/activities')}
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                View All →
              </button>
            </div>
            {recentActivities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="mb-2">No activities yet</p>
                <button
                  onClick={() => navigate('/activities')}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Add your first activity
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded hover:border-green-600 transition"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getTypeIcon(activity.type)}</span>
                      <div>
                        <p className="font-semibold text-gray-900">{activity.name}</p>
                        <p className="text-xs text-gray-500">{new Date(activity.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-600">{activity.carbonCO2} kg</p>
                      <p className="text-xs text-gray-500">CO₂</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <button
              onClick={() => navigate('/activities')}
              className="w-full bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-left border-2 border-transparent hover:border-green-600"
            >
              <div className="text-3xl mb-2">📝</div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Add Activity</h3>
              <p className="text-sm text-gray-600">Track new emissions</p>
            </button>

            <div className="bg-green-700 text-white rounded-lg shadow p-6">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="text-lg font-bold mb-1">Monthly Goal</h3>
              <p className="text-sm text-green-100">Reduce by 20%</p>
              <div className="mt-3 bg-green-800 rounded-full h-2">
                <div className="bg-white h-2 rounded-full" style={{width: '45%'}}></div>
              </div>
              <p className="text-xs text-green-100 mt-1">45% achieved</p>
            </div>

            <div className="bg-blue-600 text-white rounded-lg shadow p-6">
              <div className="text-3xl mb-2">🏆</div>
              <h3 className="text-lg font-bold mb-1">Your Rank</h3>
              <p className="text-sm text-blue-100">Top 30% eco-friendly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
