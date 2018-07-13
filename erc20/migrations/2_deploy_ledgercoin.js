var LedgerCoin = artifacts.require("./LedgerCoin.sol");

module.exports = function(deployer) {
  deployer.deploy(LedgerCoin);
};
