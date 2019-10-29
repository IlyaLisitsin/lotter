const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compile = require('./compile');
const compileInterface = compile.interface;
const bytecode = compile.bytecode;

const provider = new HDWalletProvider(
    'stadium suit leisure cube spy leave thunder tomato theory kingdom physical all',
    'https://ropsten.infura.io/v3/709050cee8734ea18175fd47af6be8f0',
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('account', accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(compileInterface))
        .deploy({ data: bytecode })
        .send({ gas: '1000000', from: accounts[0], value: '1000000' });

    console.log('address', result.options.address)
};

deploy();
