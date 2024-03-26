import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase-config';
import { doc, getDoc } from 'firebase/firestore';

const HomePage = () => {
  const { currentUser } = useAuth();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Function to fetch user data
    const fetchUserData = async () => {
      if (currentUser?.uid) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserName(userDoc.data().displayName || '');
        } else {
          console.log('No such document!');
        }
      }
    };
    
    fetchUserData();
  }, [currentUser]);

  return (
    <div className="container mt-5 text-center">
      <h1 className="display-4">Welcome to SwiftCollab!</h1>
      <p className="lead">The place where teamwork and reviews come together.</p>
      {userName && <p className="fst-italic">Welcome back, {userName}!</p>}
      <div>
        <p>Explore projects, collaborate with peers, and build your professional network.</p>
        <p>Join SwiftCollab to enhance your teamwork experience.</p>
      </div>
    </div>
  );
};

export default HomePage;
