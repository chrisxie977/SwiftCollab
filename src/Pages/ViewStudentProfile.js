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
import {
  CircularProgress,
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  Divider
} from '@mui/material';

const ViewStudentProfile = () => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [profileDetails, setProfileDetails] = useState({});
  const [selfEvaluations, setSelfEvaluations] = useState([]);
  const [peerReviews, setPeerReviews] = useState([]);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleSearch = async () => {
    setLoading(true);
    const usersRef = collection(db, 'users');
    const queries = [
      query(usersRef, where('firstName', '>=', searchText), where('firstName', '<=', searchText + '\uf8ff')),
      query(usersRef, where('lastName', '>=', searchText), where('lastName', '<=', searchText + '\uf8ff')),
      query(usersRef, where('displayName', '>=', searchText), where('displayName', '<=', searchText + '\uf8ff')),
      query(usersRef, where('studentId', '==', searchText)),
    ];
    
    const querySnapshots = await Promise.all(queries.map(q => getDocs(q)));
    const users = querySnapshots
      .flatMap(snapshot => snapshot.docs)
      .map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Filter unique users based on id
    const uniqueUsers = Array.from(new Map(users.map(user => [user.id, user])).values());

    setSearchResults(uniqueUsers);
    setLoading(false);
  };

  const fetchUserDetails = async (userId) => {
    setLoading(true);

    // Fetch user bio and additional details
    const bioRef = doc(db, 'bios', userId);
    const bioSnap = await getDoc(bioRef);
    const bioData = bioSnap.exists() ? bioSnap.data() : null;

    // Fetch user self evaluations
    const selfEvalsRef = collection(db, 'selfEvaluations', userId, 'evaluations');
    const selfEvalsSnap = await getDocs(selfEvalsRef);
    const selfEvalsData = selfEvalsSnap.docs.map(doc => doc.data());

    // Fetch user peer reviews
    const peerReviewsRef = collection(db, 'peerReviews');
    const peerReviewsSnap = await getDocs(query(peerReviewsRef, where('userId', '==', userId)));
    const peerReviewsData = peerReviewsSnap.docs.map(doc => doc.data());

    setProfileDetails(bioData);
    setSelfEvaluations(selfEvalsData);
    setPeerReviews(peerReviewsData);

    setLoading(false);
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    fetchUserDetails(user.id);
  };

  useEffect(() => {
    if (selectedUser) {
      fetchUserDetails(selectedUser.id);
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
    <Box className="container mt-5 form-container">
      {!selectedUser ? (
        <>
          <h2>Search Profiles</h2>
          <div className="form-container">
            <label>Search for a student profile</label>
          <TextField
            label="Search by Student's First Name, Student's Last Name or Student's ID"
            type="search"
            value={searchText}
            onChange={handleSearchChange}
            fullWidth
            variant="outlined"
            sx={{ mt: 2, mb: 2 }}
          />
          <Button onClick={handleSearch} variant="contained" color="primary">Search</Button>
          <List sx={{ mt: 3 }}>
            {searchResults.map((user) => (
              <ListItem key={user.email} button onClick={() => handleSelectUser(user)}>
                <ListItemText primary={user.displayName} secondary={`Student ID: ${user.studentId}`} />
              </ListItem>
            ))}
          </List>
          </div>
        </>
      ) : (
        <Paper elevation={3} sx={{ p: 2, my: 2 }}>
          <Typography variant="h4" gutterBottom>User Profile</Typography>
          <Typography variant="h5">{selectedUser.displayName}</Typography>
          <Typography variant="subtitle1">{`Student ID: ${selectedUser.studentId}`}</Typography>
          <Divider sx={{ my: 2 }} />
          {profileDetails && (
            <>
              <Typography variant="h6">Bio</Typography>
              <Typography>{profileDetails.bio || 'No bio available'}</Typography>
              <Typography variant="h6">Achievements</Typography>
              <Typography>{profileDetails.achievements || 'No achievements available'}</Typography>
              <Typography variant="h6">Career Goals</Typography>
              <Typography>{profileDetails.careerGoals || 'No career goals available'}</Typography>
              <Typography variant="h6">Interests</Typography>
              <Typography>{profileDetails.interests || 'No interests available'}</Typography>
              <Typography variant="h6">Skills</Typography>
              <Typography>{profileDetails.skills || 'No skills available'}</Typography>
              <Divider sx={{ my: 2 }} />
            </>
          )}
          <Typography variant="h6">Self Evaluations</Typography>
          {selfEvaluations.length > 0 ? selfEvaluations.map((evaluation, index) => (
            <Typography key={index}>{evaluation.content}</Typography>
          )) : <Typography>No self evaluations available</Typography>}
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">Peer Reviews</Typography>
          {peerReviews.length > 0 ? peerReviews.map((review, index) => (
            <Typography key={index}>{review.comments}</Typography>
          )) : <Typography>No peer reviews available</Typography>}
          <Button onClick={() => setSelectedUser(null)} variant="contained" sx={{ mt: 2 }}>
            Back to Search
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default ViewStudentProfile;
