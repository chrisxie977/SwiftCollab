import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const PeerReviewForm = () => {
  const { currentUser } = useAuth();
  const [review, setReview] = useState({ rating: '', comments: '' });
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollectionRef = collection(db, "users");
      const data = await getDocs(usersCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                       .filter(u => u.id !== currentUser?.uid)); // Exclude the current user
    };

    if (currentUser) fetchUsers();
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("You must be logged in to submit a review.");
      return;
    }
    if (!selectedUser) {
      alert("You must select a user to review.");
      return;
    }

    try {
      await addDoc(collection(db, "peerReviews"), {
        ...review,
        userId: selectedUser.id, // The user who is being reviewed
        reviewerId: currentUser.uid, // The reviewer
        createdAt: new Date(),
      });
      alert('Review submitted successfully.');
      setReview({ rating: '', comments: '' });
      setSelectedUser(null);
    } catch (error) {
      console.error("Error submitting review: ", error);
      alert("Error submitting review: " + error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReview(prevReview => ({ ...prevReview, [name]: value }));
  };

  return (
    <Box className="container mt-5 form-container">
      <h2>Peer Review Form</h2>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <Autocomplete
          disablePortal
          id="user-select-autocomplete"
          options={users}
          getOptionLabel={(option) => option.displayName || option.email}
          sx={{ mb: 2, width: 300 }}
          renderInput={(params) => <TextField {...params} label="Select a student" required />}
          onChange={(event, newValue) => setSelectedUser(newValue)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="rating"
          label="Rating"
          name="rating"
          autoComplete="rating"
          autoFocus
          value={review.rating}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="comments"
          label="Comments"
          type="text"
          id="comments"
          autoComplete="comments"
          multiline
          rows={4}
          value={review.comments}
          onChange={handleChange}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Submit Review
        </Button>
      </Box>
    </Box>
  );
};

export default PeerReviewForm;
