import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase-config'; // Make sure the path to your firebase-config is correct
import {onAuthStateChanged} from 'firebase/auth';

const Footer = () => {

  const [ session, setSession ] = useState('');

 useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (res) => {
      if (res?.accessToken) {
        setSession('true');
      } else {
        setSession('false');
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
    {session === 'true'? null : (
    <footer className="footer bg-dark text-light mt-5">
      <div className="container text-center py-3">
        <Link to="/terms" className="text-light">Terms of Use</Link> | 
        <Link to="/privacy" className="text-light"> Privacy Policy</Link> | 
        <Link to="/cookies" className="text-light"> Cookie Policy</Link> |
        <Link to="/about-us" className="text-light"> About Us</Link>
        <div>
          &copy; {new Date().getFullYear()} SwiftCollab
        </div>
      </div>
    </footer>
  )}
  </>
  );
};

export default Footer;
