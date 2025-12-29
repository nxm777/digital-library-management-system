import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => 
  localStorage.getItem('token') ? <Navigate to="/dashboard" replace /> : children;

export default PublicRoute;