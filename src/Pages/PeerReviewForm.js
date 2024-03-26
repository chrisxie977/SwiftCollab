import React, { useState } from 'react';
import { db } from '../firebase-config';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { TextField, Box, Button, Typography } from '@mui/material';

const PeerReviewForm = () => {
  const { currentUser } = useAuth();
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [comments, setComments] = useState('');
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setSearchResults([]);
    setSelectedUser(null);

    const usersRef = collection(db, "users");
    const queries = [
      query(usersRef, where("firstName", "==", searchText)),
      query(usersRef, where("lastName", "==", searchText)),
      query(usersRef, where("studentId", "==", searchText)),
    ];

    try {
      const querySnapshots = await Promise.all(queries.map(q => getDocs(q)));
      const results = querySnapshots.flatMap(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      const uniqueResults = Array.from(new Map(results.map(result => [result.id, result])).values());
      setSearchResults(uniqueResults);
    } catch (err) {
      setError('Failed to search users. Please try again.');
      console.error(err);
    }
  };

  const handleUserSelect = (user) => {
    if (user.id === currentUser.uid) {
      setError('You cannot review yourself.');
      setSelectedUser(null);
    } else {
      setSelectedUser(user);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comments) {
      setError('Please enter some comments.');
      return;
    }
    
    if (!selectedUser) {
      setError('Please select a user to review.');
      return;
    }
    
    try {
      await addDoc(collection(db, "peerReviews"), {
        comments,
        userId: selectedUser.id,
        reviewerId: currentUser.uid,
        createdAt: new Date(),
      });
      setComments('');
      setSelectedUser(null);
      setSearchText('');
      setSearchResults([]);
      setError('');
      alert('Review submitted successfully.');
    } catch (err) {
      setError('Failed to submit review. Please try again.');
      console.error(err);
    }
  };

  return (
    <Box className="container mt-5 form-container">
      <h2>Peer Review Form</h2>
      {error && <Typography color="error">{error}</Typography>}
      <Box component="form" onSubmit={handleSearch} noValidate sx={{ mt: 1 }}>
        <label>Find a student</label>
        <TextField
          fullWidth
          label="Search by Student's First Name, Student's Last Name, or Student's ID"
          type="textbox"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{ mt: 2, mb: 2 }}
        />
        <Button type="submit" variant="contained" sx={{ mb: 2 }}>
          Search
        </Button>
        {searchResults.length > 0 && (
          <Box sx={{ mt: 2, maxHeight: 200, overflowY: 'auto' }}>
            {searchResults.map((user) => (
              <Button 
                key={user.id} 
                variant="outlined"
                onClick={() => handleUserSelect(user)}
                sx={{
                  my: 1,
                  bgcolor: selectedUser?.id === user.id ? 'lightgreen' : 'inherit',
                  '&:hover': {
                    bgcolor: 'lightgreen',
                  }
                }}
              >
                {user.displayName || `${user.firstName} ${user.lastName}`}
              </Button>
            ))}
          </Box>
        )}
      </Box>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <label>Leave a review</label>
        <TextField
          fullWidth
          required
          multiline
          rows={4}
          name="Semester/Module/Peer Review"
          label="Semester/Module/Peer Review"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          sx={{ mt: 2 }}
        />
        <Button type="submit" fullWidth variant="contained" disabled={!selectedUser} sx={{ mt: 3, mb: 2 }}>
          Submit Review
        </Button>
      </Box>
    </Box>
  );
};

export default PeerReviewForm;
