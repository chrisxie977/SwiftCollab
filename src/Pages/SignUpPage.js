import React, { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase-config';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';

const SignUpPage = () => {
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    studentId: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { updateUserRole } = useAuth(); // Use the updateUserRole function from AuthContext

  const validateForm = () => {
    const newErrors = {};
    const nameRegex = /^[A-Za-z\s]+$/;
    const studentIdRegex = /^[0-9]{1,8}$/; 
    const emailRegex = /^[^\s@]+@(gmail\.com|yahoo\.com|outlook\.com|icloud\.com|hotmail\.com|student\.[\w-]+\.[\w-]+)$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!formValues.firstName || !nameRegex.test(formValues.firstName)) {
      newErrors.firstName = 'First name must contain only letters.';
    }

    if (!formValues.lastName || !nameRegex.test(formValues.lastName)) {
      newErrors.lastName = 'Last name must contain only letters.';
    }

    if (!formValues.email || !emailRegex.test(formValues.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formValues.role) {
      newErrors.role = 'Please select a role.';
    }

    if (formValues.role === 'student' && (!formValues.studentId || !studentIdRegex.test(formValues.studentId))) {
      newErrors.studentId = 'Student ID must be 8 numeric number.';
    }

    if (!formValues.password || !passwordRegex.test(formValues.password)) {
      newErrors.password = 'Password must be at least 8 characters long and include at least one letter and one number.';
    }

    if (formValues.password !== formValues.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prevState => ({ ...prevState, [name]: value }));
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formValues.email, formValues.password);
      const user = userCredential.user;
      await sendEmailVerification(user);

      const displayName = `${formValues.firstName} ${formValues.lastName}`;
      await setDoc(doc(db, 'users', user.uid), {
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        email: formValues.email,
        role: formValues.role,
        studentId: formValues.studentId,
        displayName: displayName,
      });

      // Update userRole in AuthContext
      await updateUserRole(user.uid, formValues.role); // Now using updateUserRole
      
      setLoading(false);
      navigate('/registration-success');
    } catch (error) {
      setLoading(false);
      setErrors({ ...errors, submit: "Failed to create account: " + error.message });
    }
  };

  return (
    <div className="container mt-5 form-container" sx={{ maxWidth: 800 }}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp} className="form-container">
        <input type="text" name="firstName" value={formValues.firstName} onChange={handleInputChange} placeholder="First Name" required />
        {errors.firstName && <p className="error-message">{errors.firstName}</p>}
        
        <input type="text" name="lastName" value={formValues.lastName} onChange={handleInputChange} placeholder="Last Name" required />
        {errors.lastName && <p className="error-message">{errors.lastName}</p>}
        
        <input type="email" name="email" value={formValues.email} onChange={handleInputChange} placeholder="Email" required />
        {errors.email && <p className="error-message">{errors.email}</p>}

        <select name="role" value={formValues.role} onChange={handleInputChange} required>
          <option value="">Select Role</option>
          <option value="student">Student</option>
          <option value="non-student">Non-Student</option>
        </select>

        {errors.role && <div className="text-danger">{errors.role}</div>}

        {formValues.role === 'student' && (
          <div className="form-group mb-3">
            <input className="form-control" type="text" name="studentId" value={formValues.studentId} onChange={handleInputChange}
             placeholder="Student ID" maxLength="8" required/>
            {errors.studentId && <div className="text-danger">{errors.studentId}</div>}
          </div>
        )}

        <input type="password" name="password" value={formValues.password} onChange={handleInputChange} placeholder="Password" required />
        {errors.password && <p className="error-message">{errors.password}</p>}
        
        <input type="password" name="confirmPassword" value={formValues.confirmPassword} onChange={handleInputChange} placeholder="Confirm Password" required />
        {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
        
        {errors.submit && <p className="error-message">{errors.submit}</p>}
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Signing Up...' : 'Sign Up'}</button>
      </form>
    </div>
  );
};

export default SignUpPage;
