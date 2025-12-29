import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      toast.error('Please log in to access this page', {
        id: 'auth-required',
      });
      
      navigate('/login', { replace: true});
    }
  }, [token, navigate]);

  if (!token) {
    return null; 
  }

  return children;
};

export default ProtectedRoute;