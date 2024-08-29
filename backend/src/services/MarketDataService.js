const axios = require('axios');

const API_URL = 'https://api.coincap.io/v2';
const API_KEY = process.env.COINCAP_API_KEY;

const marketDataService = {
  getCryptoPrices: async () => {
    try {
      const response = await axios.get(`${API_URL}/assets/ethereum/history?interval=d1`, {
        headers: {
          Authorization: `Bearer ${API_KEY}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching crypto prices:', error);
      throw error;
    }
  }
};

module.exports = marketDataService;

