import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [settings, setSettings] = useState({
    monthlyGoal: 100,
    emailNotifications: true,
    weeklyReports: false
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setFormData({
      name: parsedUser.name || '',
      email: parsedUser.email
    });
    setLoading(false);
  }, [navigate]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Update failed');
      }

      const data = await response.json();
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      setEditing(false);
      setMessage('Profile updated successfully!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Password change failed');
      }

      setChangingPassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setMessage('Password changed successfully!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-700">Loading...</div>
      </div>
    );
  }

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
                onClick={() => navigate('/analytics')}
                className="text-white hover:text-gray-200"
              >
                Analytics
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile & Settings</h1>

        {message && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            {error}
          </div>
        )}

        {/* Profile Information */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">Profile Information</h2>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Edit
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-600"
                  required
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 transition"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setFormData({ name: user.name || '', email: user.email });
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="text-lg font-semibold text-gray-900">{user.name || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-lg font-semibold text-gray-900">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">Change Password</h2>
            {!changingPassword && (
              <button
                onClick={() => setChangingPassword(true)}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Change
              </button>
            )}
          </div>

          {changingPassword ? (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-600"
                  required
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 transition"
                >
                  Update Password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setChangingPassword(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <p className="text-gray-600">••••••••</p>
          )}
        </div>

        {/* Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Preferences</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Monthly CO₂ Reduction Goal (kg)
              </label>
              <input
                type="number"
                value={settings.monthlyGoal}
                onChange={(e) => setSettings({ ...settings, monthlyGoal: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-600"
              />
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-600">Receive activity reminders</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900">Weekly Reports</p>
                <p className="text-sm text-gray-600">Get weekly summary emails</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.weeklyReports}
                  onChange={(e) => setSettings({ ...settings, weeklyReports: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
          </div>

          <button
            onClick={() => setMessage('Settings saved successfully!')}
            className="mt-6 w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 transition font-medium"
          >
            Save Settings
          </button>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-lg shadow p-6 mt-6 border-2 border-red-200">
          <h2 className="text-lg font-bold text-red-600 mb-4">Danger Zone</h2>
          <p className="text-gray-600 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                alert('Account deletion feature coming soon!');
              }
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
