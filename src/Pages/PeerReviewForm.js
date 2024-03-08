import React, { useState } from 'react';
import { db } from '../firebase-config';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const PeerReviewForm = () => {
  const { currentUser } = useAuth();
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [comments, setComments] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchResults([]); // Clear previous search results
    setSelectedUser(null); // Clear selected user

    const usersRef = collection(db, "users");
    // Create queries for each field
    const queries = [
      query(usersRef, where("firstName", "==", searchText)),
      query(usersRef, where("lastName", "==", searchText)),
      query(usersRef, where("studentId", "==", searchText)),
    ];
    
    // Execute all queries in parallel
    const querySnapshots = await Promise.all(queries.map(q => getDocs(q)));
    const results = querySnapshots
      .flatMap(snapshot => snapshot.docs)
      .map(doc => ({ id: doc.id, ...doc.data() }));

    // Remove duplicates based on id
    const uniqueResults = Array.from(new Map(results.map(result => [result.id, result])).values());

    setSearchResults(uniqueResults);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comments) {
      alert('Please enter some comments.');
      return;
    }
    if (!selectedUser) {
      alert('Please select a user to review.');
      return;
    }
    
    // Add document to 'peerReviews' collection in Firestore
    await addDoc(collection(db, "peerReviews"), {
      comments: comments,
      userId: selectedUser.id, // The user being reviewed
      reviewerId: currentUser.uid, // The current logged-in user
      createdAt: new Date(),
    });
    setComments('');
    setSelectedUser(null);
    alert('Review submitted successfully.');
  };

  return (
    <Box className="container mt-5 form-container">
      <h2>Peer Review Form</h2>
      <Box component="form" onSubmit={handleSearch} noValidate sx={{ mt: 1 }}>
        <TextField
          fullWidth
          label="Search by First Name, Last Name, or Student ID"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" sx={{ mb: 2 }}>
          Search
        </Button>
        {searchResults.length > 0 && (
          <Box sx={{ mt: 2 }}>
            {searchResults.map((user) => (
              <Box key={user.id} sx={{ my: 1 }}>
                <Button variant="outlined" onClick={() => setSelectedUser(user)}>
                  {user.displayName || `${user.firstName} ${user.lastName}`}
                </Button>
              </Box>
            ))}
          </Box>
        )}
      </Box>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          fullWidth
          required
          multiline
          rows={4}
          name="comments"
          label="Comments"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          sx={{ mt: 3 }}
        />
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Submit Review
        </Button>
      </Box>
    </Box>
  );
};

export default PeerReviewForm;
