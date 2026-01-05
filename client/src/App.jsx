import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import Login from './pages/Login';

import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';

import PublicRoute from './components/auth/PublicRoute';
import ProtectedRoute from './components/auth/ProtectedRoute';

import ReadingLists from './components/ReadingLists';
import ListDetails from './pages/ListDetails';

import ReadingSessions from './pages/ReadingSessions';
import Statistics from './pages/Statistics';

function App() {
  return (
    <Router>
      <Toaster position="top-center" />
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        <Route path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        
        <Route path="/register" 
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } 
        />

        <Route 
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/lists" element={<ReadingLists />} />
          <Route path="/lists/:id" element={<ListDetails />} />
          <Route path="/sessions" element={<ReadingSessions />} />
          <Route path="/statistics" element={<Statistics />} />

        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />

      </Routes>
    </Router>
  );
}

export default App;