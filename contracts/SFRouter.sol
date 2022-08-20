//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;
import "hardhat/console.sol";

import { ISuperfluid, ISuperToken } from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import { ISuperfluidToken } from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluidToken.sol";
import {IConstantFlowAgreementV1} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IConstantFlowAgreementV1.sol";
import {CFAv1Library} from "@superfluid-finance/ethereum-contracts/contracts/apps/CFAv1Library.sol";

contract SFRouter {
  address public owner;

  using CFAv1Library for CFAv1Library.InitData;
  CFAv1Library.InitData public cfaV1; //initialize cfaV1 variable
  
  mapping (address => bool) public daoMembers;

  constructor(ISuperfluid host, address _owner) {
    assert(address(host) != address(0));
    owner = _owner;
    console.log("Deploying a Money Router with owner:", owner);

    cfaV1 = CFAv1Library.InitData( //initialize InitData struct, and set equal to cfaV1 
    host, //here, we are deriving the address of the CFA using the host contract
    IConstantFlowAgreementV1(
      address(host.getAgreementClass(keccak256("org.superfluid-finance.agreements.ConstantFlowAgreement.v1")))
      )
    );
  }

  // ACCOUNT LIST: add & delete accounts
  function addAccount(address _account) external {
    require(msg.sender == owner, "only owner can add accounts");
    daoMembers[_account] = true;
  }

  function addAccounts(address[] memory _accounts) external {
    require(msg.sender == owner, "only owner can add accounts");
    uint i = 0;
    while (i < _accounts.length) {
      daoMembers[_accounts[i]] = true;
      i++;
    }  
  }

  function removeAccount(address _account) external {
    require(msg.sender == owner, "only owner can remove accounts");
    daoMembers[_account] = false;
  }
  
  // FROM CONTRACT: create, delete
  function createFlowFromContract(ISuperfluidToken token, address receiver, int96 flowRate) external {
    require(msg.sender == owner || daoMembers[msg.sender] == true, "must be authorized");
    cfaV1.createFlow(receiver, token, flowRate);
  }

  function deleteFlowFromContract(ISuperfluidToken token, address receiver) external {
    require(msg.sender == owner || daoMembers[msg.sender] == true, "must be authorized");
    cfaV1.deleteFlow(address(this), receiver, token);
  }

  // DEPOSIT: to this contract
  function sendLumpSumToContract(ISuperToken token, uint amount) external {
    require(msg.sender == owner ||daoMembers[msg.sender] == true, "must be authorized");
    token.transferFrom(msg.sender, address(this), amount);
  }

  // WITHDRAW: from account mapping to user address
  function withdrawFunds(ISuperToken token, uint amount) external {
    require(msg.sender == owner || daoMembers[msg.sender] == true, "must be authorized");
    token.transfer(msg.sender, amount);
  }
}