var GotchiCore = artifacts.require("./LedgerGotchiCore.sol");

module.exports = function(deployer) {
  deployer.deploy(GotchiCore);
};
