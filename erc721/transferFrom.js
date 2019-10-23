const transfer = require('./transfer.js')
const {
  addressFrom,
  addressTo
} = require('./config.js')

const token = parseInt(Buffer.from('793dd2af59', 'hex').toString('hex'), 16);
transfer(addressFrom, addressTo, token, "transferFrom");
