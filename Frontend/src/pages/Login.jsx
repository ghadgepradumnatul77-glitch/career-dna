import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.detail || 'Invalid email or password credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-card auth-box">
        <div className="text-center mb-4">
          <h1 className="gradient-text h2 mb-2">Career DNA</h1>
          <p className="text-secondary small">Sign in to access AI Engineer Dashboard</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label className="form-label text-secondary small fw-semibold">Email Address</label>
            <input
              type="email"
              className="form-control form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@example.com"
              required
            />
          </div>

          <div className="form-group mb-3">
            <label className="form-label text-secondary small fw-semibold">Password</label>
            <input
              type="password"
              className="form-control form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password123!"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 mt-2" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-4 small text-secondary">
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};
