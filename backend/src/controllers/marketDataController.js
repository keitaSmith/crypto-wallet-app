const marketDataService = require('../services/MarketDataService');

exports.getCryptoPrices = async (req, res) => {
  try {
    const prices = await marketDataService.getCryptoPrices();
    res.json(prices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching crypto prices', error: error.message });
  }
};

