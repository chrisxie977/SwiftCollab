import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase-config';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    studentId: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (formValues.password !== formValues.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formValues.email, formValues.password);
      const user = userCredential.user;
      await setDoc(doc(db, 'users', user.uid), {
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        email: formValues.email,
        studentId: formValues.studentId,
        // Include additional fields as necessary
      });
      navigate('/registration-success');
    } catch (error) {
      alert("Failed to create account: " + error.message);
    }
  };

  return (
    <div className="page-container">
      <h2 className="form-heading">Sign Up</h2>
      <form onSubmit={handleSignUp} className="form-container">
        <input type="text" name="firstName" value={formValues.firstName} onChange={handleInputChange} placeholder="First Name" required />
        <input type="text" name="lastName" value={formValues.lastName} onChange={handleInputChange} placeholder="Last Name" required />
        <input type="email" name="email" value={formValues.email} onChange={handleInputChange} placeholder="Email" required />
        <input type="text" name="studentId" value={formValues.studentId} onChange={handleInputChange} placeholder="Student ID" required />
        <input type="password" name="password" value={formValues.password} onChange={handleInputChange} placeholder="Password" required />
        <input type="password" name="confirmPassword" value={formValues.confirmPassword} onChange={handleInputChange} placeholder="Confirm Password" required />
        <button type="submit" className="btn btn-primary">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpPage;
