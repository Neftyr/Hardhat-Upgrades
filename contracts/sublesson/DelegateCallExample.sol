// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

// Be sure to check out solidity-by-example
// https://solidity-by-example.org/delegatecall

// NOTE: Deploy this contract first
contract B {
    // NOTE: storage layout must be the same as contract A
    uint256 public num;
    address public sender;
    uint256 public value;

    function setVars(uint256 _num) public payable {
        num = _num;
        sender = msg.sender;
        value = msg.value;
    }
}

contract A {
    // Types of below have to be the same and in same order as in contract B. Otherwise It will convert type and you will get type from contract A
    uint256 public firstVariable; // It is taking 1st slot from storage and assign corresponded value from contract B, so "num"
    address public secondVariable; // It is taking 2nd slot from storage and assign corresponded value from contract B, so "sender"
    uint256 public thirdVariable; // It is taking 3rd slot from storage and assign corresponded value from contract B, so "value"

    function setVars(address _contract, uint256 _num) public payable {
        // A's storage is set, B is not modified.
        (bool success, bytes memory data) = _contract.delegatecall(abi.encodeWithSignature("setVars(uint256)", _num));
    }
}
