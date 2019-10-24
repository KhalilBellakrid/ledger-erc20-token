const {
  addressTo,
  addressFrom,
  contract,
  contractAddress
} = require('./config.js')
const push = require('./push.js');
const getRandomInt = max => {
  return Math.floor(Math.random() * Math.floor(max));
}
//Test contract method: get balance of from address

async function mintTo(address) {
  const tokenId = getRandomInt(Date.now());
  await push(addressFrom, contractAddress, contract.methods.mint(address, tokenId).encodeABI());
}
mintTo(addressTo);
