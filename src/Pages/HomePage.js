// HomePage.js
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const { currentUser } = useAuth();

  return (
    <div className="container mt-5 text-center">
      <h1 className="display-4">Welcome to SwiftCollab!</h1>
      <p className="lead">The place where teamwork and reviews come together.</p>
      {currentUser && <p className="fst-italic">Welcome back, {currentUser.email}!</p>}
      <div>
        <p>Explore projects, collaborate with peers, and build your professional network.</p>
        <p>Join SwiftCollab to enhance your teamwork experience.</p>
      </div>
    </div>
  );
};

export default HomePage;
