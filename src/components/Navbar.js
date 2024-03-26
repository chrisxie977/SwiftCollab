import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../firebase-config';

// Import your icons and images
//import banner from '../icons/banner.png';
import swiftCollab_new2 from '../icons/swiftcollab_new2.png';
import home from '../icons/home.png';
import bio from '../icons/bio_2.png';
import review from '../icons/review.png';
import peer_review from '../icons/peer_review.png'
import profile from '../icons/profile.png';
import admin from '../icons/admin.png';
import search from '../icons/search.png'; // Assuming search.png is for "View Student Profile"
import logout from '../icons/logout.png';
import login from '../icons/login.png';
import signup from '../icons/signup.png';

const Navbar = () => {
  const { currentUser, userRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Define specific styles for each icon if needed
  const iconStyle = { width: '40px', height: '40px', marginRight: '10px' };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img src={swiftCollab_new2} alt="SwiftCollab" style={{ height: '50px' }} />
        </Link>
        <div className="navbar-nav">
          <Link className="nav-link" to="/"><img src={home} alt="Home" style={iconStyle} />Home</Link>
          {currentUser && (
            <>
              {['admin', 'student', 'non-student'].includes(userRole) && (
                <>
                  <Link className="nav-link" to="/create-bio"><img src={bio} alt="Create Bio" style={iconStyle} />Create Bio</Link>
                  <Link className="nav-link" to="/profile"><img src={profile} alt="Profile" style={iconStyle} />Profile</Link>
                  <Link className="nav-link" to="/profile/:studentId"><img src={search} alt="View Student Profile" style={iconStyle} />View Student Profile</Link>
                </>
              )}
              {['admin', 'student'].includes(userRole) && (
                <>
                  <Link className="nav-link" to="/review-form"><img src={peer_review} alt="Peer Review Form" style={iconStyle} />Peer Review Form</Link>
                  <Link className="nav-link" to="/self-evaluation"><img src={review} alt="Self Evaluation" style={iconStyle} />Self Evaluation</Link>
                </>
              )}
              {userRole === 'admin' && (
                <Link className="nav-link" to="/admin"><img src={admin} alt="Admin" style={iconStyle} />Admin</Link>
              )}
              <button onClick={handleLogout} className="btn-logout" style={{ display: 'flex', alignItems: 'center' }}>
                <img src={logout} alt="Logout" style={iconStyle} />Logout
              </button>
            </>
          )}
          {!currentUser && (
            <>
              <Link className="nav-link" to="/login"><img src={login} alt="Login" style={iconStyle} />Login</Link>
              <Link className="nav-link" to="/signup"><img src={signup} alt="Sign Up" style={iconStyle} />Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
