// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;

import "./RWD.sol";
import "./Tether.sol";

contract DecentralBank {
    address public owner;
    string public name = "Decentral Bank";

    event IssueTokens();

    Tether public tether;
    RWD public rwd;

    address[] public stakers;

    mapping(address => uint) public stakingBalances;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaked;

    constructor(RWD _rwd, Tether _tether) {
        rwd = _rwd;
        tether = _tether;
        owner=msg.sender;
    }
    function depositeTokens(uint _amount) public {
        require(_amount > 0);
        tether.transferFrom(msg.sender, address(this), _amount);

        stakingBalances[msg.sender] = stakingBalances[msg.sender]+_amount;

        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }
        isStaked[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }
    function issueTokens() public {
        require(msg.sender==owner, 'caller must be the owner');
        for(uint i=0;i<stakers.length;i++){
            address recipient =stakers[i];
            uint balance=stakingBalances[recipient] /9;
            if(balance>=0){
                rwd.transfer(recipient, balance);
            }
        }
        emit IssueTokens();
    }
    function unstakeTokens() public{
        uint balance =stakingBalances[msg.sender];
        require(balance>0, 'balance can not be less than zero');
        tether.transfer(msg.sender, balance);

        stakingBalances[msg.sender]=0;
        isStaked[msg.sender]=false;
    }
}
