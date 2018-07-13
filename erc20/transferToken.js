require('dotenv').config()
var logger = require('logger').createLogger();
const fs = require('fs');
const Web3  = require('web3');
const EthereumTx = require('ethereumjs-tx')

const url = `https://ropsten.infura.io/${process.env["INFURA_TOKEN"]}`
const web3 = new Web3(new Web3.providers.HttpProvider(url));

const contractAbi = JSON.parse(fs.readFileSync('build/contracts/LedgerCoin.json', 'utf-8'));
const contractAddress = '0x9549E8A940062615ceE20C0420C98c25Ffa2b214';
const addressFrom = process.env["ADDRESS_FROM"]
const addressTo = process.env["ADDRESS_TO"]
const contract = new web3.eth.Contract(contractAbi.abi, contractAddress);

//Test contract method: get balance of from address
async function getBalance(address) {
  const balance = await contract.methods.balanceOf(address).call()
  return balance
}
const balanceOfAddress = async (address) => {
  const balance = await getBalance(address);
  logger.info('Address', address, 'got balance', balance);
  return balance
}
balanceOfAddress(addressFrom)


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

  //Get raw transaction
  const getRawTransaction = (toAddress, amount) => {
    return {
        from: addressFrom,
        nonce: web3.utils.toHex(nonce),
        gasPrice: web3.utils.toHex(200000),
        gasLimit: web3.utils.toHex(2000000),
        to: contractAddress,
        value: "0x0",
        data: contract.methods.transfer(toAddress, amount).encodeABI(),
        chainId: 0x03
    };
  }
  const rawTransaction = getRawTransaction(addressTo, 1000)
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
