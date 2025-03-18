import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Pages
import Dashboard from './pages/Dashboard';
import ApplicationList from './pages/ApplicationList';
import ApplicationForm from './pages/ApplicationForm';
import ApplicationDetail from './pages/ApplicationDetail';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';

// Components
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';

const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/applications" element={
        <ProtectedRoute>
          <ApplicationList />
        </ProtectedRoute>
      } />
      
      <Route path="/applications/new" element={
        <ProtectedRoute>
          <ApplicationForm />
        </ProtectedRoute>
      } />
      
      <Route path="/applications/:id" element={
        <ProtectedRoute>
          <ApplicationDetail />
        </ProtectedRoute>
      } />
      
      <Route path="/applications/:id/edit" element={
        <ProtectedRoute>
          <ApplicationForm />
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={
              <>
                <Header />
                <main className="main-content">
                  <AppRoutes />
                </main>
                <footer className="footer">
                  <p>&copy; {new Date().getFullYear()} Job Tracker for Unity C# Developers</p>
                </footer>
              </>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
