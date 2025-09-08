import { useState } from 'react';
import { authAPI } from '../utils/api';
import './LoginPage.css';

function LoginPage({ onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isRegistering) {
        // Register new user
        const registerData = {
          ...formData,
          name: formData.name || formData.email.split('@')[0] // Use email prefix as default name
        };
        await authAPI.register(registerData.email, registerData.password, registerData.name);
      }
      
      // Login
      const result = await authAPI.login(formData.email, formData.password);
      
      if (result.success) {
        onLoginSuccess(result.data.user);
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (email, password) => {
    console.log('🚀 Quick login initiated for:', email);
    setIsLoading(true);
    setError('');
    
    try {
      console.log('📞 Calling authAPI.login...');
      const result = await authAPI.login(email, password);
      console.log('📋 Login result:', result);
      
      if (result.success) {
        console.log('✅ Login successful, calling onLoginSuccess');
        onLoginSuccess(result.data.user);
      } else {
        console.log('❌ Login failed:', result);
        setError('Quick login failed');
      }
    } catch (err) {
      console.error('💥 Quick login error:', err);
      setError(`Quick login failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>📊 Smart Report</h1>
          <p>Weekly progress tracking and reporting system</p>
        </div>

        <div className="login-form-container">
          <div className="form-tabs">
            <button 
              className={`tab-button ${!isRegistering ? 'active' : ''}`}
              onClick={() => setIsRegistering(false)}
            >
              Sign In
            </button>
            <button 
              className={`tab-button ${isRegistering ? 'active' : ''}`}
              onClick={() => setIsRegistering(true)}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {isRegistering && (
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required={isRegistering}
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading-spinner">⏳</span>
              ) : (
                isRegistering ? 'Create Account' : 'Sign In'
              )}
            </button>
          </form>

          <div className="quick-login-section">
            <div className="divider">
              <span>Quick Demo Access</span>
            </div>
            
            <div className="quick-login-buttons">
              <button 
                className="quick-login-btn"
                onClick={() => handleQuickLogin('test@example.com', 'test123')}
                disabled={isLoading}
              >
                <span className="demo-user-icon">👤</span>
                Demo User
              </button>
              
              <button 
                className="quick-login-btn"
                onClick={() => handleQuickLogin('admin@smartreport.com', 'admin123')}
                disabled={isLoading}
              >
                <span className="admin-user-icon">👑</span>
                Admin Demo
              </button>
            </div>

            <p className="demo-note">
              Use demo accounts to explore the application without registration
            </p>
          </div>
        </div>

        <div className="login-footer">
          <p>
            Built with React + HONO + SQLite | 
            <a href="https://github.com/sonnt-skyline/smart_report" target="_blank" rel="noopener noreferrer">
              View Source
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
