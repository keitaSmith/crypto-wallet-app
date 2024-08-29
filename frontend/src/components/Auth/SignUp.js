import React, { useState,useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; // Import these functions
import { auth,db } from '../../config/firebaseConfig';
import '../../styles/AuthForm.css'; // Import the CSS file

const SignUp = () => {
  const [username, setUsername] = useState(''); // Changed from 'name' to 'username'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  // Create refs for each input field
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const handleKeyPress = (e, nextRef) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent the form from submitting
      if (nextRef && nextRef.current) {
        nextRef.current.focus(); // Move focus to the next field
      }
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match. Please try again.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store additional user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        username: username, // Changed to 'username'
        email: email,
      });

      navigate('/');
    } catch (error) {
      alert(`Unexpected error: ${error.message}`);
    }
  };

  return (
    <div className="auth-form-container">
      <form onSubmit={handleSignUp} className="auth-form">
        <h2>Sign Up</h2>
        <input
          type="text"
          value={username} // Changed from 'name' to 'username'
          onChange={(e) => setUsername(e.target.value)} // Updated setter
          placeholder="Username" // Changed placeholder to 'Username'
          className="auth-input"
          onKeyPress={(e) => handleKeyPress(e, emailRef)}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="auth-input"
          ref={emailRef}
          onKeyPress={(e) => handleKeyPress(e, passwordRef)}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="auth-input"
          ref={passwordRef}
          onKeyPress={(e) => handleKeyPress(e, confirmPasswordRef)}
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          className="auth-input"
          ref={confirmPasswordRef}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault(); // Prevent the form from submitting when pressing Enter on the last field
              handleSignUp(e); // Call the sign-up function
            }
          }}
        />
        <button type="submit" className="auth-button">Sign Up</button>
        <p className="auth-link">Already have an account? <Link to="/signin">Sign In</Link></p>
      </form>
    </div>
  );
};

export default SignUp;