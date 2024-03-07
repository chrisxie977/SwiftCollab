import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const { currentUser } = useAuth();

  return (
    <div className="container mt-5 text-center">
      <h1 className="display-4">Welcome to MyApp!</h1>
      <p className="lead">The place where teamwork and reviews come together.</p>
      {currentUser ? (
        <p className="fst-italic">Welcome back, {currentUser.email}!</p>
      ) : (
        <div>
          <p>Please sign in to continue or explore our community.</p>
          <Link to="/login" className="btn btn-primary me-2">Login</Link>
          <Link to="/signup" className="btn btn-secondary">Sign Up</Link>
        </div>
      )}
    </div>
  );
};

export default HomePage;
