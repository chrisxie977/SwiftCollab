import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase-config';
import { doc, setDoc } from 'firebase/firestore';

const CreateBio = () => {
  const { currentUser } = useAuth();
  const [bioData, setBioData] = useState({
    bio: '',
    skills: '',
    achievements: '',
    interests: '',
    careerGoals: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("You must be logged in to create a bio.");
      return;
    }

    const skillsArray = bioData.skills.split(',').map(skill => skill.trim()); // Convert skills string to array

    try {
      await setDoc(doc(db, "bios", currentUser.uid), {
        ...bioData,
        skills: skillsArray,
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
    <div className="container mt-5">
      <h2>Create Your Bio</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <textarea
          name="bio"
          className="form-control"
          value={bioData.bio}
          onChange={handleChange}
          placeholder="Tell us about yourself"
          required
        />
        <input
          name="skills"
          type="text"
          className="form-control"
          value={bioData.skills}
          onChange={handleChange}
          placeholder="List your skills, separated by commas"
        />
        <textarea
          name="achievements"
          className="form-control"
          value={bioData.achievements}
          onChange={handleChange}
          placeholder="Your achievements"
        />
        <textarea
          name="interests"
          className="form-control"
          value={bioData.interests}
          onChange={handleChange}
          placeholder="Your interests"
        />
        <textarea
          name="careerGoals"
          className="form-control"
          value={bioData.careerGoals}
          onChange={handleChange}
          placeholder="Your career goals"
        />
        <button type="submit" className="btn btn-primary">Update Bio</button>
      </form>
    </div>
  );
};

export default CreateBio;