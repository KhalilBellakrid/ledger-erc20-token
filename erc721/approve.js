const push = require('./push.js')
const {
  addressFrom,
  addressTo,
  contractAddress,
  contract,
  token
} = require('./config.js')
push(addressFrom, contractAddress, contract.methods.approve(addressTo, token).encodeABI());
