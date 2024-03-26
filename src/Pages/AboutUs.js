import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const AboutUs = () => {
  return (
    <Container>
      <Box className="container mt-5 form-container" textAlign="center" mt={5}>
      <Typography variant="h4" gutterBottom>About SwiftCollab</Typography>
      <Typography variant="body1" paragraph>
        SwiftCollab is a dynamic platform designed to foster collaboration and innovation among students, professionals, and organizations.
        <br></br>Our goal is to empower individuals to connect, share knowledge, and work together towards common goals.
      </Typography>
      <br></br>
      <Typography variant="h5" gutterBottom>Our Vision</Typography>
      <Typography variant="body1" paragraph>
        At SwiftCollab, we envision a world where collaboration knows no boundaries.
        <br></br>We believe in the power of teamwork to drive positive change and achieve remarkable outcomes.
      </Typography>
      <br></br>
      <Typography variant="h5" gutterBottom>Our Mission</Typography>
      <Typography variant="body1" paragraph>
        Our mission is to provide a versatile platform that promotes collaboration, creativity, and learning.
        <br></br>We strive to create an inclusive community where diverse ideas thrive and innovation flourishes.
      </Typography>
      <br></br>
      <Typography variant="h5" gutterBottom>Join Us</Typography>
      <Typography variant="body1" paragraph>
        Whether you're a student looking to collaborate on projects, a professional seeking networking opportunities,
        <br></br>or an organization in need of skilled talent, SwiftCollab welcomes you to join our vibrant community.
        <br></br>Together, let's unleash the power of collaboration and create a brighter future.
      </Typography>
      <br></br>
      <Typography variant="h5" gutterBottom>Team Members</Typography>
      <Typography variant="body1" paragraph>
        Meet the dedicated team behind SwiftCollab:
        <br></br>Khin Maung Tun, Krishnamachari Lakshminarayan, Lim Jia Yi Justina, Ng Cheng Lam, Noor Saleha Abdul Hamid, and Shaqil Bin Salim.
      </Typography>
      </Box>
    </Container>
  );
};

export default AboutUs;
