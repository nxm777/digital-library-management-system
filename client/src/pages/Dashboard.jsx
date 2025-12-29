import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      toast.error('Please log in to access this page', {
        id: 'auth-error'
    });
      navigate('/login');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans relative">

      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Hi, <span className="text-blue-600">{user.username}</span>! 👋
        </h1>
        <p className="text-gray-600 text-lg">
          It's your Dashboard - place where you can manage your library and view your reading statistics.
        </p>
      </div>

    </div>
  );
};

export default Dashboard;