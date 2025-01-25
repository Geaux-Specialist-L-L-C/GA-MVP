import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Account Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-4">
                <img
                  src={currentUser?.photoURL || '/default-avatar.png'}
                  alt="Profile"
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <p className="font-medium">{currentUser?.displayName}</p>
                  <p className="text-gray-600">{currentUser?.email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 text-left border rounded hover:bg-gray-100">
                Edit Profile
              </button>
              <button className="w-full px-4 py-2 text-left border rounded hover:bg-gray-100">
                Change Password
              </button>
              <button className="w-full px-4 py-2 text-left border rounded hover:bg-gray-100">
                Notification Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;