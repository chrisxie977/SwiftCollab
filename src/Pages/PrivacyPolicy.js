import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const PrivacyPolicy = () => {

  // Get today's date
//  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Container>
      <Box className="container mt-5 form-container" textAlign="center" mt={5}>
      <Typography variant="h4" gutterBottom>Privacy Policy</Typography>
      <Typography variant="body1" paragraph>
        At SwiftCollab, accessible from swiftcollab.com, the privacy of our visitors is important to us.
        <br></br>This Privacy Policy document outlines the types of personal information received and collected by SwiftCollab and how it is used.
      </Typography>
      <br></br>
      <Typography variant="h5" gutterBottom>Information Collection</Typography>
      <Typography variant="body1" paragraph>
        SwiftCollab may collect personal information such as name, email address, and any other
        <br></br>information voluntarily provided by users through forms or interactions with the website.
      </Typography>
      <br></br>
      <Typography variant="h5" gutterBottom>Use of Information</Typography>
      <Typography variant="body1" paragraph>
        Personal information collected by SwiftCollab is used solely for the purpose of providing and improving the service.
        <br></br>We do not share or sell this information to third parties.
      </Typography>
      <br></br>
      <Typography variant="h5" gutterBottom>Consent</Typography>
      <Typography variant="body1" paragraph>
        By using SwiftCollab, you consent to the collection and use of your personal information as outlined in this Privacy Policy.
      </Typography>
      <br></br>
      
      </Box>
    </Container>
  );
};

export default PrivacyPolicy;
