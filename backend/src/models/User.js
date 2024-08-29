const { admin, db } = require('../config/firebaseConfig');

class User {
  // Method to create a new user
  static async create(email, password) {
    try {
      // Create user with Firebase Authentication
      const userRecord = await admin.auth().createUser({
        email,
        password,
      });

      // Store additional user data in Firestore
      const userRef = db.collection('users').doc(userRecord.uid);
      await userRef.set({
        email: userRecord.email,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return userRecord; // Return the created user record
    } catch (error) {
      throw new Error('Error creating user: ' + error.message);
    }
  }

  // Method to retrieve a user from Firestore by UID
  static async getByUid(uid) {
    const userRef = db.collection('users').doc(uid);
    const doc = await userRef.get();

    if (!doc.exists) {
      throw new Error('No such user!');
    }
    
    return doc.data();
  }
}

module.exports = User;