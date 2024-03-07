// RegistrationSuccess.js
import React from 'react';
import { Link } from 'react-router-dom';

const RegistrationSuccess = () => {
  return (
    <div className="container mt-5 text-center">
      <h1>Registration Successful!</h1>
      <p>Your registration was successful. You can now log in using your credentials.</p>
      <Link to="/login" className="btn btn-primary">Login</Link>
    </div>
  );
};

export default RegistrationSuccess;
