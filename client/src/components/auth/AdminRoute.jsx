import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminRoute = ({ children }) => {
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  const isAdmin = user && (user.role === 'admin');

  if (!isAdmin) {
    toast.error('Access denied. Admins only.');
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;