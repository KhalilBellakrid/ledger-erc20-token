require('dotenv').config();
const Web3 = require("web3");
const web3 = new Web3();
const WalletProvider = require("truffle-hdwallet-provider");
const Wallet = require('ethereumjs-wallet');

var ropstenPrivateKey = process.env["ROPSTEN_PRIVATE_KEY"];
const infuraKey = process.env["INFURA_TOKEN"];
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
      // You can get the current gasLimit by running
      // truffle deploy --network rinkeby
      // truffle(rinkeby)> web3.eth.getBlock("pending", (error, result) =>
      //   console.log(result.gasLimit))
      gas: 4600000,
      gasPrice: web3.utils.toWei("20", "gwei"),
      network_id: "3",
    }
  }
};
