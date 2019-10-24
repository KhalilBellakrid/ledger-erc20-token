const push = require('./push.js')
const {
  addressFrom,
  addressTo,
  contractAddress,
  contract,
  token
} = require('./config.js')
push(addressFrom, contractAddress, contract.methods.transferFrom(addressFrom, addressTo, token).encodeABI());
