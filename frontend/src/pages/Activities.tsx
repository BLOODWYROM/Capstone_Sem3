import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

interface Activity {
  id: string;
  type: string;
  name: string;
  description: string;
  amount: number;
  unit: string;
  carbonCO2: number;
  date: string;
}

export default function Activities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  
  // Filters
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Form
  const [formData, setFormData] = useState({
    type: 'travel',
    name: '',
    description: '',
    amount: '',
    unit: 'km',
    carbonCO2: '',
    date: new Date().toISOString().split('T')[0]
  });

  const navigate = useNavigate();

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        sortBy,
        sortOrder,
        ...(search && { search }),
        ...(type && { type }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate })
      });

      const response = await fetch(`${API_URL}/api/activities?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();
      setActivities(data.activities);
      setTotalPages(data.pagination.totalPages);
      setTotal(data.pagination.total);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [page, sortBy, sortOrder, search, type, startDate, endDate]);

  const exportToCSV = () => {
    if (activities.length === 0) {
      alert('No activities to export');
      return;
    }

    const headers = ['Date', 'Type', 'Name', 'Description', 'Amount', 'Unit', 'CO2 (kg)'];
    const rows = activities.map(a => [
      new Date(a.date).toLocaleDateString(),
      a.type,
      a.name,
      a.description || '',
      a.amount,
      a.unit,
      a.carbonCO2
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `greentrack-activities-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const loadTemplate = (template: string) => {
    const templates: any = {
      'car-commute': {
        type: 'travel',
        name: 'Car Commute',
        description: 'Daily car commute',
        amount: '20',
        unit: 'km',
        carbonCO2: '4.6',
        date: new Date().toISOString().split('T')[0]
      },
      'flight': {
        type: 'travel',
        name: 'Flight',
        description: 'Air travel',
        amount: '500',
        unit: 'km',
        carbonCO2: '115',
        date: new Date().toISOString().split('T')[0]
      },
      'beef-meal': {
        type: 'food',
        name: 'Beef Meal',
        description: 'Beef-based meal',
        amount: '0.5',
        unit: 'kg',
        carbonCO2: '13.5',
        date: new Date().toISOString().split('T')[0]
      },
      'electricity': {
        type: 'energy',
        name: 'Home Electricity',
        description: 'Daily electricity usage',
        amount: '10',
        unit: 'kWh',
        carbonCO2: '4.5',
        date: new Date().toISOString().split('T')[0]
      }
    };

    if (templates[template]) {
      setFormData(templates[template]);
      setShowModal(true);
      setEditingActivity(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const url = editingActivity 
        ? `${API_URL}/api/activities/${editingActivity.id}`
        : `${API_URL}/api/activities`;
      
      const method = editingActivity ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save');

      setShowModal(false);
      setEditingActivity(null);
      resetForm();
      fetchActivities();
    } catch (error) {
      console.error(error);
      alert('Failed to save activity');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this activity?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/activities/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete');

      fetchActivities();
    } catch (error) {
      console.error(error);
      alert('Failed to delete activity');
    }
  };

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setFormData({
      type: activity.type,
      name: activity.name,
      description: activity.description || '',
      amount: activity.amount.toString(),
      unit: activity.unit,
      carbonCO2: activity.carbonCO2.toString(),
      date: new Date(activity.date).toISOString().split('T')[0]
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      type: 'travel',
      name: '',
      description: '',
      amount: '',
      unit: 'km',
      carbonCO2: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'travel': return '🚗';
      case 'food': return '🍽️';
      case 'energy': return '⚡';
      default: return '📊';
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'travel': return 'bg-blue-100 text-blue-800';
      case 'food': return 'bg-orange-100 text-orange-800';
      case 'energy': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
        {/* Quick Templates */}
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Quick Add Templates</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <button
              onClick={() => loadTemplate('car-commute')}
              className="px-3 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition text-sm font-medium"
            >
              🚗 Car Commute
            </button>
            <button
              onClick={() => loadTemplate('flight')}
              className="px-3 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition text-sm font-medium"
            >
              ✈️ Flight
            </button>
            <button
              onClick={() => loadTemplate('beef-meal')}
              className="px-3 py-2 bg-orange-50 text-orange-700 rounded hover:bg-orange-100 transition text-sm font-medium"
            >
              🍖 Beef Meal
            </button>
            <button
              onClick={() => loadTemplate('electricity')}
              className="px-3 py-2 bg-yellow-50 text-yellow-700 rounded hover:bg-yellow-100 transition text-sm font-medium"
            >
              💡 Electricity
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <input
              type="text"
              placeholder="Search activities..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-600 focus:border-green-600 text-sm"
            />
            
            <select
              value={type}
              onChange={(e) => { setType(e.target.value); setPage(1); }}
              className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-600 focus:border-green-600 text-sm"
            >
              <option value="">All Types</option>
              <option value="travel">Travel</option>
              <option value="food">Food</option>
              <option value="energy">Energy</option>
            </select>

            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-600 focus:border-green-600 text-sm"
              >
                <option value="date">Sort by Date</option>
                <option value="carbonCO2">Sort by CO₂</option>
                <option value="name">Sort by Name</option>
              </select>

              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-600 focus:border-green-600 text-sm"
              >
                <option value="desc">↓</option>
                <option value="asc">↑</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <input
              type="date"
              placeholder="Start Date"
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
              className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-600 focus:border-green-600 text-sm"
            />
            <input
              type="date"
              placeholder="End Date"
              value={endDate}
              onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
              className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-600 focus:border-green-600 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => { setShowModal(true); setEditingActivity(null); resetForm(); }}
              className="bg-green-700 text-white py-2 rounded hover:bg-green-800 transition font-medium"
            >
              + Add New Activity
            </button>
            <button
              onClick={exportToCSV}
              className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-medium"
            >
              📥 Export to CSV
            </button>
          </div>
        </div>

        {/* Activities List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Your Activities ({total})
          </h2>

          {activities.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No activities found</p>
              <p className="mt-1 text-sm">Start tracking your carbon footprint!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="border border-gray-200 rounded p-4 hover:border-green-600 transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xl">{getTypeIcon(activity.type)}</span>
                        <div>
                          <h3 className="text-base font-semibold text-gray-900">{activity.name}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded ${getTypeColor(activity.type)}`}>
                            {activity.type}
                          </span>
                        </div>
                      </div>
                      {activity.description && (
                        <p className="text-gray-600 text-sm mb-2 ml-7">{activity.description}</p>
                      )}
                      <div className="flex flex-wrap gap-3 text-sm text-gray-700 ml-7">
                        <span>{activity.amount} {activity.unit}</span>
                        <span className="font-semibold text-red-700">{activity.carbonCO2} kg CO₂</span>
                        <span className="text-gray-500">{new Date(activity.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(activity)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(activity.id)}
                        className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-3 mt-6">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-green-700 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-green-800 transition"
              >
                Previous
              </button>
              <span className="text-gray-900 font-medium">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-green-700 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-green-800 transition"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingActivity ? 'Edit Activity' : 'Add New Activity'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-600 text-sm"
                  required
                >
                  <option value="travel">Travel</option>
                  <option value="food">Food</option>
                  <option value="energy">Energy</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-600 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-600 text-sm"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-600 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">Unit</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-600 text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">CO₂ Emissions (kg)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.carbonCO2}
                  onChange={(e) => setFormData({...formData, carbonCO2: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-600 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-600 text-sm"
                  required
                />
              </div>

              <div className="flex space-x-3 mt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-700 text-white py-2 rounded hover:bg-green-800 transition font-medium"
                >
                  {editingActivity ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditingActivity(null); resetForm(); }}
                  className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
