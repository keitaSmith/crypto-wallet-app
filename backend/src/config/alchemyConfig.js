const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
require('dotenv').config();

const web3 = createAlchemyWeb3(process.env.ALCHEMY_API_URL);

module.exports = web3;