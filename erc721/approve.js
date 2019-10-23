const transfer = require('./transfer.js')
const {
  addressFrom,
  addressTo
} = require('./config.js')
//d7244ff6e
const token = parseInt(Buffer.from('0d7244ff6e', 'hex').toString('hex'), 16);
transfer(addressFrom, addressTo, token, "approve");
