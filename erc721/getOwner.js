const {
  contract
} = require('./config.js')

//Test contract method: get balance of from address
const token = parseInt(Buffer.from('0d7244ff6e', 'hex').toString('hex'), 16);
async function getOwner(tokenId) {
  const owner = await contract.methods.ownerOf(tokenId).call()
  return owner;
}
const getTokenOwner = async tokenId => {
  console.log(`Try to get ${tokenId} owner`);
  const owner = await getOwner(tokenId);
  console.log(`Got ${owner} as owner of: ${tokenId}`);
  return owner;
}
getTokenOwner(token);
