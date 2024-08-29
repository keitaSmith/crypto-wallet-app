const User = require('../models/User'); // Ensure the path is correct
const admin = require('firebase-admin');
exports.signup = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create(email, password);
    res.status(201).json({ uid: user.uid, email: user.email });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Signup failed', error: error.message });
  }
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;
  try {

    // Verify the user by email using Firebase Authentication
    const userRecord = await admin.auth().getUserByEmail(email);


    // If password validation is successful, you can create a custom token:
    const token = await admin.auth().createCustomToken(userRecord.uid);

    res.status(200).json({ uid: userRecord.uid, email: userRecord.email, token });
  } catch (error) {
    console.error('Error during signin:', error);
    res.status(500).json({ message: 'Signin failed', error: error.message });
  }
};




