// RegistrationSuccess.js
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box } from '@mui/material';

const RegistrationSuccess = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = '/';
    }, 3000);

    // Clear the timeout when the component unmounts to prevent memory leaks
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box className="container mt-3 form-container text-center" sx={{ maxWidth: 800 }}>
    <div>
      <h1>Registration Successful!</h1>
      <p>Your registration was successful. You can now log in using your credentials.</p>
    </div>
    </Box>
  );
};

export default RegistrationSuccess;
