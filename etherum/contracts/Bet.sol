pragma solidity ^0.4.24;

contract BetFactory {
    address public betInstanceAddress;

    function createBetContract() public payable {
        require(msg.value > 100);

        address newBet = (new Bet).value(msg.value)(msg.value, msg.sender);
        betInstanceAddress = newBet;
    }
}

contract Bet {
    uint currentBet;
    address[2] public players;
    uint public test;
    bool fullfiled;

    constructor(uint betValue, address betCreator) public payable {
        currentBet = betValue;
        players[0] = betCreator;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function enter() public payable {
        require(!fullfiled);
        require(msg.value == currentBet);
        players[1] = msg.sender;

        players[uint(keccak256(abi.encodePacked(block.difficulty, now, players))) % 2].transfer(address(this).balance);
        fullfiled = true;
    }

    function cancelBet() public payable {
        require(msg.sender == players[0]);

        players[0].transfer(address(this).balance / 2);
        players[1].transfer(address(this).balance / 2);

        fullfiled = true;
    }
}

