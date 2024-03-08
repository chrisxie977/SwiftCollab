import React, { useEffect, useState } from 'react';
import { db } from '../firebase-config';
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc, // make sure this is imported correctly
  getDoc,
} from 'firebase/firestore';
import { CircularProgress, Box, Typography, Paper, List, ListItem, ListItemText, Button } from '@mui/material';

const AdminPage = () => {
  const [reportedReviews, setReportedReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportedReviews();
  }, []);

  const fetchReportedReviews = async () => {
    setLoading(true);
    const reportedReviewsRef = collection(db, "peerReviews");
    const q = query(reportedReviewsRef, where("status", "==", "reported"));
    const querySnapshot = await getDocs(q);

    const reviewsData = await Promise.all(querySnapshot.docs.map(async (docSnapshot) => {
      const reviewData = docSnapshot.data();
      const reviewerSnap = await getDoc(doc(db, "users", reviewData.reviewerId));
      const profileSnap = await getDoc(doc(db, "users", reviewData.userId)); // Fetching the profile for which the review is made.

      return {
        id: docSnapshot.id,
        comments: reviewData.comments,
        reviewerName: reviewerSnap.exists() ? reviewerSnap.data().displayName : "Unknown",
        reportReason: reviewData.reportReason,
        profileName: profileSnap.exists() ? profileSnap.data().displayName : "Unknown", // This assumes that the profile's display name is saved in the 'displayName' field
      };
    }));

    setReportedReviews(reviewsData);
    setLoading(false);
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteDoc(doc(db, "peerReviews", reviewId));
      setReportedReviews(reportedReviews.filter((review) => review.id !== reviewId));
      alert('Review deleted successfully.');
    } catch (error) {
      console.error("Error deleting review: ", error);
      alert("Error deleting review: " + error.message);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Admin Page</Typography>
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="h6">Reported Reviews</Typography>
        <List>
          {reportedReviews.map((review) => (
            <ListItem key={review.id} sx={{ mb: 2, border: '1px solid', borderRadius: '4px' }}>
              <ListItemText
                primary={review.comments || 'No comments provided'}
                secondary={`Reviewer: ${review.reviewerName} | Profile: ${review.profileName} | Report Reason: ${review.reportReason}`}
              />
              <Button
                onClick={() => handleDeleteReview(review.id)}
                sx={{ bgcolor: 'red', color: 'white', ml: 2 }}
                variant="contained"
              >
                Delete
              </Button>
            </ListItem>
          ))}
        </List>
        {reportedReviews.length === 0 && <Typography>No reported reviews.</Typography>}
      </Paper>
    </Box>
  );
};

export default AdminPage;
