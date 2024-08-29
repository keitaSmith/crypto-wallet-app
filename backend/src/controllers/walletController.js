const Wallet = require('../models/Wallet');
const mongoose = require('mongoose');
const alchemyService = require('../services/alchemyService');
const EC = require('elliptic').ec;
const ethUtil = require('ethereumjs-util');

// Initialize the elliptic curve
const ec = new EC('secp256k1');

// Function to generate wallet keys and derive the Ethereum address
const generateWalletKeys = () => {
  // Generate a key pair
  const keyPair = ec.genKeyPair();

  // Get the public and private keys in hex format
  const publicKey = keyPair.getPublic('hex');
  const privateKey = keyPair.getPrivate('hex');

  // Derive the Ethereum address from the public key
  const publicKeyBuffer = Buffer.from(publicKey, 'hex');
  const addressBuffer = ethUtil.pubToAddress(publicKeyBuffer, true);
  const ethAddress = ethUtil.bufferToHex(addressBuffer);

  return { ethAddress, publicKey, privateKey };
};

exports.createWallet = async (req, res) => {
  try {
    const { walletName } = req.body;
    const userId = req.user.id;

    // Check if the user already has 3 wallets
    const walletCount = await Wallet.countDocuments({ userId });
    if (walletCount >= 3) {
      return res.status(400).json({ message: 'Maximum of 3 wallets allowed' });
    }

    const { ethAddress, publicKey, privateKey } = generateWalletKeys();

    const newWallet = new Wallet({
      userId,
      walletName,
      address: ethAddress, // Store the derived address
      publicKey,
      privateKey,
    });

    // Log the new wallet details before saving
    console.log('New Wallet to be saved:', newWallet);

    await newWallet.save();
    res.status(201).json(newWallet);
  } catch (err) {
    console.error('Error saving the wallet:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getWallets = async (req, res) => {
  try {
    const userId = req.user.id; // Ensure req.user.id is correctly set
    const wallets = await Wallet.find({ userId });
    res.status(200).json(wallets);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteWallet = async (req, res) => {
  try {
    const walletId = req.params.id;
    const objectId = new mongoose.Types.ObjectId(walletId);

    const wallet = await Wallet.findById(objectId);

    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    await wallet.deleteOne();
    res.status(200).json({ message: 'Wallet deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.sendTransaction = async (req, res) => {
  try {
    const { walletId, toAddress, amount } = req.body;
    const wallet = await Wallet.findById(walletId);

    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    // Ensure the correct address is used for sending the transaction
    const receipt = await alchemyService.sendTransaction(wallet.address, toAddress, amount, wallet.privateKey);
    res.status(200).json({ receipt });
  } catch (error) {
    res.status(500).json({ message: 'Error sending transaction', error: error.message });
  }
};

exports.getWalletBalance = async (req, res) => {
  try {
    const walletId = req.params.id;
    const wallet = await Wallet.findById(walletId);

    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    // Assume you have a service method to get balance
    const balance = await alchemyService.getBalance(wallet.address);

    res.status(200).json({ balance });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching balance', error: error.message });
  }
};
