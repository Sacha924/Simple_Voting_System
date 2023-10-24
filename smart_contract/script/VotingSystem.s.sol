// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console2} from "forge-std/Script.sol";
import {VotingSystem} from "../src/VotingSystem.sol";


contract DeployScript is Script {
    function run() external {

        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        VotingSystem votingSystem = new VotingSystem();

        vm.stopBroadcast();
    }
}