import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const TermsOfUse = () => {
  return (
    <Container>
      <Box className="container mt-5 form-container" textAlign="center" mt={5}>

      <Typography variant="h4" gutterBottom>Terms of Use</Typography>
      <Typography variant="body1" paragraph>
        Welcome to SwiftCollab!
        <br></br>These terms and conditions outline the rules and regulations for the use of SwiftCollab's Website.
        <br></br>By accessing this website we assume you accept these terms and conditions.
        <br></br>Do not continue to use SwiftCollab if you do not agree to all of the terms and conditions stated on this page.
      </Typography>
      <br></br>
      <Typography variant="h5" gutterBottom>Intellectual Property Rights</Typography>
      <Typography variant="body1" paragraph>
        Other than the content you own, under these terms, SwiftCollab and/or its licensors own all the intellectual property rights and materials
        <br></br>contained in this Website. You are granted limited license only for purposes of viewing the material contained on this Website.
      </Typography>
      <br></br>
      <Typography variant="h5" gutterBottom>Restrictions</Typography>
      <Typography variant="body1" paragraph>
        You are specifically restricted from all of the following:
        <ul>
          publishing any Website material in any other media;
          <br></br>selling, sublicensing and/or otherwise commercializing any Website material;
          <br></br>publicly performing and/or showing any Website material;
          <br></br>using this Website in any way that is or may be damaging to this Website;
          <br></br>using this Website in any way that impacts user access to this Website;
          <br></br>using this Website contrary to applicable laws and regulations, or in any way may cause harm to the Website, or to any person or business entity;
          <br></br>engaging in any data mining, data harvesting, data extracting or any other similar activity in relation to this Website;
          <br></br>using this Website to engage in any advertising or marketing.
        </ul>
      </Typography>
      </Box>
    </Container>
  );
};

export default TermsOfUse;
