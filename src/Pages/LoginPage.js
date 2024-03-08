// LoginPage.jsx
import React, { useState } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase-config';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      alert("Failed to login: " + error.message);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      alert('Password reset email sent. Please check your email.');
      setShowResetForm(false);
      setResetEmail('');
    } catch (error) {
      alert("Failed to send password reset email: " + error.message);
    }
  };

  return (
    <div className="page-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="form-container">
        <div className="input-group">
          <input 
            type="email" 
            name="email"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Email" 
            required 
          />
          <input 
            type="password" 
            name="password"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Password" 
            required 
          />
        </div>
        <div className="button-group">
          <button type="submit" className="btn btn-primary">Login</button>
          <button type="button" onClick={() => setShowResetForm(!showResetForm)} className="btn btn-secondary">Forgot Password?</button>
        </div>
      </form>

      {showResetForm && (
        <form onSubmit={handleForgotPassword} className="reset-form">
          <h3>Forgot Password</h3>
          <p>Please enter your email address to reset your password.</p>
          <input 
            type="email" 
            name="resetEmail"
            value={resetEmail} 
            onChange={(e) => setResetEmail(e.target.value)} 
            placeholder="Email" 
            required 
          />
          <div className="button-group">
            <button type="submit" className="btn btn-primary">Reset Password</button>
            <button type="button" onClick={() => setShowResetForm(false)} className="btn btn-secondary">Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default LoginPage;
