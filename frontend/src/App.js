import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate  } from 'react-router-dom';
import SignUp from './components/Auth/SignUp';
import SignIn from './components/Auth/SignIn';
import MainApp from './pages/MainApp';
import { auth } from './config/firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';

const App = () => {
  const [user] = useAuthState(auth);

  return (
    <Router>
      <Routes>
        <Route
          path="/signup"
          element={!user ? <SignUp /> : <Navigate to="/" />}
        />
        <Route
          path="/signin"
          element={!user ? <SignIn /> : <Navigate to="/" />}
        />
        <Route
          path="/"
          element={user ? <MainApp /> : <Navigate to="/signin" />}
        />
        <Route path="*" element={<Navigate to={user ? "/" : "/signin"} />} />
      </Routes>
    </Router>
  );
};

export default App;
