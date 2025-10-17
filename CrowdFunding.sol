// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract CrowdFunding{
    mapping(address=>uint) public contributors;
    address public manager;
    uint public minimumContribution;
    uint public target;
    uint public amountRaised;
    uint public deadline;
    uint public noOfContributors;
    bool public isFundingCompleted;
    bool public isFundingFailed;
    bool public isFundingWithdrawn;

    struct Request{
        string description;
        address payable recipient;
        uint value;
        bool complete;
        uint noOfVoters;
        mapping (address=> bool) voters;
    }
    mapping (uint=> Request) public requests;
    uint public numRequests;

    constructor(uint _target, uint _deadline){
        target =_target;
        deadline= block.timestamp + _deadline;
        minimumContribution= 100 wei;
        manager = msg.sender;
        isFundingCompleted = false;
        isFundingFailed = false;
        isFundingWithdrawn = false;
        amountRaised = 0;
        noOfContributors = 0;
    }
    function senEth() public payable{
        require(block.timestamp <deadline, "Deadline has passed");
        require(msg.value >= minimumContribution, "Minimum contribution not met");
    
        if(contributors[ msg.sender]==0){
            noOfContributors += 1;
        }
         contributors[msg.sender]=msg.value;
         amountRaised+=msg.value;
     
    }
    function getContactBalance() public view returns(uint) {
        return address(this).balance;
    }
      function refund() public {
        require(block.timestamp>deadline && amountRaised<target, "you are not elligile");
        require(contributors[msg.sender]>0);
        address payable user= payable (msg.sender);
        user.transfer(contributors[msg.sender]);
        contributors[msg.sender]=0;   
      }
      
      modifier onlyManager()
      {
        //check if the sender is the manager
        require(msg.sender== manager,"only manager can call this function");
        _;
      }
      function createRequests(string memory _description, uint _value, address payable _recipient) public onlyManager{
        Request storage newRequest= requests[numRequests];
        newRequest.description=_description;
        newRequest.value=_value;
        newRequest.recipient=_recipient;
        newRequest.complete=false;
        newRequest.noOfVoters=0;
        numRequests++;
    }
    function voteRequests(uint _requestNO) public {
        require( contributors[msg.sender]>0,"You must be contributor");
        Request storage thisRequest= requests[_requestNO];
        require(thisRequest.voters[msg.sender]==false,"you have already voted");
        requests[ _requestNO].noOfVoters++;
        requests[ _requestNO].voters[msg.sender]=true;
    }
    function makePayment(uint _requestNO) public onlyManager{
        require(amountRaised>=target);
        Request storage thisRequest= requests[_requestNO];
        require(thisRequest.complete==false,"this request is already completed");
        require(thisRequest.noOfVoters>=(noOfContributors/2),"you need more than 50% votes to finalize");
        thisRequest.recipient.transfer(thisRequest.value);
        thisRequest.complete=true;
        amountRaised-=thisRequest.value;

    }

}