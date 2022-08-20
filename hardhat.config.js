require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

module.exports = {
  solidity: '0.8.13',
  networks: {
    goerli: {
      url: process.env.GOERLI_URL,
      accounts: [process.env.PRI_KEY],
    },
    matic: {
      url: process.env.MATIC_URL,
      accounts: [process.env.PRI_KEY]
    },
    // polygonscan: {
    //   apiKey: process.env.POLYGONSCAN_API_KEY
    // },
  }
};
