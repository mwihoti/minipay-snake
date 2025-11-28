// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface ICUSDToken is IERC20 {
    function decimals() external view returns (uint8);
}

/**
 * @title SnakeGameRewards
 * @dev Smart contract for distributing rewards in the Park Snake game on Celo
 * Features:
 * - Reward distribution based on game scores
 * - Land ownership and switching
 * - Play-to-earn mechanics
 */
contract SnakeGameRewards is Ownable, ReentrancyGuard {
    // Token address (cUSD on Celo Sepolia)
    address public constant cUSD = 0x86a37b6Ca4f0123b643f785385Eb0860D5EE810d;
    
    // Game configuration
    uint256 public rewardPerPoint = 0.01 ether; // 0.01 cUSD per point
    uint256 public sunsetModeBonus = 50; // 50% bonus (in basis points / 100)
    uint256 public minScoreToEarn = 100; // Minimum score required to earn
    uint256 public maxRewardPerGame = 100 ether; // Max 100 cUSD per game
    
    // Land types
    enum LandType { PARK, FOREST }
    
    // Land information
    struct Land {
        uint256 id;
        LandType landType;
        string name;
        string description;
        uint256 price;
        bool purchased;
        uint256 rewardMultiplier; // in basis points (e.g., 150 = 1.5x)
    }
    
    // Player data
    struct PlayerData {
        uint256 totalEarned;
        uint256 totalScored;
        uint256 gamesPlayed;
        uint256 activeLandId;
        bool exists;
    }
    
    // Game score record
    struct ScoreRecord {
        address player;
        uint256 score;
        bool sunsetMode;
        uint256 reward;
        uint256 landUsed;
        uint256 timestamp;
    }
    
    // State variables
    mapping(address => PlayerData) public players;
    mapping(address => mapping(uint256 => bool)) public playerOwnedLands; // player -> landId -> owned
    mapping(uint256 => Land) public lands;
    ScoreRecord[] public scoreHistory;
    
    uint256 public nextLandId = 1;
    uint256 public totalRewardsDistributed;
    uint256 public totalGamesPlayed;
    
    // Events
    event ScoreSubmitted(
        address indexed player,
        uint256 score,
        uint256 reward,
        bool sunsetMode,
        uint256 landUsed
    );
    event LandPurchased(address indexed player, uint256 landId, string landName);
    event LandActivated(address indexed player, uint256 landId);
    event RewardWithdrawn(address indexed player, uint256 amount);
    event LandCreated(uint256 indexed landId, string name, uint256 price);
    
    // Modifiers
    modifier onlyValidScore(uint256 score) {
        require(score >= minScoreToEarn, "Score too low to earn rewards");
        require(score <= 50000, "Score suspiciously high");
        _;
    }
    
    constructor() {
        // Create default lands
        createLand(LandType.PARK, "Sunny Park", "A beautiful sunny park with green grass", 0, 100); // Free
        createLand(LandType.FOREST, "Enchanted Forest", "A magical forest with tall trees", 10 ether, 150); // 10 cUSD, 1.5x multiplier
    }
    
    /**
     * @dev Create a new land type (owner only)
     */
    function createLand(
        LandType landType,
        string memory name,
        string memory description,
        uint256 price,
        uint256 rewardMultiplier
    ) public onlyOwner {
        require(rewardMultiplier >= 50 && rewardMultiplier <= 300, "Invalid multiplier");
        
        lands[nextLandId] = Land({
            id: nextLandId,
            landType: landType,
            name: name,
            description: description,
            price: price,
            purchased: price == 0, // Free lands are always "purchased"
            rewardMultiplier: rewardMultiplier
        });
        
        emit LandCreated(nextLandId, name, price);
        nextLandId++;
    }
    
    /**
     * @dev Purchase a land for play-to-earn gameplay
     */
    function purchaseLand(uint256 landId) external nonReentrant {
        require(landId > 0 && landId < nextLandId, "Invalid land ID");
        Land storage land = lands[landId];
        require(land.price > 0, "This land is free, use activateLand instead");
        require(!playerOwnedLands[msg.sender][landId], "Already own this land");
        
        // Transfer payment
        IERC20(cUSD).transferFrom(msg.sender, address(this), land.price);
        
        playerOwnedLands[msg.sender][landId] = true;
        emit LandPurchased(msg.sender, landId, land.name);
    }
    
    /**
     * @dev Activate a land for gameplay (must own or be free)
     */
    function activateLand(uint256 landId) external {
        require(landId > 0 && landId < nextLandId, "Invalid land ID");
        Land storage land = lands[landId];
        
        // Check ownership
        if (land.price > 0) {
            require(playerOwnedLands[msg.sender][landId], "You don't own this land");
        }
        
        // Initialize player if needed
        if (!players[msg.sender].exists) {
            players[msg.sender] = PlayerData({
                totalEarned: 0,
                totalScored: 0,
                gamesPlayed: 0,
                activeLandId: landId,
                exists: true
            });
        } else {
            players[msg.sender].activeLandId = landId;
        }
        
        emit LandActivated(msg.sender, landId);
    }
    
    /**
     * @dev Submit a game score and claim rewards
     */
    function submitScore(
        uint256 score,
        bool sunsetMode
    ) external nonReentrant onlyValidScore(score) {
        require(score > 0, "Score must be greater than 0");
        
        // Initialize player if needed
        if (!players[msg.sender].exists) {
            players[msg.sender] = PlayerData({
                totalEarned: 0,
                totalScored: 0,
                gamesPlayed: 0,
                activeLandId: 0,
                exists: true
            });
            // Automatically activate free park land
            players[msg.sender].activeLandId = 1;
        }
        
        // Calculate reward
        uint256 baseReward = (score * rewardPerPoint) / 1 ether;
        
        // Apply land multiplier
        uint256 activeLandId = players[msg.sender].activeLandId;
        if (activeLandId > 0 && activeLandId < nextLandId) {
            Land storage land = lands[activeLandId];
            baseReward = (baseReward * land.rewardMultiplier) / 100;
        }
        
        // Apply sunset mode bonus
        if (sunsetMode) {
            baseReward = (baseReward * (100 + sunsetModeBonus)) / 100;
        }
        
        // Cap reward
        if (baseReward > maxRewardPerGame) {
            baseReward = maxRewardPerGame;
        }
        
        // Update player stats
        players[msg.sender].totalEarned += baseReward;
        players[msg.sender].totalScored += score;
        players[msg.sender].gamesPlayed += 1;
        
        // Record score
        scoreHistory.push(ScoreRecord({
            player: msg.sender,
            score: score,
            sunsetMode: sunsetMode,
            reward: baseReward,
            landUsed: activeLandId,
            timestamp: block.timestamp
        }));
        
        // Update global stats
        totalRewardsDistributed += baseReward;
        totalGamesPlayed += 1;
        
        // Transfer reward
        require(IERC20(cUSD).transfer(msg.sender, baseReward), "Reward transfer failed");
        
        emit ScoreSubmitted(msg.sender, score, baseReward, sunsetMode, activeLandId);
    }
    
    /**
     * @dev Get player statistics
     */
    function getPlayerStats(address player) external view returns (PlayerData memory) {
        return players[player];
    }
    
    /**
     * @dev Get leaderboard (top 10 scores)
     */
    function getLeaderboard(uint256 limit) external view returns (ScoreRecord[] memory) {
        uint256 count = scoreHistory.length < limit ? scoreHistory.length : limit;
        ScoreRecord[] memory leaderboard = new ScoreRecord[](count);
        
        for (uint256 i = 0; i < count; i++) {
            leaderboard[i] = scoreHistory[scoreHistory.length - 1 - i];
        }
        
        return leaderboard;
    }
    
    /**
     * @dev Get land information
     */
    function getLand(uint256 landId) external view returns (Land memory) {
        require(landId > 0 && landId < nextLandId, "Invalid land ID");
        return lands[landId];
    }
    
    /**
     * @dev Check if player owns a land
     */
    function ownsLand(address player, uint256 landId) external view returns (bool) {
        if (lands[landId].price == 0) return true; // Free lands everyone can use
        return playerOwnedLands[player][landId];
    }
    
    /**
     * @dev Get all available lands
     */
    function getAllLands() external view returns (Land[] memory) {
        Land[] memory allLands = new Land[](nextLandId - 1);
        for (uint256 i = 1; i < nextLandId; i++) {
            allLands[i - 1] = lands[i];
        }
        return allLands;
    }
    
    /**
     * @dev Owner functions
     */
    function updateRewardPerPoint(uint256 newRate) external onlyOwner {
        rewardPerPoint = newRate;
    }
    
    function updateSunsetBonus(uint256 newBonus) external onlyOwner {
        require(newBonus <= 200, "Bonus too high");
        sunsetModeBonus = newBonus;
    }
    
    function withdrawContractBalance() external onlyOwner nonReentrant {
        uint256 balance = IERC20(cUSD).balanceOf(address(this));
        require(balance > 0, "No balance to withdraw");
        require(IERC20(cUSD).transfer(owner(), balance), "Withdrawal failed");
    }
    
    function fundContract(uint256 amount) external onlyOwner {
        require(IERC20(cUSD).transferFrom(msg.sender, address(this), amount), "Funding failed");
    }
}
