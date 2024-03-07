// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './Pages/HomePage';
import LoginPage from './Pages/LoginPage';
import SignUpPage from './Pages/SignUpPage';
import UserProfile from './Pages/UserProfile';
import ReportReviewForm from './Pages/ReportReviewForm';
import CreateBio from './Pages/CreateBio';
import ReviewForm from './Pages/PeerReviewForm';
import SelfEvaluationForm from './Pages/SelfEvaluationForm';
import RegistrationSuccess from './Pages/RegistrationSuccess'; // Import the success page
import { AuthProvider } from './contexts/AuthContext';
import './App.css'; // Make sure to import the CSS file

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/create-bio" element={<CreateBio />} />
          <Route path="/review-form" element={<ReviewForm />} />
          <Route path="/self-evaluation" element={<SelfEvaluationForm />} />
          <Route path="/report-review" element={<ReportReviewForm />} />
          <Route path="/registration-success" element={<RegistrationSuccess />} />
          {/* Add other Routes as needed */}
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
