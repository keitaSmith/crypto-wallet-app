import React from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/AuthService';
import WalletService from '../services/WalletService';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';
import '../styles/MainApp.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import CryptoTrends from '../components/Crypto/CryptoTrends';

class MainApp extends React.Component {
  constructor(props) {
    super(props);
    this.authService = authService;
    this.navigate = props.navigate;
    this.state = {
      userData: null,
      wallets: [],
      walletName: '',
      revealKeys: {},
      balances: {}, // State to store balances for each wallet
      refreshing: {}, // State to track refreshing status
      recipientAddress: '', // State to track recipient address
      sendAmount: '', // State to track send amount
      selectedWallet: '', // State to track the selected wallet for sending transaction
    };
  }

  async componentDidMount() {
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        this.setState({ userData: docSnap.data() });
        this.fetchWallets();
      } else {
        console.log('No such document!');
      }
    }
  }

  fetchWallets = async () => {
    try {
      const wallets = await WalletService.getWallets();
      this.setState({ wallets }, this.fetchAllBalances);
    } catch (error) {
      console.error('Error fetching wallets:', error);
    }
  };

  fetchAllBalances = async () => {
    const { wallets } = this.state;
    const balances = {};
  
    for (let wallet of wallets) {
      const balance = await WalletService.getWalletBalance(wallet._id);
      balances[wallet._id] = balance;
    }
  
    this.setState({ balances });
  };

  handleCreateWallet = async () => {
    try {
      const { walletName, wallets } = this.state;
      const newWallet = await WalletService.createWallet(walletName);
      this.setState({ wallets: [...wallets, newWallet], walletName: '' }, this.fetchAllBalances);
    } catch (error) {
      console.error('Error creating wallet:', error);
    }
  };

  handleDeleteWallet = async (walletId) => {
    try {
      await WalletService.deleteWallet(walletId);
      this.setState({ wallets: this.state.wallets.filter(wallet => wallet._id !== walletId) });
    } catch (error) {
      console.error('Error deleting wallet:', error);
    }
  };

  toggleRevealKeys = (walletId) => {
    this.setState((prevState) => ({
      revealKeys: {
        ...prevState.revealKeys,
        [walletId]: !prevState.revealKeys[walletId],
      }
    }));
  };

  handleLogout = async () => {
    try {
      await this.authService.logout();
      this.navigate('/signin');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard');
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  };

  refreshBalance = async (walletId) => {
    try {
      // Set the refreshing state for the specific wallet to true
      this.setState(prevState => ({
        refreshing: {
          ...prevState.refreshing,
          [walletId]: true,
        }
      }));
  
      // Fetch the balance for the specific wallet
      const balance = await WalletService.getWalletBalance(walletId);
  
      // Update the balance for the specific wallet
      this.setState(prevState => ({
        balances: {
          ...prevState.balances,
          [walletId]: balance,
        },
        refreshing: {
          ...prevState.refreshing,
          [walletId]: false, // Set the refreshing state to false after completion
        }
      }));
  
      // Fetch and update balances for all wallets
      await this.fetchAllBalances();
    } catch (error) {
      console.error('Error refreshing balance:', error);
      this.setState(prevState => ({
        refreshing: {
          ...prevState.refreshing,
          [walletId]: false, // Ensure the spinner stops even on error
        }
      }));
    }
  };

  // Handler to change the recipient address
  handleRecipientAddressChange = (e) => {
    this.setState({ recipientAddress: e.target.value });
  };

  // Handler to change the amount to send
  handleSendAmountChange = (e) => {
    this.setState({ sendAmount: e.target.value });
  };

  // Handler to send transaction
  handleSendTransaction = async (walletId) => {
    try {
      const { recipientAddress, sendAmount } = this.state;
      await WalletService.sendTransaction(walletId, recipientAddress, sendAmount);
      alert('Transaction successful!');
      this.fetchAllBalances(); // Refresh balances after sending
    } catch (error) {
      console.error('Error sending transaction:', error);
      alert('Transaction failed!');
    }
  };

  render() {
    const { userData, wallets, walletName, revealKeys, balances, refreshing, recipientAddress, sendAmount } = this.state;

    return (
      <div className="container">
      <div className="main-app-container">
        <div className="user-info-panel">
          {userData ? (
            <div>
              <h2>{userData.username}</h2>
              <p>{userData.email}</p>
              <button onClick={this.handleLogout} className="logout-button">Logout</button>
            </div>
          ) : (
            <p>Loading user data...</p>
          )}
        </div>

        <div className="wallets-panel">
          <h2>Your Wallets</h2>
          <ul>
            {wallets.map(wallet => (
              <li key={wallet._id} className="wallet-item">
                <div className="wallet-info">
                  <strong>{wallet.walletName}</strong>
                  <div className="balance-info">
                    <span>Balance: {balances[wallet._id] || 'Loading...'} ETH</span>
                    <button 
                      onClick={() => this.refreshBalance(wallet._id)} 
                      className={`refresh-icon ${refreshing[wallet._id] ? 'spinning' : ''}`}
                      disabled={refreshing[wallet._id]} // Disable button while refreshing
                    >
                      <FontAwesomeIcon icon={faSyncAlt} />
                    </button>
                  </div>
                  <div className="key-display">
                    <label>Wallet Address</label>
                    <input
                      type="text"
                      value={wallet.address}
                      readOnly
                      className="key-input"
                    />
                    <button onClick={() => this.copyToClipboard(wallet.address)} className="copy-button">
                      Copy
                    </button>
                  </div>
                  {revealKeys[wallet._id] && (
                    <div className="key-display">
                      <label>Private Key</label>
                      <input
                        type="text"
                        value={wallet.privateKey.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----/g, '')}
                        readOnly
                        className="key-input"
                      />
                      <button onClick={() => this.copyToClipboard(wallet.privateKey.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----/g, ''))} className="copy-button">
                        Copy
                      </button>
                    </div>
                  )}
                  <div className="button-group">
                    <button onClick={() => this.toggleRevealKeys(wallet._id)} className="reveal-keys-button">
                      {revealKeys[wallet._id] ? 'Hide Private Key' : 'Reveal Private Key'}
                    </button>
                    <button onClick={() => this.handleDeleteWallet(wallet._id)} className="delete-button">Delete</button>
                  </div>

                  {/* Transaction form within each wallet */}
                  <div className="transaction-form">
                    <h4>Send Transaction</h4>
                    <input 
                      type="text" 
                      value={recipientAddress} 
                      placeholder="Recipient Address"
                      onChange={this.handleRecipientAddressChange}
                      className="transaction-input"
                    />
                    <input 
                      type="number" 
                      value={sendAmount} 
                      placeholder="Amount (ETH)"
                      onChange={this.handleSendAmountChange}
                      className="transaction-input"
                    />
                    <button onClick={() => this.handleSendTransaction(wallet._id)} className="send-transaction-button">Send</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {wallets.length < 3 && (
            <div className="create-wallet">
              <input 
                type="text" 
                value={walletName} 
                onChange={(e) => this.setState({ walletName: e.target.value })} 
                placeholder="Enter wallet name"
              />
              <button onClick={this.handleCreateWallet} className="create-wallet-button">Create Wallet</button>
            </div>
          )}
        </div>
        
      </div>
      
      <CryptoTrends/>
      </div>
    );
  }
}

// Wrapping the MainApp in a higher-order component to inject the navigate prop
const MainAppWithNavigation = (props) => {
  const navigate = useNavigate();
  return <MainApp {...props} navigate={navigate} />;
};

export default MainAppWithNavigation;
