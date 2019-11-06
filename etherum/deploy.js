const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
// constcompile = require('./compile');

const provider = new HDWalletProvider(
    'stadium suit leisure cube spy leave thunder tomato theory kingdom physical all',
    'https://ropsten.infura.io/v3/709050cee8734ea18175fd47af6be8f0',
);

const web3 = new Web3(provider);

const compiledFactory = require('./build/BetFactory');
const compiledBet = require('./build/Bet');

let factoryAddress;
const deploy = async () => {
    if (!factoryAddress) {
        const accounts = await web3.eth.getAccounts();

        console.log('DEPLOYER ADDRESS', accounts[0])

        const factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
            .deploy({ data: compiledFactory.bytecode })
            .send({ from: accounts[0], gas: '1000000'})

        console.log('DEPLOYED FACTORY ADDRESS', factory.options.address)
    }

    return factoryAddress;

};

// deploy();
