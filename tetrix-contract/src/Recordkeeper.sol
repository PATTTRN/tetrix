// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.12;

contract RecordKeeper {
    uint256 public playerCount; // Make playerCount public to allow external access
    event PlayerRecordUpdated(address indexed playerAddress, uint256 score, uint256 gameDuration, string level, uint256 linesCleared, string moves);
    event PlayerVerificationStatusUpdated(address indexed playerAddress, bool verified);
    event LeaderboardUpdated(address indexed playerAddress, uint256 score);

    struct Player {
        uint256 playerId;
        address playerAddress;
        uint256 score;
        uint256 gameDuration;
        string level;
        uint256 linesCleared;
        string moves;
        bool verified;
    }

    mapping (address => Player) public players;
    mapping (uint256 => address) public leaderboard;

    function setPlayerRecord(uint256 _score, uint256 _gameDuration, string memory _level, uint256 _linesCleared, string memory _moves) external {
        require(msg.sender != address(0), "Invalid caller address");
        Player storage targetPlayer = players[msg.sender];
        if (targetPlayer.playerAddress == address(0)) {
            targetPlayer.playerId = playerCount++;
            targetPlayer.playerAddress = msg.sender;
            targetPlayer.score = _score; // Initialize score for new player
            targetPlayer.gameDuration = _gameDuration; // Initialize game duration for new player
            targetPlayer.level = _level; // Initialize level for new player
            targetPlayer.linesCleared = _linesCleared; // Initialize lines cleared for new player
            targetPlayer.moves = _moves; // Initialize moves for new player
        } else {
            targetPlayer.score = _score;
            targetPlayer.gameDuration = _gameDuration;
            targetPlayer.level = _level;
            targetPlayer.linesCleared = _linesCleared;
            targetPlayer.moves = _moves;
        }
        emit PlayerRecordUpdated(msg.sender, _score, _gameDuration, _level, _linesCleared, _moves);
        updateLeaderboard(msg.sender, _score);
    }

    function setVerifyStatus(bool _verified) external returns (bool) {
        Player storage targetPlayer = players[msg.sender];
        require(targetPlayer.playerAddress != address(0), "Player not found"); // Use require for better readability
        targetPlayer.verified = _verified;
        emit PlayerVerificationStatusUpdated(msg.sender, _verified);
        return _verified;
    }

    function updateLeaderboard(address _playerAddress, uint256 _score) internal {
        uint256 currentScore = players[_playerAddress].score;
        if (currentScore > 0) {
            uint256 position = currentScore;
            while (leaderboard[position] != address(0) && players[leaderboard[position]].score < currentScore) {
                leaderboard[position + 1] = leaderboard[position];
                position--;
            }
            leaderboard[position] = _playerAddress;
            emit LeaderboardUpdated(_playerAddress, _score);
        }
    }
}