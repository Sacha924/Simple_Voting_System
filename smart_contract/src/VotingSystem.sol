// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingSystem {

    struct Vote {
        uint256 id;
        uint256 startTimestamp;
        uint256 deadline;
        string descriptionHash;
        uint256 yesCount;
        uint256 noCount;
        mapping(address => bool) hasVoted;
    }

    uint256 public nextVoteId;                 // We can use Counter from OpenZeppelin if we want
    mapping(uint256 => Vote) public votes;
    mapping(address => uint256[]) public voterVotes;

    function proposeVote(uint256 _deadline, string memory _descriptionHash) public returns (uint256) {
        require(_deadline > block.timestamp, "Deadline must be in the future");

        uint256 voteId = nextVoteId;
        nextVoteId++;

        Vote storage newVote = votes[voteId];
        newVote.id = voteId;
        newVote.startTimestamp = block.timestamp;
        newVote.deadline = _deadline;
        newVote.descriptionHash = _descriptionHash;
        newVote.hasVoted[msg.sender] = true;          // Considering that somebody who proposes the vote cannot vote for it.
        voterVotes[msg.sender].push(voteId);          // Considering that creating a vote means that you have participated in this vote (even if you cannot vote for it)
        return voteId;
    }

    function castVote(uint256 _voteId, bool _yes) public {
        Vote storage vote = votes[_voteId];

        require(block.timestamp >= vote.startTimestamp && block.timestamp <= vote.deadline, "Voting is not active");
        require(!vote.hasVoted[msg.sender], "You have already voted");

        vote.hasVoted[msg.sender] = true;
        voterVotes[msg.sender].push(_voteId);
        
        if (_yes) {
            vote.yesCount++;
        } else {
            vote.noCount++;
        }
    }

    function getVoteResults(uint256 _voteId) public view returns (uint256, uint256) {
        Vote storage vote = votes[_voteId];
        return (vote.yesCount, vote.noCount);
    }

    function getVotes() public view returns (
        uint256[] memory ids,
        uint256[] memory startTimestamps,
        uint256[] memory deadlines,
        string[] memory descriptionHashes,
        uint256[] memory yesCounts,
        uint256[] memory noCounts
    ) {
        uint256 voteCount = nextVoteId;
        ids = new uint256[](voteCount);
        startTimestamps = new uint256[](voteCount);
        deadlines = new uint256[](voteCount);
        descriptionHashes = new string[](voteCount);
        yesCounts = new uint256[](voteCount);
        noCounts = new uint256[](voteCount);

        for (uint256 i = 0; i < voteCount; i++) {
            Vote storage vote = votes[i];
            ids[i] = vote.id;
            startTimestamps[i] = vote.startTimestamp;
            deadlines[i] = vote.deadline;
            descriptionHashes[i] = vote.descriptionHash;
            yesCounts[i] = vote.yesCount;
            noCounts[i] = vote.noCount;
        }

        return (ids, startTimestamps, deadlines, descriptionHashes, yesCounts, noCounts);
    }

    function getMyVotes() public view returns (uint256[] memory) {
        return voterVotes[msg.sender];
    }

    // Only create for testing purpose
    function testGetOneVote(uint256 _voteId) external view returns (
        uint256 id,
        uint256 startTimestamp,
        uint256 deadline,
        string memory descriptionHash,
        uint256 yesCount,
        uint256 noCount
    ) {
        Vote storage vote = votes[_voteId];
        return (
            vote.id,
            vote.startTimestamp,
            vote.deadline,
            vote.descriptionHash,
            vote.yesCount,
            vote.noCount
        );
    }
}