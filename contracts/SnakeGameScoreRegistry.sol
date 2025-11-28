// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title SnakeGameScoreRegistry
 * @notice On-chain leaderboard and reward system for Park Snake game
 * @dev Tracks player scores and distributes cUSD rewards
 */
contract SnakeGameScoreRegistry is Ownable, ReentrancyGuard {
    // cUSD token address (Celo mainnet)
    IERC20 public constant cUSD = IERC20(0x765DE816845861e75A25fCA122bb6898B8B1282a);

    // Game constants
    uint256 public constant REWARD_PER_100_POINTS = 1e18; // 1 cUSD (18 decimals)
    uint256 public constant SUNSET_BONUS_PERCENT = 50;
    uint256 public constant MIN_SCORE = 100;

    // Contract state
    uint256 public totalRewardsDistributed;
    uint256 public totalScoresSubmitted;

    // Player data
    struct PlayerScore {
        address player;
        uint256 score;
        uint256 reward;
        uint256 timestamp;
        bool sunsetMode;
        bytes32 txHash; // Reference to original tx
    }

    // Mappings
    mapping(address => uint256) public playerHighScores;
    mapping(address => uint256) public playerTotalRewards;
    mapping(address => uint256) public playerGameCount;
    mapping(bytes32 => bool) public processedScores; // Prevent duplicate submissions

    // Leaderboard
    PlayerScore[] public leaderboard;
    uint256 public constant MAX_LEADERBOARD_SIZE = 100;

    // Events
    event ScoreSubmitted(
        address indexed player,
        uint256 indexed score,
        uint256 indexed reward,
        bool sunsetMode,
        uint256 timestamp
    );

    event RewardClaimed(
        address indexed player,
        uint256 indexed amount,
        uint256 timestamp
    );

    event LeaderboardUpdated(
        address indexed player,
        uint256 indexed newHighScore,
        uint256 position
    );

    // Modifiers
    modifier validScore(uint256 _score) {
        require(_score >= MIN_SCORE, "Score too low");
        require(_score <= 1000000, "Score too high (max 1M)");
        _;
    }

    /**
     * @notice Submit a game score
     * @param _score Final score from the game
     * @param _sunsetMode Whether sunset mode was unlocked
     * @param _uniqueId Unique identifier to prevent duplicates
     */
    function submitScore(
        uint256 _score,
        bool _sunsetMode,
        bytes32 _uniqueId
    ) external nonReentrant validScore(_score) {
        // Prevent duplicate submissions
        require(!processedScores[_uniqueId], "Score already submitted");
        processedScores[_uniqueId] = true;

        // Calculate reward
        uint256 baseReward = (_score / 100) * REWARD_PER_100_POINTS;
        uint256 reward = baseReward;

        // Apply sunset bonus
        if (_sunsetMode) {
            reward = (baseReward * (100 + SUNSET_BONUS_PERCENT)) / 100;
        }

        // Update player records
        playerGameCount[msg.sender]++;
        playerTotalRewards[msg.sender] += reward;

        // Update high score if applicable
        bool isNewHighScore = _score > playerHighScores[msg.sender];
        if (isNewHighScore) {
            playerHighScores[msg.sender] = _score;
        }

        // Add to leaderboard
        if (leaderboard.length < MAX_LEADERBOARD_SIZE) {
            leaderboard.push(
                PlayerScore({
                    player: msg.sender,
                    score: _score,
                    reward: reward,
                    timestamp: block.timestamp,
                    sunsetMode: _sunsetMode,
                    txHash: _uniqueId
                })
            );
        } else if (_score > leaderboard[leaderboard.length - 1].score) {
            // Replace lowest score if better
            leaderboard[leaderboard.length - 1] = PlayerScore({
                player: msg.sender,
                score: _score,
                reward: reward,
                timestamp: block.timestamp,
                sunsetMode: _sunsetMode,
                txHash: _uniqueId
            });
        }

        // Sort leaderboard (simple bubble sort for small array)
        _sortLeaderboard();

        // Update total stats
        totalScoresSubmitted++;
        totalRewardsDistributed += reward;

        // Transfer reward to player
        require(cUSD.transfer(msg.sender, reward), "Transfer failed");

        emit ScoreSubmitted(msg.sender, _score, reward, _sunsetMode, block.timestamp);

        if (isNewHighScore) {
            emit LeaderboardUpdated(
                msg.sender,
                _score,
                _findPlayerPosition(msg.sender)
            );
        }
    }

    /**
     * @notice Get top scores from leaderboard
     * @param _limit Number of top scores to return
     */
    function getTopScores(uint256 _limit) external view returns (PlayerScore[] memory) {
        uint256 length = _limit > leaderboard.length ? leaderboard.length : _limit;
        PlayerScore[] memory topScores = new PlayerScore[](length);

        for (uint256 i = 0; i < length; i++) {
            topScores[i] = leaderboard[i];
        }

        return topScores;
    }

    /**
     * @notice Get player's game history
     * @param _player Address to query
     * @param _limit Number of recent games
     */
    function getPlayerHistory(address _player, uint256 _limit)
        external
        view
        returns (PlayerScore[] memory)
    {
        uint256 count = 0;
        PlayerScore[] memory history = new PlayerScore[](_limit);

        for (uint256 i = leaderboard.length; i > 0 && count < _limit; i--) {
            if (leaderboard[i - 1].player == _player) {
                history[count] = leaderboard[i - 1];
                count++;
            }
        }

        // Resize array to actual count
        PlayerScore[] memory result = new PlayerScore[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = history[i];
        }

        return result;
    }

    /**
     * @notice Get player stats
     * @param _player Address to query
     */
    function getPlayerStats(address _player)
        external
        view
        returns (
            uint256 highScore,
            uint256 totalRewards,
            uint256 gameCount,
            uint256 leaderboardPosition
        )
    {
        highScore = playerHighScores[_player];
        totalRewards = playerTotalRewards[_player];
        gameCount = playerGameCount[_player];
        leaderboardPosition = _findPlayerPosition(_player);
    }

    /**
     * @notice Owner can top up contract for rewards
     */
    function topUpRewardPool(uint256 _amount) external onlyOwner {
        require(cUSD.transferFrom(msg.sender, address(this), _amount), "Transfer failed");
    }

    /**
     * @notice Owner can withdraw excess funds
     */
    function withdrawExcess() external onlyOwner nonReentrant {
        uint256 balance = cUSD.balanceOf(address(this));
        require(balance > 0, "No balance to withdraw");
        require(cUSD.transfer(owner(), balance), "Transfer failed");
    }

    /**
     * @notice Internal: Sort leaderboard by score (descending)
     */
    function _sortLeaderboard() internal {
        uint256 n = leaderboard.length;
        for (uint256 i = 0; i < n - 1; i++) {
            for (uint256 j = 0; j < n - i - 1; j++) {
                if (leaderboard[j].score < leaderboard[j + 1].score) {
                    // Swap
                    PlayerScore memory temp = leaderboard[j];
                    leaderboard[j] = leaderboard[j + 1];
                    leaderboard[j + 1] = temp;
                }
            }
        }
    }

    /**
     * @notice Internal: Find player's position in leaderboard
     */
    function _findPlayerPosition(address _player) internal view returns (uint256) {
        for (uint256 i = 0; i < leaderboard.length; i++) {
            if (leaderboard[i].player == _player) {
                return i + 1; // 1-indexed
            }
        }
        return 0; // Not found
    }

    /**
     * @notice Get leaderboard size
     */
    function getLeaderboardSize() external view returns (uint256) {
        return leaderboard.length;
    }
}
