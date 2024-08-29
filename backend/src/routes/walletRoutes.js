const express = require('express');
const {
  createWallet,
  getWallets,
  deleteWallet,
  getWalletBalance,
  sendTransaction
} = require('../controllers/walletController');
const authenticateUser = require('../middleware/authMiddleware');

const router = express.Router();

// Routes for wallet operations with authentication
router.post('/wallets', authenticateUser, createWallet);
router.get('/wallets', authenticateUser, getWallets);
router.delete('/wallets/:id', authenticateUser, deleteWallet);
router.get('/wallets/:id/balance', authenticateUser, getWalletBalance);
router.post('/wallets/send', authenticateUser, sendTransaction);

module.exports = router;