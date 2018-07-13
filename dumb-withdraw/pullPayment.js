require('dotenv').config()
var logger = require('logger').createLogger();
const fs = require('fs');
const Web3  = require('web3');
const EthereumTx = require('ethereumjs-tx')

const url = `https://ropsten.infura.io/${process.env["INFURA_TOKEN"]}`
const web3 = new Web3(new Web3.providers.HttpProvider(url));

const contractAbi = JSON.parse(fs.readFileSync('build/contracts/LedgerPullPayment.json', 'utf-8'));
const contractAddress = '0xc66054271a870e67713b59f030ff71ba2d421c22';
const addressFrom = process.env["ADDRESS_FROM"]
const contract = new web3.eth.Contract(contractAbi.abi, contractAddress);


const getGasPrice = async () => {
  const gasPrice = await web3.eth.getGasPrice();
  return gasPrice;
}

const makeTransaction = async () => {

  //Get nonce
  const nonce = await web3.eth.getTransactionCount(addressFrom)
  logger.info('Got nonce', nonce);

  //TODO: use gas price
  const gasPrice = await getGasPrice();
  const gasLimit = 1000*gasPrice
  const block = await web3.eth.getBlock('latest')
  const blockGasLimit = block.gasLimit
  logger.info('Got gas price', gasPrice);

  logger.info(contract.methods)
  //Get raw transaction
  const getRawTransaction = () => {
    return {
        from: addressFrom,
        nonce: web3.utils.toHex(nonce),
        gasPrice: web3.utils.toHex(gasPrice),
        gasLimit: web3.utils.toHex(2000000),
        to: contractAddress,
        value: "0x0",
        data: contract.methods.withdrawPayments().encodeABI(),
        chainId: 0x03
    };
  }
  const rawTransaction = getRawTransaction()
  logger.info('Got raw transaction', rawTransaction);

  //Sign transaction
  const signTransaction = (rawTx) => {

    const privKey = new Buffer(process.env["ROPSTEN_PRIVATE_KEY"], "hex")

    const tx = new EthereumTx(rawTx);
    tx.sign(privKey);
    var serializedTx = tx.serialize();

    logger.info('Send signed transaction');
    web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
        if (!err) {
          logger.info('Transaction successfully sent', hash);
          process.exit(0)
        } else {
          logger.info('Transaction failed', err);
          process.exit(1)
        }

    });
  }
  logger.info('Sign raw transaction');
  signTransaction(rawTransaction)

}
makeTransaction()
