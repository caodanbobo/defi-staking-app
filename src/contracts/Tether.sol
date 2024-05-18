// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;

contract Tether {
    string public name = "Mock Tether";
    string public symbol = "mUSDT";
    uint public totalSupply = 1000000000000000000000000;
    uint8 public decimal = 18;

    event Transfer(address indexed _from, address indexed _to, uint _value);

    event Approval(address indexed _from, address indexed _to, uint _value);

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address=>uint256)) public allowance;
    constructor() public{
        balanceOf[msg.sender] = totalSupply;
    }
    function transfer(address _to, uint _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        success = true;
    }

    function approve(address _spender, uint256 _value) public returns(bool){
        require(balanceOf[msg.sender] >= _value);
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender,_spender,_value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns(bool){
        require(balanceOf[_from]>= _value);
        require(allowance[_from][_to]>=_value);
        balanceOf[_from] = balanceOf[_from] - _value;
        balanceOf[_to] = balanceOf[_to]+ _value;

        allowance[_from][_to] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    } 
}
