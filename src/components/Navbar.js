import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../firebase-config'; // Make sure the path to your firebase-config is correct

const Navbar = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login'); // Redirects to the login page after logout
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">SwiftCollab</Link>
        <div className="navbar-nav">
          <Link className="nav-link" to="/">Home</Link>
          {currentUser ? (
            <>
              <Link className="nav-link" to="/create-bio">Create Bio</Link>
              <Link className="nav-link" to="/review-form">Peer Review Form</Link>
              <Link className="nav-link" to="/self-evaluation">Self Evaluation</Link>
              <Link className="nav-link" to="/profile">Profile</Link>
              <Link className="nav-link" to="/admin">Admin</Link> {/* Add this line */}
              <Link className="nav-link" to="/profile/:studentId">View Profile</Link>
      {/* Note: Replace ":studentId" with actual student ID or implement a search mechanism */}
              <button onClick={handleLogout} className="btn btn-danger ms-auto">Logout</button>
            </>
          ) : (
            <>
              <Link className="nav-link" to="/login">Login</Link>
              <Link className="nav-link" to="/signup">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
