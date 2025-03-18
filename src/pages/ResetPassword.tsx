import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../services/supabaseClient';
import './ResetPassword.css';

const ResetPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have a hash in the URL which indicates a password reset token
    const hash = window.location.hash;
    if (!hash || !hash.includes('type=recovery')) {
      setMessage({ 
        text: 'Invalid or expired password reset link. Please request a new one.', 
        type: 'error' 
      });
    }
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      setMessage({ text: 'Please enter both fields', type: 'error' });
      return;
    }
    
    if (password !== confirmPassword) {
      setMessage({ text: 'Passwords do not match', type: 'error' });
      return;
    }
    
    if (password.length < 6) {
      setMessage({ text: 'Password must be at least 6 characters', type: 'error' });
      return;
    }
    
    try {
      setLoading(true);
      setMessage(null);
      
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) throw error;
      
      setMessage({ 
        text: 'Password updated successfully! Redirecting to login...', 
        type: 'success' 
      });
      
      // Redirect to login after showing success message
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error: any) {
      setMessage({ 
        text: error.message || 'Error updating password', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <h2>Reset Your Password</h2>
        
        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleResetPassword}>
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              disabled={loading || message?.type === 'success'}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              disabled={loading || message?.type === 'success'}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="reset-button"
            disabled={loading || message?.type === 'success'}
          >
            {loading ? 'Updating...' : 'Reset Password'}
          </button>
        </form>
        
        <p className="auth-toggle">
          <button 
            type="button" 
            className="toggle-link" 
            onClick={() => navigate('/login')}
          >
            Back to Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
