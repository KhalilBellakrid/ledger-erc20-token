const {
  token
} = require('./config.js')

//Test contract method: get balance of from address
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
