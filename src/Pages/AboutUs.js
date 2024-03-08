import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const AboutUs = () => {
  return (
    <Container>
      <Box textAlign="center" mt={5}>
        <Typography variant="h3" gutterBottom>About Us</Typography>
        <Typography variant="h5">Khin Maung Tun (34667827)</Typography>
        <Typography variant="h5">Krishnamachari Lakshminarayan (34062555)</Typography>
        <Typography variant="h5">Lim Jia Yi Justina (34546946)</Typography>
        <Typography variant="h5">Ng Cheng Lam (34439802)</Typography>
        <Typography variant="h5">Noor Saleha Abdul Hamid (33153983)</Typography>
        <Typography variant="h5">Shaqil Bin Salim (34481046)</Typography>
      </Box>
    </Container>
  );
};

export default AboutUs;
