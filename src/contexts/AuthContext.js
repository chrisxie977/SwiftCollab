import React, { useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase-config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

// Provides authentication data and methods to child components
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null); // State to store the current user object
  const [userRole, setUserRole] = useState(null); // State to store the current user's role
  const [loading, setLoading] = useState(true); // State to manage loading status during async operations

  useEffect(() => {
    // Listen for authentication state changes and update state accordingly
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // If a user is logged in, fetch their document from Firestore to get their role
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          // If the document exists, update the userRole state with the user's role
          const userData = userDoc.data();
          setUserRole(userData.role);
        }
      } else {
        // If no user is logged in, set the userRole to null
        setUserRole(null);
      }
      setCurrentUser(user); // Update the currentUser state with the user object or null
      setLoading(false); // Set loading to false as the async operation is complete
    });
    return unsubscribe; // Return the unsubscribe function to clean up the subscription
  }, []);

  // Function to update a user's role in Firestore and in state
  const updateUserRole = async (uid, role) => {
    const userDocRef = doc(db, 'users', uid); // Reference to the user's document in Firestore
    await setDoc(userDocRef, { role }, { merge: true }); // Update or set the user's role in their document
    setUserRole(role); // Update the userRole state with the new role
  };

  const value = { currentUser, userRole, updateUserRole }; // The value provided to consumers of the auth context

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} 
    </AuthContext.Provider>
  );
}
