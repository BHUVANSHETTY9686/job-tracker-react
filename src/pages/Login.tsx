import React from 'react';
import { useNavigate } from 'react-router-dom';
import Auth from '../components/Auth';
import './Login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/');
  };

  return (
    <div className="login-page">
      <Auth onLogin={handleLogin} />
    </div>
  );
};

export default Login;
