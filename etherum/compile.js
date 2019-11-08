const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');

const buildPath = path.resolve(__dirname, 'build');

const betPath = path.resolve(__dirname, 'contracts', 'Bet.sol');
const source = fs.readFileSync(betPath, 'utf-8');
const output = solc.compile(source, 1).contracts;

fs.ensureDirSync(buildPath);
for (let bet in output) {
    fs.outputJsonSync(
        path.resolve(buildPath, `${bet.replace(':', '')}.json`),
        output[bet]
    )
}


module.exports = solc.compile(source, 1).contracts;
