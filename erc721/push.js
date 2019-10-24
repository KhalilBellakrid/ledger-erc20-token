require('dotenv').config()
const EthereumTx = require('ethereumjs-tx')
const {
  key,
  web3
} = require('./config.js')


const getGasPrice = async () => {
  const gasPrice = await web3.eth.getGasPrice();
  return gasPrice;
}

const push = async (addressFrom, ercAddress, abiMethod) => {

  //Get nonce
  const nonce = await web3.eth.getTransactionCount(addressFrom)
  console.log(`Got nonce: ${nonce}`);

  //TODO: use gas price
  const gasPrice = await getGasPrice();
  const gasLimit = 1000 * gasPrice
  const block = await web3.eth.getBlock('latest')
  const blockGasLimit = block.gasLimit
  console.log(`Got gas price ${gasPrice}`);
  //Get raw transaction
  const getRawTransaction = () => {
    return {
        from: addressFrom,
        nonce: web3.utils.toHex(nonce),
        gasPrice: web3.utils.toHex(20000000000),
        gasLimit: web3.utils.toHex(2000000),
        to: ercAddress,
        value: "0x0",
        data: abiMethod,
        chainId: 0x03
    };
  }
  const rawTransaction = getRawTransaction()
  console.log(`Got raw transaction : ${rawTransaction}`);

  //Sign transaction
  const signTransaction = (rawTx) => {

    const privKey = Buffer.from(key, "hex")

    const tx = new EthereumTx(rawTx);
    tx.sign(privKey);
    var serializedTx = tx.serialize();

    console.log(`Send signed transactiom`);
    web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
        if (!err) {
          console.log(`Transaction successfully sent ${hash}`);
          process.exit(0)
        } else {
          console.log(`Transaction failed ${err}`);
          process.exit(1)
        }

    });
  }
  console.log(`Sign raw transaction`);
  signTransaction(rawTransaction);
}
module.exports = push;
