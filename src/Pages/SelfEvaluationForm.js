import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase-config';
import { collection, addDoc } from 'firebase/firestore';
import { TextField, Box, Button, Typography } from '@mui/material';

const SelfEvaluationForm = () => {
  const { currentUser } = useAuth();
  const [evaluation, setEvaluation] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("You must be logged in to submit your self-evaluation.");
      return;
    }

    try {
      await addDoc(collection(db, "selfEvaluations", currentUser.uid, "evaluations"), {
        content: evaluation,
        createdAt: new Date(),
      });
      alert('Self-evaluation submitted successfully.');
      setEvaluation('');
    } catch (error) {
      console.error("Error submitting self-evaluation: ", error);
      alert("Error submitting self-evaluation: " + error.message);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{ mt: 1 }}
      className="container mt-5 form-container">
      <h2>Self-Evaluation</h2>
      <div className="form-container">
        <label>Leave a self-evaluation</label>
      <TextField
        label="Semester/Module/Your Self-Evaluation"
        multiline
        fullWidth
        rows={4}
        value={evaluation}
        onChange={(e) => setEvaluation(e.target.value)}
        margin="normal"
        required
      />
      <Box textAlign="center" sx={{ mt: 2 }}>
        <Button type="submit" variant="contained" color="primary">
          Submit Evaluation
        </Button>
      </Box>
      </div>
    </Box>
  );
};

export default SelfEvaluationForm;
