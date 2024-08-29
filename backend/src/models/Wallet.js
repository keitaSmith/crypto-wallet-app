const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: 'User',
    required: true,
  },
  walletName: {
    type: String,
    required: true,
  },
  address: { 
    type: String,
    required: true,
    unique: true, 
  },
  publicKey: {
    type: String,
    required: true,
  },
  privateKey: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const Wallet = mongoose.model('Wallet', walletSchema);
module.exports = Wallet;