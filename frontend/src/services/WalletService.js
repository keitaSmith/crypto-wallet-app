import axios from 'axios';
import {auth} from '../config/firebaseConfig';

const API_URL = 'http://localhost:5000/api/wallets';


// auth.currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
//     // Send token to your backend via AJAX or fetch API
//     console.log(idToken);
//   }).catch(function(error) {
//     // Handle error
//     console.log(error)
//   });

const WalletService = {
  createWallet: async (walletName) => {
    const token = await auth.currentUser.getIdToken(true); // Get the Firebase ID token
    const response = await axios.post(
      API_URL, 
      { walletName }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  getWallets: async () => {
    
        try {
          const token = await auth.currentUser.getIdToken(true); // Get the Firebase ID token
          console.log('ID Token:', token); // Ensure the token is correct
          const response = await axios.get(API_URL, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          return response.data;
        } catch (error) {
          console.error('Error in getWallets:', error.response || error.message);
          throw error;
        }
      },

  deleteWallet: async (walletId) => {
    const token = await auth.currentUser.getIdToken(true); // Get the Firebase ID token
    const response = await axios.delete(`${API_URL}/${walletId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
  getWalletBalance: async (walletId) => { // New function
    const token = await auth.currentUser.getIdToken(true);
    const response = await axios.get(`${API_URL}/${walletId}/balance`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.balance;
  },
  sendTransaction: async (walletId, toAddress, amount) => {
    const token = await auth.currentUser.getIdToken(true);
    const response = await axios.post(
      `${API_URL}/send`,
      { walletId, toAddress, amount },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
};

export default WalletService;