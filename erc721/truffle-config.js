require('dotenv').config();
const fs = require('fs');
const Web3 = require("web3");
const web3 = new Web3();
const WalletProvider = require("truffle-hdwallet-provider");
const Wallet = require('ethereumjs-wallet');

const keys = JSON.parse(fs.readFileSync('.secret'));
var ropstenPrivateKey = keys["ACCOUNT_PRIVATE_KEY"];
const infuraKey = keys["INFURA_API_TOKEN"];
var ropstenProvider = new WalletProvider(ropstenPrivateKey, `https://ropsten.infura.io/v3/${infuraKey}`);

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: ropstenProvider,
      gas: 7000000, // should be inferior ro block gas limit ~8000000
      gasPrice: web3.utils.toWei("20", "gwei"),
      network_id: "3",
    }
  }
};
