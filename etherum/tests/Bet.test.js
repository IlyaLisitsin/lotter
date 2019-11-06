const assert = require('assert');
const expect = require('chai').expect;
const chai = require('chai');
chai.use(require('chai-as-promised'));

const ganache = require('ganache-cli');
const Web3 = require('web3');

const web3 = new Web3(ganache.provider());

const compiledBet = require('../build/Bet');

let accounts;
let bet;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    bet = await new web3.eth.Contract(JSON.parse(compiledBet.interface))
        .deploy({ data: compiledBet.bytecode })
        .send({ from: accounts[0], gas: '1000000', value: web3.utils.toWei('5', 'ether') });
});

describe('bet', () => {
    it('creates bet', async () => {
        assert.ok(bet);
    });

    it('bet should have balance', async () => {
        const kek = await bet.methods.getBalance().call();
        assert.equal(kek, '5000000000000000000');
    });

    it('unable to create bet < 0.001 eth', async () => {
        expect(new web3.eth.Contract(JSON.parse(compiledBet.interface))
            .deploy({ data: compiledBet.bytecode })
            .send({ from: accounts[0], gas: '1000000', value: web3.utils.toWei('0.00001', 'ether') })).to.be.rejectedWith(Error);
    });

    it('enter value should equal bet value', async () => {

        expect(bet.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('4', 'ether'),
        })).to.be.rejectedWith(Error);

        expect(bet.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('6', 'ether'),
        })).to.be.rejectedWith(Error);

        expect(bet.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('5', 'ether'),
        })).to.be.fulfilled;
    });

    it('should pick winner after enter of second user', async () => {

        const initBallanceFirst = await web3.eth.getBalance(accounts[2]);
        const initBallanceSecond = await web3.eth.getBalance(accounts[3]);

        // console.log(1, initBallanceFirst)
        // console.log(2, initBallanceSecond)

        const bet = await new web3.eth.Contract(JSON.parse(compiledBet.interface))
            .deploy({ data: compiledBet.bytecode })
            .send({ from: accounts[2], gas: '1000000', value: web3.utils.toWei('5', 'ether') });

        await bet.methods.enter().send({
            from: accounts[3],
            value: web3.utils.toWei('5', 'ether'),
        });

        const finalBallanceFirst = await web3.eth.getBalance(accounts[2]);
        const finalBallanceSecond = await web3.eth.getBalance(accounts[3]);

        // console.log(1, finalBallanceFirst)
        // console.log(2, finalBallanceSecond)

        assert((finalBallanceFirst - finalBallanceSecond) > web3.utils.toWei('4.9', 'ether'));


    });
});
