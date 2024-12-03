// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import {Test, console} from "forge-std/Test.sol";
import {RecordKeeper} from "../src/RecordKeeper.sol";

contract RecordKeeperTest is Test {
    RecordKeeper public recordKeeper;
    address public player1;
    address public player2;

    function setUp() public {
        recordKeeper = new RecordKeeper();
        player1 = makeAddr("player1");
        player2 = makeAddr("player2");
    }

    function testSetPlayerRecordForNewPlayer() public {
        vm.prank(player1);
        recordKeeper.setPlayerRecord(
            100,        // score
            120,        // game duration
            "Easy",     // level
            10,         // lines cleared
            "UDLR"      // moves
        );

        // Retrieve player record
        (
            uint256 playerId, 
            address playerAddress, 
            uint256 score, 
            uint256 gameDuration, 
            string memory level, 
            uint256 linesCleared, 
            string memory moves,
            bool verified
        ) = recordKeeper.players(player1);

        assertEq(playerId, 0, "Player ID should be 0");
        assertEq(playerAddress, player1, "Player address should match");
        assertEq(score, 100, "Score should be 100");
        assertEq(gameDuration, 120, "Game duration should be 120");
        assertEq(level, "Easy", "Level should be Easy");
        assertEq(linesCleared, 10, "Lines cleared should be 10");
        assertEq(moves, "UDLR", "Moves should be UDLR");
        assertFalse(verified, "Player should not be verified by default");
    }

    function testSetPlayerRecordUpdatesExistingRecord() public {
        // First record
        vm.prank(player1);
        recordKeeper.setPlayerRecord(
            100,        // score
            120,        // game duration
            "Easy",     // level
            10,         // lines cleared
            "UDLR"      // moves
        );

        // Update record
        vm.prank(player1);
        recordKeeper.setPlayerRecord(
            200,        // new score
            240,        // new game duration
            "Hard",     // new level
            20,         // new lines cleared
            "LRDU"      // new moves
        );

        // Retrieve updated player record
        (
            ,               // skip playerId
            ,               // skip playerAddress
            uint256 score, 
            uint256 gameDuration, 
            string memory level, 
            uint256 linesCleared, 
            string memory moves,
            
        ) = recordKeeper.players(player1);

        assertEq(score, 200, "Score should be updated to 200");
        assertEq(gameDuration, 240, "Game duration should be updated to 240");
        assertEq(level, "Hard", "Level should be updated to Hard");
        assertEq(linesCleared, 20, "Lines cleared should be updated to 20");
        assertEq(moves, "LRDU", "Moves should be updated to LRDU");
    }

    function testSetVerificationStatus() public {
        // First set a player record
        vm.prank(player1);
        recordKeeper.setPlayerRecord(
            100,        // score
            120,        // game duration
            "Easy",     // level
            10,         // lines cleared
            "UDLR"      // moves
        );

        // Set verification status
        vm.prank(player1);
        bool verificationResult = recordKeeper.setVerifyStatus(true);

        // Check verification status
        (, , , , , , , bool verified) = recordKeeper.players(player1);
        assertTrue(verificationResult, "Verification should return true");
        assertTrue(verified, "Player should be verified");
    }

    function testCannotSetVerificationStatusForNonExistentPlayer() public {
        vm.prank(player1);
        vm.expectRevert("Player not found");
        recordKeeper.setVerifyStatus(true);
    }

    function testPlayerRecordUpdatedEvent() public {
        vm.prank(player1);
        vm.expectEmit(true, false, false, true);
        emit RecordKeeper.PlayerRecordUpdated(
            player1, 
            100, 
            120, 
            "Easy", 
            10, 
            "UDLR"
        );
        recordKeeper.setPlayerRecord(
            100,        // score
            120,        // game duration
            "Easy",     // level
            10,         // lines cleared
            "UDLR"      // moves
        );
    }

    function testVerificationStatusUpdatedEvent() public {
        // First set a player record
        vm.prank(player1);
        recordKeeper.setPlayerRecord(
            100,        // score
            120,        // game duration
            "Easy",     // level
            10,         // lines cleared
            "UDLR"      // moves
        );

        // Check verification status update event
        vm.prank(player1);
        vm.expectEmit(true, false, false, true);
        emit RecordKeeper.PlayerVerificationStatusUpdated(player1, true);
        recordKeeper.setVerifyStatus(true);
    }

    // Note: The leaderboard update logic is complex and might need more intricate testing
    // This is a basic test to ensure the function doesn't revert
    function testLeaderboardUpdateBasic() public {
        vm.prank(player1);
        recordKeeper.setPlayerRecord(
            100,        // score
            120,        // game duration
            "Easy",     // level
            10,         // lines cleared
            "UDLR"      // moves
        );

        // Leaderboard update is internal, so this indirectly tests it
        vm.prank(player1);
        recordKeeper.setPlayerRecord(
            200,        // new score
            240,        // new game duration
            "Hard",     // new level
            20,         // new lines cleared
            "LRDU"      // new moves
        );
    }
}