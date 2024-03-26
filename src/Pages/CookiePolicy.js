import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const CookiePolicy = () => {

  // Get today's date
//  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Container>
      <Box className="container mt-5 form-container" textAlign="center" mt={5}>
      <Typography variant="h4" gutterBottom>Cookie Policy</Typography>
      <Typography variant="body1" paragraph>
      Welcome to SwiftCollab!
      <br></br>This page outlines our Cookie Policy and explains how we use cookies on our website.
      </Typography>
      <br></br>
      <Typography variant="h5" gutterBottom>What Are Cookies</Typography>
      <Typography variant="body1" paragraph>
        Cookies are small text files that are placed on your computer or mobile device when you visit a website.
        <br></br>They are widely used to make websites work more efficiently and to provide information to the website owners.
      </Typography>
      <br></br>
      <Typography variant="h5" gutterBottom>How We Use Cookies</Typography>
      <Typography variant="body1" paragraph>
        At SwiftCollab, we use cookies for various purposes, including:
        <ul>
          - Providing personalized user experiences
          <br></br>- Improving website performance and functionality
          <br></br>- Analyzing website traffic and usage patterns
          <br></br>These cookies help us understand how visitors interact with our website and enable us to make improvements to enhance user experience.
        </ul>
      </Typography>
      <br></br>
      <Typography variant="h5" gutterBottom>Managing Cookies</Typography>
      <Typography variant="body1" paragraph>
        You can manage or disable cookies through your web browser settings.
        <br></br>Please note that disabling cookies may affect the functionality of our website and some features may not work as intended.
      </Typography>
      <br></br>
   
      </Box>
    </Container>
  );
};

export default CookiePolicy;
