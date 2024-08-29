const admin = require('firebase-admin');

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    const idToken = authHeader.replace('Bearer ', '');
    console.log('ID Token received by backend:', idToken);

    // Verify the ID token using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log('Decoded Token:', decodedToken);
    req.user = { id: decodedToken.uid };
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    res.status(401).json({ message: 'Token is not valid', error: error.message });
  }
};

module.exports = authenticateUser;
