const Web3 = require('web3');

// const compiledFactory = require('./build/BetFactory');
function getFactroyInstance() {

}

// const deployContract = require('../etherum/deploy');


const contractService = (function() {
    return {
        createBet: ({ address, betValue }) => 'kek',
        // getFactroryInstance: () => web
    }
})();

module.exports = contractService;
