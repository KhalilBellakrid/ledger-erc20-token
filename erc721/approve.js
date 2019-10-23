const transfer = require('./transfer.js')
const {
  addressFrom,
  addressTo,
  token
} = require('./config.js')
transfer(addressFrom, addressTo, token, "approve");
