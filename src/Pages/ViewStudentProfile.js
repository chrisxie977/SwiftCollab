import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc
} from 'firebase/firestore';
import { CircularProgress, Box, Typography, TextField, Button, List, ListItem, ListItemText, Paper, Divider } from '@mui/material';

const ViewStudentProfile = () => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [bio, setBio] = useState({});
  const [selfEvaluations, setSelfEvaluations] = useState([]);
  const [peerReviews, setPeerReviews] = useState([]);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleSearch = async () => {
    setLoading(true);
    const usersRef = collection(db, 'users');
    const nameQuery = query(usersRef, where('firstName', '==', searchText));
    const lastNameQuery = query(usersRef, where('lastName', '==', searchText));
    const studentIdQuery = query(usersRef, where('studentId', '==', searchText));
    const displayNameQuery = query(usersRef, where('displayName', '==', searchText));

    const allQueries = [nameQuery, lastNameQuery, studentIdQuery, displayNameQuery];
    let uniqueUsers = new Map();

    for (const q of allQueries) {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const user = doc.data();
        uniqueUsers.set(user.email, user);
      });
    }

    setSearchResults(Array.from(uniqueUsers.values()));
    setLoading(false);
  };

  const fetchUserDetails = async (email) => {
    const usersQuery = query(collection(db, 'users'), where('email', '==', email));
    const usersSnapshot = await getDocs(usersQuery);
    if (!usersSnapshot.empty) {
      const userDoc = usersSnapshot.docs[0];
      const userId = userDoc.id;

      // Fetch user bio
      const bioDoc = await getDoc(doc(db, 'bios', userId));
      if (bioDoc.exists()) {
        setBio(bioDoc.data());
      } else {
        setBio({});
      }

      // Fetch user self evaluations
      const selfEvalsRef = collection(db, 'selfEvaluations', userId, 'evaluations');
      const selfEvalsSnap = await getDocs(selfEvalsRef);
      setSelfEvaluations(selfEvalsSnap.docs.map(doc => doc.data()));

      // Fetch user peer reviews
      const peerReviewsRef = collection(db, 'peerReviews');
      const peerReviewsQ = query(peerReviewsRef, where('userId', '==', userId));
      const peerReviewsSnap = await getDocs(peerReviewsQ);
      setPeerReviews(peerReviewsSnap.docs.map(doc => doc.data()));
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    fetchUserDetails(user.email);
  };

  useEffect(() => {
    if (selectedUser) {
      fetchUserDetails(selectedUser.email);
    }
  }, [selectedUser]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3} sx={{ maxWidth: 800, mx: 'auto' }}>
      {!selectedUser ? (
        <>
          <Typography variant="h4" gutterBottom>Search Profiles</Typography>
          <TextField
            label="Search by First Name, Last Name, Student ID, or Display Name"
            type="search"
            value={searchText}
            onChange={handleSearchChange}
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Button onClick={handleSearch} variant="contained" color="primary">Search</Button>
          <List sx={{ mt: 3 }}>
            {searchResults.map((user) => (
              <ListItem key={user.email} button onClick={() => handleSelectUser(user)}>
                <ListItemText primary={user.displayName || `${user.firstName} ${user.lastName}`} secondary={user.email} />
              </ListItem>
            ))}
          </List>
        </>
      ) : (
        <Paper elevation={3} sx={{ p: 2, my: 2 }}>
          <Typography variant="h4" gutterBottom>User Profile</Typography>
          <Typography variant="h5">{selectedUser.displayName}</Typography>
          <Typography variant="subtitle1">{selectedUser.email}</Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">Bio</Typography>
          <Typography>{bio.description || 'No bio available'}</Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">Self Evaluations</Typography>
          {selfEvaluations.length > 0 ? selfEvaluations.map((evaluation, index) => (
            <Typography key={index}>{evaluation.content}</Typography>
          )) : <Typography>No self evaluations available</Typography>}
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">Peer Reviews</Typography>
          {peerReviews.length > 0 ? peerReviews.map((review, index) => (
            <Typography key={index}>{review.comments}</Typography>
          )) : <Typography>No peer reviews available</Typography>}
          <Button onClick={() => setSelectedUser(null)} variant="contained" sx={{ bgcolor: '#1976D2' }}>
            Back to Search
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default ViewStudentProfile;
