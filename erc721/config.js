require('dotenv').config()
const fs = require('fs');
const Web3  = require('web3');



const contractAbi = JSON.parse(fs.readFileSync('build/contracts/LedgerGotchiCore.json', 'utf-8'));
const keys = JSON.parse(fs.readFileSync('.secret'));
const key = keys["ACCOUNT_PRIVATE_KEY"];
const url = `https://ropsten.infura.io/v3/${keys["INFURA_API_TOKEN"]}`;
const web3 = new Web3(new Web3.providers.HttpProvider(url));
const contractAddress = '0x107755E4417A8DdC62b894137Eea4394BbA59323';
//const addressFrom = process.env["ADDRESS_FROM"]
const addressFrom = "0xD0Ec064CFf693453Ef4595aa555Ce65244b212a5";
const addressTo = "0x0DF793a73aB3C5bc0aE1B89d28b7d531D40EE0FC";
const token = parseInt(Buffer.from('ffffffff', 'hex').toString('hex'), 16);
const contract = new web3.eth.Contract(contractAbi.abi, contractAddress);

const config = {
  contractAbi,
  contractAddress,
  addressFrom,
  addressTo,
  contract,
  key,
  web3,
  token
};
module.exports =  config;
