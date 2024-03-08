import React from 'react';
import { Container, Typography } from '@mui/material';

const TermsOfUse = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>Terms of Use</Typography>
      <Typography paragraph>
        Welcome to SwiftCollab! These terms and conditions outline the rules and regulations for the use of SwiftCollab's Website, located at swiftcollab.com.
        By accessing this website we assume you accept these terms and conditions. Do not continue to use SwiftCollab if you do not agree to all of the terms and conditions stated on this page.
        {/* Add more content as needed */}
      </Typography>
    </Container>
  );
};

export default TermsOfUse;
