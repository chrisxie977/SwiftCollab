import React from 'react';
import { Container, Typography } from '@mui/material';

const CookiePolicy = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>Cookie Policy</Typography>
      <Typography paragraph>
        As is common practice with almost all professional websites, this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience.
        This page describes what information they gather, how we use it and why we sometimes need to store these cookies.
        {/* Add more content as needed */}
      </Typography>
    </Container>
  );
};

export default CookiePolicy;
