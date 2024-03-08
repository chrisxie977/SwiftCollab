import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase-config';
import {
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  getDocs,
  where,
  Timestamp,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { CircularProgress, Box, Typography, Paper, List, ListItem, ListItemText, Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';

const UserProfile = () => {
  const { currentUser } = useAuth();
  const [bio, setBio] = useState({});
  const [selfEvaluations, setSelfEvaluations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportReviewId, setReportReviewId] = useState('');

  useEffect(() => {
    if (currentUser) {
      fetchProfileData();
    }
  }, [currentUser]);

  const fetchProfileData = async () => {
    setLoading(true);
    await fetchBio();
    await fetchSelfEvaluations();
    await fetchReviews();
    setLoading(false);
  };

  const fetchBio = async () => {
    const bioRef = doc(db, "bios", currentUser.uid);
    const bioSnap = await getDoc(bioRef);
    if (bioSnap.exists()) {
      setBio(bioSnap.data());
    }
  };

  const fetchSelfEvaluations = async () => {
    const selfEvalsRef = collection(db, "selfEvaluations", currentUser.uid, "evaluations");
    const selfEvalsQuery = query(selfEvalsRef, orderBy("createdAt", "desc"));
    const selfEvalsSnapshot = await getDocs(selfEvalsQuery);
    const evaluations = selfEvalsSnapshot.docs.map(doc => {
      const data = doc.data();
      data.createdAt = data.createdAt ? new Timestamp(data.createdAt.seconds, data.createdAt.nanoseconds).toDate().toLocaleString() : 'No date';
      return { id: doc.id, ...data };
    });
    setSelfEvaluations(evaluations);
  };

  const fetchReviews = async () => {
    const reviewsRef = collection(db, "peerReviews");
    const reviewsQuery = query(reviewsRef, where("userId", "==", currentUser.uid), orderBy("createdAt", "desc"));
    const reviewsSnapshot = await getDocs(reviewsQuery);
    const fetchedReviews = await Promise.all(reviewsSnapshot.docs.map(async docSnapshot => {
      const review = docSnapshot.data();
      review.createdAt = review.createdAt ? new Timestamp(review.createdAt.seconds, review.createdAt.nanoseconds).toDate().toLocaleString() : 'No date';
      const reviewerRef = doc(db, "users", review.reviewerId);
      const reviewerSnap = await getDoc(reviewerRef);
      review.reviewerName = reviewerSnap.exists() ? reviewerSnap.data().displayName : 'Unknown User';
      return { id: docSnapshot.id, ...review };
    }));
    setReviews(fetchedReviews);
  };

  const handleAction = async (reviewId, action) => {
    const reviewRef = doc(db, "peerReviews", reviewId);
    try {
      if (action === "approve") {
        await updateDoc(reviewRef, { status: "approved" });
        setReviews(reviews => reviews.map(r => r.id === reviewId ? { ...r, status: "approved" } : r));
      } else if (action === "reject") {
        await deleteDoc(reviewRef);
        setReviews(reviews => reviews.filter(r => r.id !== reviewId));
      } else if (action === "reportAbuse") {
        // Open the report dialog and save the reviewId to state
        setReportReviewId(reviewId); // Save the review id for later
        setReportDialogOpen(true); // Open the dialog for user to choose report reason
      }
    } catch (error) {
      console.error("Error handling action:", error);
    }
  };

  const isReviewApproved = (status) => {
    return status === 'approved';
  };

  const isReviewUnderReview = (status) => {
    return status === 'reported';
  };
  
  const handleReportDialogClose = () => {
    // Reset the report dialog state when closed
    setReportDialogOpen(false);
    setReportReason('');
    setReportReviewId('');
  };

  const handleReportSubmit = async () => {
    if (!reportReason) {
      alert('Please select a reason for reporting abuse.');
      return;
    }
    const reviewRef = doc(db, "peerReviews", reportReviewId);
    await updateDoc(reviewRef, {
      status: "reported",
      reportReason: reportReason
    });
    // Update the review locally to reflect the report status
    setReviews(reviews.map(r => r.id === reportReviewId ? { ...r, status: "reported" } : r));
    handleReportDialogClose();
  };

  const isReviewReported = (status) => {
    return status === 'reported';
  };

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
        <Typography>{bio.bio || 'No bio provided'}</Typography>
        <Typography variant="h6" mt={2}>Skills</Typography>
        <Typography>{bio.skills || 'No skills provided'}</Typography>
        <Typography variant="h6" mt={2}>Achievements</Typography>
        <Typography>{bio.achievements || 'No achievements provided'}</Typography>
        <Typography variant="h6" mt={2}>Interests</Typography>
        <Typography>{bio.interests || 'No interests provided'}</Typography>
        <Typography variant="h6" mt={2}>Career Goals</Typography>
        <Typography>{bio.careerGoals || 'No career goals set'}</Typography>
      </Paper>
      
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Self-Evaluations</Typography>
        <List>
          {selfEvaluations.length > 0 ? selfEvaluations.map(evaluation => (
            <ListItem key={evaluation.id}>
              <ListItemText
                primary={evaluation.content || 'No content provided'}
                secondary={evaluation.createdAt || 'No date provided'}
              />
            </ListItem>
          )) : <Typography>No self-evaluations submitted.</Typography>}
        </List>
      </Paper>
      

      {/* Reviews List */}
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="h6">Reviews</Typography>
        <List>
          {reviews.length > 0 ? reviews.map(review => (
            <ListItem 
              key={review.id} 
              sx={{ mb: 2, bgcolor: isReviewUnderReview(review.status) ? 'grey.300' : 'none' }}>
              <ListItemText
                primary={review.comments || 'No comments provided'}
                secondary={`From: ${review.reviewerName} - ${review.createdAt || 'No date provided'}`}
              />
              {!isReviewApproved(review.status) && !isReviewUnderReview(review.status) && (
                <>
                  <Button onClick={() => handleAction(review.id, 'approve')} sx={{ mr: 1 }} variant="contained" color="success">
                    Approve
                  </Button>
                  <Button onClick={() => handleAction(review.id, 'reject')} sx={{ mr: 1 }} variant="contained" color="warning">
                    Reject
                  </Button>
                  <Button onClick={() => handleAction(review.id, 'reportAbuse')} variant="contained" color="error">
                    Report Abuse
                  </Button>
                </>
              )}
              {isReviewUnderReview(review.status) && (
                <Button variant="contained" disabled>
                  Under Review
                </Button>
              )}
            </ListItem>
          )) : <Typography>No reviews to display.</Typography>}
        </List>
      </Paper>

      <Dialog open={reportDialogOpen} onClose={handleReportDialogClose}>
        <DialogTitle>Report Abuse</DialogTitle>
        <DialogContent>
          <FormControl component="fieldset">
            <RadioGroup
              aria-label="report-reason"
              name="report-reason"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            >
              <FormControlLabel value="spam" control={<Radio />} label="Spam" />
              <FormControlLabel value="harassment" control={<Radio />} label="Harassment" />
              <FormControlLabel value="inappropriate" control={<Radio />} label="Inappropriate Content" />
              <FormControlLabel value="other" control={<Radio />} label="Other" />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReportDialogClose}>Cancel</Button>
          <Button onClick={handleReportSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserProfile;
