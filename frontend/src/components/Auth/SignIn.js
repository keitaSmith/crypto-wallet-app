import React, { useState,useRef } from 'react';
import { auth } from '../../config/firebaseConfig.js';
import { useNavigate, Link } from 'react-router-dom';
import {signInWithEmailAndPassword } from 'firebase/auth';
import '../../styles/AuthForm.css'

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Create refs for each input field
  const passwordRef = useRef(null);

  const handleKeyPress = (e, nextRef) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent the form from submitting
      if (nextRef && nextRef.current) {
        nextRef.current.focus(); // Move focus to the next field
      }
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      alert(`Unexpected error: ${error.message}`);
    }
  };

  return (
    <div className="auth-form-container">
      <form onSubmit={handleSignIn} className="auth-form">
        <h2>Sign In</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="auth-input"
          onKeyPress={(e) => handleKeyPress(e, passwordRef)}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="auth-input"
          ref={passwordRef}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault(); // Prevent the form from submitting when pressing Enter on the last field
              handleSignIn(e); // Call the sign-in function
            }
          }}
        />
        <button type="submit" className="auth-button">Sign In</button>
        <p className="auth-link">Don't have an account? <Link to="/signup">Sign Up</Link></p>
      </form>
    </div>
  );
};

export default SignIn;
