import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './Pages/HomePage';
import LoginPage from './Pages/LoginPage';
import SignUpPage from './Pages/SignUpPage';
import UserProfile from './Pages/UserProfile';
import ReportReviewForm from './Pages/ReportReviewForm';
import CreateBio from './Pages/CreateBio';
import ReviewForm from './Pages/PeerReviewForm';
import SelfEvaluationForm from './Pages/SelfEvaluationForm';
import RegistrationSuccess from './Pages/RegistrationSuccess';
import AboutUs from './Pages/AboutUs';
import TermsOfUse from './Pages/TermsOfUse';
import PrivacyPolicy from './Pages/PrivacyPolicy';
import CookiePolicy from './Pages/CookiePolicy';
import AdminPage from './Pages/AdminPage'; // Import the AdminPage component
import ViewStudentProfile from './Pages/ViewStudentProfile'; // Adjust the import path as necessary
import { AuthProvider } from './contexts/AuthContext';


function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <div className="content-wrap">
          <AnimatePresence>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/terms" element={<TermsOfUse />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/cookies" element={<CookiePolicy />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/create-bio" element={<CreateBio />} />
              <Route path="/review-form" element={<ReviewForm />} />
              <Route path="/self-evaluation" element={<SelfEvaluationForm />} />
              <Route path="/report-review" element={<ReportReviewForm />} />
              <Route path="/registration-success" element={<RegistrationSuccess />} />
              <Route path="/admin" element={<AdminPage />} /> {/* Add this route for the AdminPage */}
              <Route path="/profile/:studentId" element={<ViewStudentProfile />} />
              {/* Add other Routes as needed */}
            </Routes>
          </AnimatePresence>
        </div>
        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;
