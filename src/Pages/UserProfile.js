import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase-config';
import { doc, getDoc, collection, query, orderBy, getDocs, where } from 'firebase/firestore';
import { CircularProgress, Box, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';

const UserProfile = () => {
  const { currentUser } = useAuth();
  const [bio, setBio] = useState({});
  const [selfEvaluations, setSelfEvaluations] = useState([]);
  const [peerReviews, setPeerReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!currentUser) return;

      setLoading(true);

      // Fetch bio
      const bioRef = doc(db, "bios", currentUser.uid);
      const bioSnap = await getDoc(bioRef);
      if (bioSnap.exists()) {
        setBio(bioSnap.data());
      } else {
        setBio({ bio: 'No bio available', skills: 'No skills provided', achievements: 'No achievements listed' });
      }

      // Fetch self-evaluations
      const selfEvalsRef = collection(db, "selfEvaluations", currentUser.uid, "evaluations");
      const selfEvalsQuery = query(selfEvalsRef, orderBy("createdAt", "desc"));
      const selfEvalsSnapshot = await getDocs(selfEvalsQuery);
      setSelfEvaluations(selfEvalsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // Fetch peer reviews
      const reviewsRef = collection(db, "peerReviews");
      const reviewsQuery = query(reviewsRef, where("userId", "==", currentUser.uid), orderBy("createdAt", "desc"));
      const reviewsSnapshot = await getDocs(reviewsQuery);
      setPeerReviews(reviewsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      setLoading(false);
    };

    fetchProfileData();
  }, [currentUser]);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}><CircularProgress /></Box>;
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>User Profile</Typography>
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Email</Typography>
        <Typography>{currentUser?.email}</Typography>
        <Typography variant="h6" mt={2}>Bio</Typography>
        <Typography>{bio.bio}</Typography>
        <Typography variant="h6" mt={2}>Skills</Typography>
        <Typography>{bio.skills}</Typography>
        <Typography variant="h6" mt={2}>Achievements</Typography>
        <Typography>{bio.achievements}</Typography>
      </Paper>
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Self-Evaluations</Typography>
        <List>
          {selfEvaluations.length > 0 ? selfEvaluations.map(evaluation => (
            <ListItem key={evaluation.id}>
              <ListItemText
                primary={evaluation.content || 'No content provided'}
                secondary={evaluation.createdAt?.toDate().toLocaleString() || 'No date'}
              />
            </ListItem>
          )) : <Typography>No self-evaluations submitted.</Typography>}
        </List>
      </Paper>
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="h6">Peer Reviews</Typography>
        <List>
          {peerReviews.length > 0 ? peerReviews.map(review => (
            <ListItem key={review.id}>
              <ListItemText
                primary={review.comments || 'No comments provided'}
                secondary={`From user ID: ${review.reviewerId} - ${review.createdAt?.toDate().toLocaleString() || 'No date'}`}
              />
            </ListItem>
          )) : <Typography>No peer reviews received.</Typography>}
        </List>
      </Paper>
    </Box>
  );
};

export default UserProfile;
