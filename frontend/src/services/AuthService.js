import { getAuth, signOut } from 'firebase/auth';

class AuthService {
  constructor() {
    this.auth = getAuth();
  }

  // Method to log out the user
  logout() {
    return signOut(this.auth);
  }

  // Method to get the current user (if needed)
  getCurrentUser() {
    return this.auth.currentUser;
  }

  // Add other authentication-related methods if necessary
}
const authService = new AuthService();
export default authService;