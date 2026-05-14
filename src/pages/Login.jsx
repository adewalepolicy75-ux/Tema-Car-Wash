import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Home } from 'lucide-react';
import { login } from '../services/api';
import './Auth.css';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await login(formData.email, formData.password);
      
      // Check if response has token and user
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        toast.success('Login successful!');
        
        if (response.data.user.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/applied');
        }
      } else {
        setError('Invalid response from server');
        toast.error('Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      // Handle different error responses
      if (err.response) {
        // Server responded with error status
        const errorMessage = err.response.data?.message || 'Login failed';
        setError(errorMessage);
        toast.error(errorMessage);
      } else if (err.request) {
        // Request was made but no response
        setError('Cannot connect to server');
        toast.error('Server not responding');
      } else {
        // Something else happened
        setError('Login failed. Please try again.');
        toast.error('Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <button className="home-icon-btn" onClick={() => navigate('/')}>
        <Home size={24} />
      </button>

      <div className="auth-card">
        <div className="auth-logo">
          <div className="logo-icon">JT</div>
          <h1>Welcome Back</h1>
          <p>Login to track your job applications</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
}
