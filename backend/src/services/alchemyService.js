
const web3 = require('../config/alchemyConfig');

const getBalance = async (address) => {
  try {
    const balance = await web3.eth.getBalance(address);
    return web3.utils.fromWei(balance, "ether"); // Convert balance to Ether
  } catch (error) {
    console.error("Error fetching balance:", error);
    throw error;
  }
};

const sendTransaction = async (fromAddress, toAddress, amountInEther, privateKey) => {
  try {
    const nonce = await web3.eth.getTransactionCount(fromAddress, 'latest');
    const transaction = {
      to: toAddress,
      value: web3.utils.toWei(amountInEther.toString(), 'ether'),
      gas: 30000,
      nonce: nonce,
    };

    const signedTx = await web3.eth.accounts.signTransaction(transaction, privateKey);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    return receipt;
  } catch (error) {
    console.error("Error sending transaction:", error);
    throw error;
  }
};

module.exports = {
  getBalance,
  sendTransaction,
};