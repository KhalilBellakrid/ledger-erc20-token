const {
  addressTo,
  addressFrom,
  contract
} = require('./config.js')
const transfer = require('./transfer.js');
const getRandomInt = max => {
  return Math.floor(Math.random() * Math.floor(max));
}
//Test contract method: get balance of from address

async function mintTo(address) {
  const tokenId = getRandomInt(Date.now());
  const result = await transfer(addressFrom, address, tokenId, "mint");
  console.log(result);
  if (result) {
      console.log(`Token ${tokenId} mint to ${address}`);
  } else {
    console.log(`Failed to mint token ${tokenId} to ${address}`);
  }
  return result;
}
mintTo(addressFrom);
