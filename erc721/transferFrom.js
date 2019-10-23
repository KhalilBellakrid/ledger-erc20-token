const transfer = require('./transfer.js')
const {
  addressFrom,
  addressTo
} = require('./config.js')

const token = parseInt(Buffer.from('92391fac84', 'hex').toString('hex'), 16);
transfer(addressFrom, addressTo, token, "transferFrom");
