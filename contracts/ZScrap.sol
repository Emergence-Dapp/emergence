  // INTO CONTRACT: create, update, delete
  // function createFlowIntoContract(ISuperfluidToken token, int96 flowRate) external {
  //   require(msg.sender == owner || daoMembers[msg.sender] == true, "must be authorized");
  //   cfaV1.createFlowByOperator(msg.sender, address(this), token, flowRate);
  // }

  // function updateFlowIntoContract(ISuperfluidToken token, int96 newFlowRate) external {
  //   require(msg.sender == owner || daoMembers[msg.sender] == true, "must be authorized");
  //   cfaV1.updateFlowByOperator(msg.sender, address(this), token, newFlowRate);
  // }

  // function deleteFlowIntoContract(ISuperfluidToken token) external {
  //   require(msg.sender == owner || daoMembers[msg.sender] == true, "must be authorized");
  //   cfaV1.deleteFlow(msg.sender, address(this), token);
  // }


  // function updateFlowFromContract(ISuperfluidToken token, address receiver, int96 newFlowRate) external {
  //   require(msg.sender == owner || daoMembers[msg.sender] == true, "must be authorized");
  //   cfaV1.updateFlow(receiver, token, newFlowRate);
  // }