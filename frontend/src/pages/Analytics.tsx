import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

interface MonthlyData {
  month: string;
  co2: number;
  activities: number;
}

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchData(token);
  }, [navigate]);

  const fetchData = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/api/activities?limit=1000`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();
      setActivities(data.activities);
      processMonthlyData(data.activities);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const processMonthlyData = (acts: any[]) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyStats: MonthlyData[] = months.map((month, index) => {
      const monthActivities = acts.filter((a: any) => {
        const date = new Date(a.date);
        return date.getMonth() === index && date.getFullYear() === selectedYear;
      });

      return {
        month,
        co2: monthActivities.reduce((sum: number, a: any) => sum + a.carbonCO2, 0),
        activities: monthActivities.length
      };
    });

    setMonthlyData(monthlyStats);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getCategoryStats = () => {
    const travel = activities.filter(a => a.type === 'travel').reduce((sum, a) => sum + a.carbonCO2, 0);
    const food = activities.filter(a => a.type === 'food').reduce((sum, a) => sum + a.carbonCO2, 0);
    const energy = activities.filter(a => a.type === 'energy').reduce((sum, a) => sum + a.carbonCO2, 0);
    const total = travel + food + energy;

    return { travel, food, energy, total };
  };

  const getTopActivities = () => {
    return [...activities]
      .sort((a, b) => b.carbonCO2 - a.carbonCO2)
      .slice(0, 5);
  };

  const getBestWorstMonths = () => {
    const nonZeroMonths = monthlyData.filter(m => m.co2 > 0);
    if (nonZeroMonths.length === 0) return { best: null, worst: null };

    const best = nonZeroMonths.reduce((min, m) => m.co2 < min.co2 ? m : min);
    const worst = nonZeroMonths.reduce((max, m) => m.co2 > max.co2 ? m : max);

    return { best, worst };
  };

  // Global average benchmarks (kg CO₂ per month)
  const benchmarks = {
    travel: 250,      // Average person: ~250 kg/month from transportation
    food: 200,        // Average person: ~200 kg/month from food
    energy: 300,      // Average person: ~300 kg/month from home energy
    total: 750        // Average person: ~750 kg/month total
  };

  const getPerformanceLevel = (userCO2: number, benchmark: number) => {
    const percentage = (userCO2 / benchmark) * 100;
    if (percentage <= 50) return { level: 'Excellent', color: 'green', emoji: '🌟' };
    if (percentage <= 75) return { level: 'Good', color: 'blue', emoji: '👍' };
    if (percentage <= 100) return { level: 'Average', color: 'yellow', emoji: '😐' };
    if (percentage <= 150) return { level: 'High', color: 'orange', emoji: '⚠️' };
    return { level: 'Very High', color: 'red', emoji: '🚨' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-700">Loading...</div>
      </div>
    );
  }

  const categoryStats = getCategoryStats();
  const topActivities = getTopActivities();
  const { best, worst } = getBestWorstMonths();
  const maxCO2 = Math.max(...monthlyData.map(m => m.co2), 1);

  const travelPerformance = getPerformanceLevel(categoryStats.travel, benchmarks.travel);
  const foodPerformance = getPerformanceLevel(categoryStats.food, benchmarks.food);
  const energyPerformance = getPerformanceLevel(categoryStats.energy, benchmarks.energy);
  const totalPerformance = getPerformanceLevel(categoryStats.total, benchmarks.total);

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
                onClick={() => navigate('/dashboard')}
                className="text-white hover:text-gray-200"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/activities')}
                className="text-white hover:text-gray-200"
              >
                Activities
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
          <select
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(parseInt(e.target.value));
              processMonthlyData(activities);
            }}
            className="px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-600"
          >
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
          </select>
        </div>

        {/* Monthly Trend Chart */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Monthly CO₂ Emissions ({selectedYear})</h2>
          <div className="flex items-end justify-between h-64 border-b-2 border-l-2 border-gray-300 px-4 pb-2">
            {monthlyData.map((month) => {
              const heightPercent = maxCO2 > 0 ? (month.co2 / maxCO2) * 100 : 0;
              const barColor = month.co2 === 0 ? 'bg-gray-200' : 
                              month.co2 < 50 ? 'bg-green-500' : 
                              month.co2 < 100 ? 'bg-yellow-500' : 
                              month.co2 < 200 ? 'bg-orange-500' : 'bg-red-500';
              
              return (
                <div key={month.month} className="flex-1 flex flex-col items-center group">
                  <div className="relative w-full flex justify-center mb-2">
                    {month.co2 > 0 && (
                      <div className="absolute -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {Math.round(month.co2)} kg CO₂
                        <br />
                        {month.activities} {month.activities === 1 ? 'activity' : 'activities'}
                      </div>
                    )}
                    <div
                      className={`w-8 ${barColor} rounded-t transition-all duration-300 hover:opacity-80 cursor-pointer`}
                      style={{ height: `${Math.max(heightPercent, month.co2 > 0 ? 5 : 0)}%` }}
                    ></div>
                  </div>
                  <div className="text-xs font-medium text-gray-600 mt-2">{month.month}</div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
            <span>0 kg</span>
            <span className="flex items-center space-x-4">
              <span className="flex items-center"><span className="w-3 h-3 bg-green-500 rounded mr-1"></span>Low</span>
              <span className="flex items-center"><span className="w-3 h-3 bg-yellow-500 rounded mr-1"></span>Medium</span>
              <span className="flex items-center"><span className="w-3 h-3 bg-orange-500 rounded mr-1"></span>High</span>
              <span className="flex items-center"><span className="w-3 h-3 bg-red-500 rounded mr-1"></span>Very High</span>
            </span>
            <span>{Math.round(maxCO2)} kg</span>
          </div>
        </div>

        {/* Category Breakdown with Benchmarks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Emissions by Category</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">🚗 Travel</span>
                    <span className={`text-xs px-2 py-0.5 rounded bg-${travelPerformance.color}-100 text-${travelPerformance.color}-700`}>
                      {travelPerformance.emoji} {travelPerformance.level}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {Math.round(categoryStats.travel)} kg
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-1">
                  <div
                    className="bg-blue-600 h-4 rounded-full"
                    style={{ width: `${Math.min((categoryStats.travel / benchmarks.travel) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">Global avg: {benchmarks.travel} kg/month</p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">🍽️ Food</span>
                    <span className={`text-xs px-2 py-0.5 rounded bg-${foodPerformance.color}-100 text-${foodPerformance.color}-700`}>
                      {foodPerformance.emoji} {foodPerformance.level}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {Math.round(categoryStats.food)} kg
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-1">
                  <div
                    className="bg-orange-600 h-4 rounded-full"
                    style={{ width: `${Math.min((categoryStats.food / benchmarks.food) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">Global avg: {benchmarks.food} kg/month</p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">⚡ Energy</span>
                    <span className={`text-xs px-2 py-0.5 rounded bg-${energyPerformance.color}-100 text-${energyPerformance.color}-700`}>
                      {energyPerformance.emoji} {energyPerformance.level}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {Math.round(categoryStats.energy)} kg
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-1">
                  <div
                    className="bg-yellow-600 h-4 rounded-full"
                    style={{ width: `${Math.min((categoryStats.energy / benchmarks.energy) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">Global avg: {benchmarks.energy} kg/month</p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-gray-900">Total Emissions</span>
                    <span className={`text-xs px-2 py-0.5 rounded bg-${totalPerformance.color}-100 text-${totalPerformance.color}-700`}>
                      {totalPerformance.emoji} {totalPerformance.level}
                    </span>
                  </div>
                  <span className="font-bold text-red-600">{Math.round(categoryStats.total)} kg CO₂</span>
                </div>
                <p className="text-xs text-gray-500">Global avg: {benchmarks.total} kg/month</p>
              </div>
            </div>
          </div>

          {/* Best & Worst Months */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Performance Insights</h2>
            <div className="space-y-4">
              {best && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-3xl">🏆</span>
                    <div>
                      <p className="font-bold text-green-900">Best Month</p>
                      <p className="text-sm text-green-700">{best.month} {selectedYear}</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-green-900">{Math.round(best.co2)} kg CO₂</p>
                  <p className="text-sm text-green-700">{best.activities} activities tracked</p>
                </div>
              )}

              {worst && (
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-3xl">⚠️</span>
                    <div>
                      <p className="font-bold text-red-900">Highest Month</p>
                      <p className="text-sm text-red-700">{worst.month} {selectedYear}</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-red-900">{Math.round(worst.co2)} kg CO₂</p>
                  <p className="text-sm text-red-700">{worst.activities} activities tracked</p>
                </div>
              )}

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-3xl">📊</span>
                  <div>
                    <p className="font-bold text-blue-900">Your Monthly Avg</p>
                    <p className="text-sm text-blue-700">Across all months</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-blue-900">
                  {Math.round(monthlyData.reduce((sum, m) => sum + m.co2, 0) / 12)} kg CO₂
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  {Math.round(monthlyData.reduce((sum, m) => sum + m.co2, 0) / 12) < benchmarks.total / 12 
                    ? `${Math.round(((benchmarks.total / 12 - monthlyData.reduce((sum, m) => sum + m.co2, 0) / 12) / (benchmarks.total / 12)) * 100)}% below average!` 
                    : `${Math.round(((monthlyData.reduce((sum, m) => sum + m.co2, 0) / 12 - benchmarks.total / 12) / (benchmarks.total / 12)) * 100)}% above average`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Global Comparison */}
        <div className="bg-gradient-to-r from-green-700 to-green-600 text-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">How You Compare Globally</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <p className="text-sm mb-1">Your Total</p>
              <p className="text-3xl font-bold">{Math.round(categoryStats.total)} kg</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <p className="text-sm mb-1">Global Average</p>
              <p className="text-3xl font-bold">{benchmarks.total} kg</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <p className="text-sm mb-1">Difference</p>
              <p className={`text-3xl font-bold ${categoryStats.total < benchmarks.total ? 'text-green-200' : 'text-red-200'}`}>
                {categoryStats.total < benchmarks.total ? '-' : '+'}{Math.abs(Math.round(categoryStats.total - benchmarks.total))} kg
              </p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-white bg-opacity-10 rounded">
            <p className="text-sm">
              {categoryStats.total < benchmarks.total 
                ? `🎉 Great job! You're emitting ${Math.round(((benchmarks.total - categoryStats.total) / benchmarks.total) * 100)}% less CO₂ than the global average. Keep it up!`
                : categoryStats.total === 0
                ? `📝 Start tracking your activities to see how you compare to the global average of ${benchmarks.total} kg CO₂ per month.`
                : `⚠️ You're emitting ${Math.round(((categoryStats.total - benchmarks.total) / benchmarks.total) * 100)}% more CO₂ than the global average. Consider reducing your carbon footprint.`}
            </p>
          </div>
        </div>

        {/* Top 5 Activities */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Top 5 Highest Emission Activities</h2>
          {topActivities.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No activities tracked yet</p>
          ) : (
            <div className="space-y-3">
              {topActivities.map((activity, index) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded hover:border-green-600 transition"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
                    <div>
                      <p className="font-semibold text-gray-900">{activity.name}</p>
                      <p className="text-sm text-gray-600">
                        {activity.type} • {new Date(activity.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-red-600">{activity.carbonCO2} kg</p>
                    <p className="text-xs text-gray-500">CO₂</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
