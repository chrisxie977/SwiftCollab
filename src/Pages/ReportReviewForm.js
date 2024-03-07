import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase-config';
import { collection, addDoc } from 'firebase/firestore';

const ReportReviewForm = () => {
  const { currentUser } = useAuth();
  const [reportDetails, setReportDetails] = useState({
    reviewId: '',
    reason: '',
    details: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("You must be logged in to report a review.");
      return;
    }

    try {
      await addDoc(collection(db, "reports"), {
        ...reportDetails,
        userId: currentUser.uid,
        createdAt: new Date(),
      });
      alert('Report submitted successfully.');
      setReportDetails({ reviewId: '', reason: '', details: '' }); // Reset the form fields
    } catch (error) {
      alert("Error submitting report: " + error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReportDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
  };

  return (
    <div className="container mt-5">
      <h2>Report a Review</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <input
          type="text"
          name="reviewId"
          value={reportDetails.reviewId}
          onChange={handleChange}
          placeholder="Review ID"
          required
        />
        <select
          name="reason"
          value={reportDetails.reason}
          onChange={handleChange}
          required
        >
          <option value="">Select a Reason</option>
          <option value="spam">Spam</option>
          <option value="inappropriate">Inappropriate Content</option>
          <option value="harassment">Harassment</option>
          <option value="other">Other</option>
        </select>
        <textarea
          name="details"
          value={reportDetails.details}
          onChange={handleChange}
          placeholder="Additional details"
          required
        />
        <button type="submit">Submit Report</button>
      </form>
    </div>
  );
};

export default ReportReviewForm;
