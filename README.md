#  Test Your Luck Contract

In this Solidity program, I've created a stake mining-inspired gambling app where users can stake cryptocurrency to participate in lottery rounds. Each stake represents a ticket for a chance to win a jackpot, with winning odds based on the amount staked. Users can monitor ongoing lotteries, view historical results, and withdraw their winnings.

## Description

This application provides seamless integration with MetaMask for wallet connectivity, enabling users to securely deposit cryptocurrency. Players engage in an exciting game where the objective is to avoid mines to double their deposited amount, while hitting a mine results in the loss of all deposited funds. Alongside the game, the app includes a dynamic leaderboard that showcases top performers based on their winnings. Additionally, a comprehensive history function allows users to review their gameplay outcomes, transaction details, and overall performance over time.

## Getting Started

### Executing Program

To run this program, you can use Remix, an online Solidity IDE. To get started, go to the Remix website at [Remix Ethereum](https://remix.ethereum.org/).

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//import "hardhat/console.sol";

contract Assessment {
    address payable public owner;
    uint256 public balance;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);

    struct Player {
        address playerAddress;
        uint256 winning;
    }

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns(uint256){
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        uint _previousBalance = balance;

        // make sure this is the owner
        require(msg.sender == owner, "You are not the owner of this account");

        // perform transaction
        balance += _amount;

        // assert transaction completed successfully
        assert(balance == _previousBalance + _amount);

        // emit the event
        emit Deposit(_amount);
    }

    // custom error
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }

        // withdraw the given amount
        balance -= _withdrawAmount;

        // assert the balance is correct
        assert(balance == (_previousBalance - _withdrawAmount));

        // emit the event
        emit Withdraw(_withdrawAmount);
    }

    // Leaderboard
    mapping (address => uint) moneyWon;
    Player[] public leaderboard;

    function addToLeaderBoard(address _address, uint amountWon) public {
        moneyWon[_address]+=amountWon;

        bool alreadyExist = false;
        for(uint i=0;i<leaderboard.length;i++){
            if(leaderboard[i].playerAddress==_address){
                leaderboard[i].winning = moneyWon[_address];
                alreadyExist = true;
                break;
            }
        }

        if(!alreadyExist) {
            leaderboard.push(Player(_address,moneyWon[_address]));
        }
    }
    function getLeaderboard() public view returns (Player[] memory) {
        return leaderboard;
    }

    // History
    struct Transaction {
        address user;
        string resultType;
        uint256 timestamp;
    }
    mapping(address => Transaction[]) public history;

     function addToHistory(address _user, string memory _type) public {
        history[_user].push(Transaction({
            user: _user,
            resultType:_type,
            timestamp: block.timestamp
        }));
        
    }

    function getHistory(address _user) public view returns (Transaction[] memory) {
        return history[_user];
    }
}
```
After cloning the github, you will want to do the following to get the code running on your computer.

1. Inside the project directory, in the terminal type: npm i bun -g and bun i
2. Open two additional terminals in your VS code
3. In the second terminal type: npx hardhat node
4. In the third terminal, type: npx hardhat run --network localhost scripts/deploy.js
5. Back in the first terminal, type npm run dev to launch the front-end.

After this, the project will be running on your localhost. 
Typically at https://3000-mannatgupta-smartcontra-2vfppbtpr2x.ws-us114.gitpod.io/


## License
This project is licensed under the MIT License - see the LICENSE.md file for details

