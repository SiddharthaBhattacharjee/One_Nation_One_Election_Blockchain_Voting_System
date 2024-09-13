//SPDX-License-Identifier: unlicensed
pragma solidity ^0.8.9;

contract VoteContract{
    address owner;
    mapping(address=>bool) voted;
    mapping(uint256=>uint256) votes;
    mapping(uint256=>string) candidates;
    mapping(uint256=>uint256) candidate_constituency;
    mapping(address=>bool) whitelist;
    mapping(address=>uint256) constituency;
    mapping(uint256=>bool) votingEnabled;
    uint256 candidateCount;
    
    constructor() {
        owner = msg.sender;
        whitelist[owner] = true;
    }

    function toggleVotingEnabled(uint256 const) public {
        require(msg.sender == owner,"Access Denied : only owner can access this function!");
        votingEnabled[const] = !votingEnabled[const];
    }

    function addCandidate(string memory name, uint256 const) public {
        require(msg.sender == owner,"Access Denied : only owner can access this function!");
        candidateCount++;
        candidates[candidateCount] = name;
        candidate_constituency[candidateCount] = const;
        votes[candidateCount] = 0;
    }

    function vote(uint256 index) public {
        require(whitelist[msg.sender], "You are not allowed to vote");
        require(!voted[msg.sender],"You have already voted");
        require(votingEnabled[constituency[msg.sender]],"Voting is not enabled!");
        require(bytes(candidates[index]).length>0,"Candidate Not Found");
        require(constituency[msg.sender] == candidate_constituency[index], "Constituency Mismatch!");
        votes[index]++;
        voted[msg.sender] = true;
    }

    function getResult() view public returns(uint256[] memory){
        uint256[] memory voteresult = new uint[](candidateCount+1);
        for(uint i=1;i<=candidateCount;i++){
            voteresult[i] = votes[i];
        }
        return voteresult;
    }

    function getConstituencyCandidate() view public returns(uint256[] memory){
        uint256[] memory constList = new uint[](candidateCount+1);
        for(uint i=1;i<=candidateCount;i++){
            constList[i] = candidate_constituency[i];
        }
        return constList;
    }

    function getCandidateData() view public returns(string[] memory){
        string[] memory candidatedata = new string[](candidateCount+1);
        for(uint i=1;i<=candidateCount;i++){
            candidatedata[i] = candidates[i];
        }
        return candidatedata;
    }

    function hasVoted() view public returns(bool){
        return voted[msg.sender];
    }

    function isVotingEnabled(uint256 const) view public returns(bool){
        return votingEnabled[const];
    }

    function getCandidateCount() view public returns(uint256){
        return candidateCount;
    }

    function addToWhitelist(address _address,uint256 const) public {
        require(msg.sender == owner,"Access Denied : only owner can access this function!");
        whitelist[_address] = true;
        constituency[_address] = const;
    }
    
    function removeFromWhitelist(address _address) public {
        require(msg.sender == owner,"Access Denied : only owner can access this function!");
        whitelist[_address] = false;
        constituency[_address] = 0;
    }
    
    function isWhitelisted(address _address) public view returns(bool) {
        return whitelist[_address];
    }

    function getConstituency(address _address) public view returns(uint256) {
        return constituency[_address];
    }


    function isOwner() view public returns(bool){
        return msg.sender == owner;
    }
}