import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase-config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Box } from '@mui/material';

const CreateBio = () => {
  const { currentUser } = useAuth();
  const [bioData, setBioData] = useState({
    bio: '',
    skills: '',
    achievements: '',
    interests: '',
    careerGoals: ''
  });

  useEffect(() => {
    const fetchBioData = async () => {
      if (currentUser) {
        const bioRef = doc(db, "bios", currentUser.uid);
        const bioSnap = await getDoc(bioRef);
        if (bioSnap.exists()) {
          setBioData(bioSnap.data());
        }
      }
    };

    fetchBioData();
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("You must be logged in to create a bio.");
      return;
    }

    // No need to convert skills to an array unless specifically needed for other operations.
    try {
      await setDoc(doc(db, "bios", currentUser.uid), {
        ...bioData,
        updatedAt: new Date(),
      });
      alert('Bio updated successfully.');
    } catch (error) {
      console.error("Error updating bio:", error);
      alert("Error updating bio: " + error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBioData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  return (
    <Box className="container mt-5 form-container" mt={3}>
    <div>
      <h2>Create Your Bio</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <label>Bio:</label>
        <textarea
          id="bio"
          name="bio"
          className="form-control"
          value={bioData.bio}
          onChange={handleChange}
          placeholder="Tell us about yourself"
          required
        />
        <label>Skills:</label>
        <input
          id="skills"
          name="skills"
          type="text"
          className="form-control"
          value={bioData.skills}
          onChange={handleChange}
          placeholder="List your skills, separated by commas"
        />
        <label>Achievements:</label>
        <textarea
          id="achievements"
          name="achievements"
          className="form-control"
          value={bioData.achievements}
          onChange={handleChange}
          placeholder="Your achievements"
        />
        <label>Interests:</label>
        <textarea
          id="interests"
          name="interests"
          className="form-control"
          value={bioData.interests}
          onChange={handleChange}
          placeholder="Your interests"
        />
        <label>Career Goals:</label>
        <textarea
          id="careerGoals"
          name="careerGoals"
          className="form-control"
          value={bioData.careerGoals}
          onChange={handleChange}
          placeholder="Your career goals"
        />
        <button type="submit" className="btn btn-primary">Update Bio</button>
      </form>
    </div>
    </Box>
  );
};

export default CreateBio;
