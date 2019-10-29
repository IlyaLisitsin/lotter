pragma solidity ^0.4.24;

contract Lottery {
    address public manager;
    address [] public players;

    constructor() public payable {
        manager = msg.sender;
    }

    function enter() public payable {
        require(msg.value > 0.01 ether);
        require(players.length <= 1);
        players.push(msg.sender);
    }

    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, now, players)));
    }

    function pickWinner() public payable restricted returns (uint) {
        uint index = random() % players.length;
        players[index].transfer(address(this).balance);
        players = new address[](0);

        return index;
    }

    function getPlayers() public view returns (address []) {
        return players;
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
}
