// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console2} from "forge-std/Test.sol";
import {VotingSystem} from "../src/VotingSystem.sol";

contract VotingSystemTest is Test {
    VotingSystem public votingSystem;
    address user1 = vm.addr(0x1);
    address user2 = vm.addr(0x2);
    address user3 = vm.addr(0x3);
    address user4 = vm.addr(0x4);

    function setUp() public {
        vm.label(user1, "user1");
        vm.label(user2, "user2");
        vm.label(user3, "user3");
        vm.label(user4, "user4");
        votingSystem = new VotingSystem();
    }

    function test_propose_vote() public {
        uint256 id;
        uint256 startTimestamp;
        uint256 deadline;
        string memory descriptionHash;
        uint256 yesCount;
        uint256 noCount;

        // By default the vote didn't exist so it will give False value (0 for uint, "" for string, ...)
        (id, startTimestamp, deadline, descriptionHash, yesCount, noCount) = votingSystem.testGetOneVote(0);
        
        assertEq(id, 0);
        assertEq(deadline, 0);
        assertEq(descriptionHash, "");
        assertEq(yesCount, 0);
        assertEq(noCount, 0);

        // Creation of a real vote
        votingSystem.proposeVote(block.timestamp + 1 days, "The goal of this vote is to ...");
        (id, startTimestamp, deadline, descriptionHash, yesCount, noCount) = votingSystem.testGetOneVote(0);

        assertEq(id, 0);
        assertEq(deadline, block.timestamp + 1 days);
        assertEq(descriptionHash, "The goal of this vote is to ...");
        assertEq(yesCount, 0);
        assertEq(noCount, 0);
    }

    function test_cast_vote() public{
        vm.prank(user2);
        uint256 voteId = votingSystem.proposeVote(block.timestamp + 1 days, "The goal of this vote is to ...");

        vm.startPrank(user1);
        votingSystem.castVote(voteId, true);
        vm.expectRevert();
        votingSystem.castVote(voteId, true);  // Revert if the same person try to vote twice

        vm.stopPrank();

        vm.startPrank(user2);
        vm.expectRevert();
        votingSystem.castVote(voteId, true);  // Revert because creator of the vote cannot vote for his own vote proposal
        vm.stopPrank();

        vm.prank(user3);
        votingSystem.castVote(voteId, false);
        vm.prank(user4);
        votingSystem.castVote(voteId, false);

        (uint256 _yes, uint256 _no) = votingSystem.getVoteResults(voteId);
        assertEq(_yes, 1);
        assertEq(_no, 2);
    }

    function testGetVotes() public {
        votingSystem.proposeVote(block.timestamp + 1 days, "The goal of this vote is to ...");
        votingSystem.proposeVote(block.timestamp + 1 days, "azerty");

        uint256[] memory ids;
        uint256[] memory startTimestamps;
        uint256[] memory deadlines;
        string[] memory descriptionHashes;
        uint256[] memory yesCounts;
        uint256[] memory noCounts;

        (ids, startTimestamps, deadlines, descriptionHashes, yesCounts, noCounts) = votingSystem.getVotes();

        assertEq(descriptionHashes[0], "The goal of this vote is to ...");
        assertEq(descriptionHashes[1], "azerty");
    }

    function testMyVotes() public {
        uint256 voteId1 = votingSystem.proposeVote(block.timestamp + 1 days, "Vote 1 description");
        uint256 voteId2 = votingSystem.proposeVote(block.timestamp + 1 days, "Vote 2 description");

        vm.startPrank(user1);
        votingSystem.castVote(voteId1, true);
        votingSystem.castVote(voteId2, false);

        uint256[] memory myVotes = votingSystem.getMyVotes();

        assertEq(myVotes.length, 2);
        assertEq(myVotes[0], voteId1);
        assertEq(myVotes[1], voteId2);

        vm.stopPrank();
    }
}