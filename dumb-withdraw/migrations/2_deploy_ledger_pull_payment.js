var LedgerPullPayment = artifacts.require("./LedgerPullPayment.sol");

module.exports = function(deployer) {
  deployer.deploy(LedgerPullPayment);
};
