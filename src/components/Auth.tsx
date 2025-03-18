import React, { useState } from 'react';
import supabase from '../services/supabaseClient';
import './Auth.css';

type AuthProps = {
  onLogin?: () => void;
};

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isResetPassword) {
      if (!email) {
        setMessage({ text: 'Please enter your email address', type: 'error' });
        return;
      }
      
      try {
        setLoading(true);
        setMessage(null);
        
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + '/reset-password',
        });
        
        if (error) throw error;
        
        setMessage({ 
          text: 'Password reset instructions sent to your email!', 
          type: 'success' 
        });
      } catch (error: any) {
        setMessage({ 
          text: error.message || 'An error occurred during password reset', 
          type: 'error' 
        });
      } finally {
        setLoading(false);
      }
      return;
    }
    
    if (!isResetPassword && !email || !password) {
      setMessage({ text: 'Please enter both email and password', type: 'error' });
      return;
    }
    
    try {
      setLoading(true);
      setMessage(null);
      
      if (isSignUp) {
        // Sign up
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) throw error;
        setMessage({ 
          text: 'Registration successful! Check your email for the confirmation link.', 
          type: 'success' 
        });
      } else {
        // Sign in
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        if (onLogin) onLogin();
      }
    } catch (error: any) {
      setMessage({ 
        text: error.message || 'An error occurred during authentication', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setIsResetPassword(false);
    setMessage(null);
  };

  const toggleResetPassword = () => {
    setIsResetPassword(!isResetPassword);
    setIsSignUp(false);
    setMessage(null);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>
          {isResetPassword 
            ? 'Reset Password' 
            : isSignUp 
              ? 'Create Account' 
              : 'Sign In'}
        </h2>
        
        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleAuth}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
            />
          </div>
          
          {!isResetPassword && (
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
              />
            </div>
          )}
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading 
              ? 'Processing...' 
              : isResetPassword 
                ? 'Send Reset Instructions'
                : isSignUp 
                  ? 'Sign Up' 
                  : 'Sign In'}
          </button>
        </form>
        
        {!isResetPassword && (
          <p className="auth-toggle">
            {isSignUp ? 'Already have an account?' : 'Need an account?'}{' '}
            <button 
              type="button" 
              className="toggle-link" 
              onClick={toggleAuthMode}
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        )}
        
        <p className="auth-toggle">
          {isResetPassword ? 'Remember your password?' : 'Forgot your password?'}{' '}
          <button 
            type="button" 
            className="toggle-link" 
            onClick={toggleResetPassword}
          >
            {isResetPassword ? 'Sign In' : 'Reset Password'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
