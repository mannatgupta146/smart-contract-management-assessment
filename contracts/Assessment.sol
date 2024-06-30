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
