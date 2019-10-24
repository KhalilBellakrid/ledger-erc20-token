const {
  addressTo,
  addressFrom,
  contract,
  contractAddress,
  token
} = require('./config.js')
const push = require('./push.js');

const tokenId = process.env['ID_WITH'] || 'ffffffff';
async function mingleWith(address) {
  await push(addressFrom, contractAddress, contract.methods.mingleWith(token, tokenId).encodeABI());
}
mingleWith(addressTo);
