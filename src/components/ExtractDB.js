import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase-config'; // Import your Firebase configuration and initialize Firebase

const ExtractDB = () => {
  const { currentUser } = useAuth();
  let userName;

  async function fetchDataFromFirebase() {
      try {
          const querySnapshot = await getDocs(collection(db, 'users')); // Replace 'your_collection_name' with your collection name
          let extractedData = [];
  
          querySnapshot.forEach((doc) => {
              // Extract the value from a specific field in each document
              let fieldValue = doc.data().firstName; // Replace 'field_name' with the name of the field you want to extract
              extractedData.push(fieldValue);
          });
          userName = extractedData[0]; // Assign to the global variable
          displayUserName(); // Call the function to display the user name
          return userName;
      } catch (error) {
        console.error('Error fetching data:', error);
          return null;
      }
  };
  
  function displayUserName() {
    // Get the element with the id "user-name-display"
    const userNameDisplay = document.getElementById("user-name-display");
    
    // Update the content of the element with the value of the userName variable
    if (userNameDisplay) {
        userNameDisplay.textContent = userName || "No user name available";
    }
  };

  fetchDataFromFirebase();

  return userName;
};

export default ExtractDB();
