const path = require('path');
const fs = require('fs');
const solc = require('solc');

// const inboxPath = path.resolve(__dirname, 'contracts', 'Inbox.sol');
const lotteryPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');
// const source = fs.readFileSync(inboxPath, 'utf-8');
const lotterySource = fs.readFileSync(lotteryPath, 'utf-8');
// module.exports = solc.compile(source, 1).contracts[':Inbox'];

// console.log(423, solc.compile(lotterySource, 1).contracts[':Lottery'])
// module.exports = solc.compile(source, 1).contracts[':Inbox'];
module.exports = solc.compile(lotterySource, 1).contracts[':Lottery'];
