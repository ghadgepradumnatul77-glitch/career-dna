import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      await signup(email, password, fullName);
      setSuccessMsg('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      console.error('Signup failed:', err);
      setError(err.response?.data?.detail || 'Account registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-card auth-box">
        <div className="text-center mb-4">
          <h1 className="gradient-text h2 mb-2">Create Account</h1>
          <p className="text-secondary small">Join Career DNA AI Engine</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {successMsg && <div className="alert alert-success">{successMsg}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label className="form-label text-secondary small fw-semibold">Full Name</label>
            <input
              type="text"
              className="form-control form-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Prashant Ghadge"
              required
            />
          </div>

          <div className="form-group mb-3">
            <label className="form-label text-secondary small fw-semibold">Email Address</label>
            <input
              type="email"
              className="form-control form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="engineer@careerdna.ai"
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
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="text-center mt-4 small text-secondary">
          Already registered?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
