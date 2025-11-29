// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title CeloTreasury
 * @dev Treasury system for Park Snake - sends CELO rewards when players reach level milestones
 */
contract CeloTreasury is Ownable, ReentrancyGuard {
    // CELO token (native - use address(0) for native CELO on Celo network)
    address public constant CELO = 0x471ECe3750da237F93b8E339c536aB5FF1D8235B;
    
    // Treasury address receiving gameplay rewards
    address public treasuryAddress;
    
    // Reward settings
    uint256 public rewardPerLevel = 0.3 ether; // 0.3 CELO per level
    uint256 public levelThreshold = 1000; // Score needed per level (level = score / threshold)
    
    // Player progress tracking
    struct PlayerProgress {
        uint256 currentLevel;
        uint256 totalEarned;
        uint256 lastRewardedLevel;
        bool exists;
    }
    
    mapping(address => PlayerProgress) public players;
    
    // Events
    event LevelReached(address indexed player, uint256 level, uint256 reward);
    event TreasuryUpdated(address indexed newTreasury);
    event RewardConfigured(uint256 rewardAmount, uint256 threshold);
    event RewardWithdrawn(address indexed player, uint256 amount);
    event TreasuryFunded(uint256 amount);
    
    // Modifiers
    modifier onlyTreasury() {
        require(msg.sender == treasuryAddress, "Only treasury can call this");
        _;
    }
    
    constructor(address _treasuryAddress) {
        require(_treasuryAddress != address(0), "Invalid treasury address");
        treasuryAddress = _treasuryAddress;
    }
    
    /**
     * @dev Submit score and check for level-up rewards
     */
    function submitScoreWithLevels(uint256 score) external nonReentrant {
        require(score > 0, "Score must be greater than 0");
        
        // Initialize player if needed
        if (!players[msg.sender].exists) {
            players[msg.sender] = PlayerProgress({
                currentLevel: 0,
                totalEarned: 0,
                lastRewardedLevel: 0,
                exists: true
            });
        }
        
        // Calculate current level based on score
        uint256 newLevel = score / levelThreshold;
        uint256 previousLevel = players[msg.sender].currentLevel;
        
        // Update level
        players[msg.sender].currentLevel = newLevel;
        
        // Give rewards for each new level reached
        if (newLevel > previousLevel) {
            uint256 levelsGained = newLevel - previousLevel;
            uint256 totalReward = levelsGained * rewardPerLevel;
            
            players[msg.sender].totalEarned += totalReward;
            players[msg.sender].lastRewardedLevel = newLevel;
            
            // Send CELO reward to player
            (bool success, ) = payable(msg.sender).call{value: totalReward}("");
            require(success, "CELO transfer failed");
            
            emit LevelReached(msg.sender, newLevel, totalReward);
        }
    }
    
    /**
     * @dev Get player level and earned CELO
     */
    function getPlayerProgress(address player) external view returns (PlayerProgress memory) {
        return players[player];
    }
    
    /**
     * @dev Calculate level from score
     */
    function calculateLevel(uint256 score) external view returns (uint256) {
        return score / levelThreshold;
    }
    
    /**
     * @dev Owner functions
     */
    function setTreasuryAddress(address _newTreasury) external onlyOwner {
        require(_newTreasury != address(0), "Invalid address");
        treasuryAddress = _newTreasury;
        emit TreasuryUpdated(_newTreasury);
    }
    
    function setRewardConfig(uint256 _rewardPerLevel, uint256 _levelThreshold) external onlyOwner {
        rewardPerLevel = _rewardPerLevel;
        levelThreshold = _levelThreshold;
        emit RewardConfigured(_rewardPerLevel, _levelThreshold);
    }
    
    /**
     * @dev Fund the treasury with CELO
     */
    function fundTreasury() external payable onlyOwner {
        emit TreasuryFunded(msg.value);
    }
    
    /**
     * @dev Get treasury balance
     */
    function getTreasuryBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @dev Withdraw from treasury
     */
    function withdrawFromTreasury(uint256 amount) external onlyOwner nonReentrant {
        require(address(this).balance >= amount, "Insufficient balance");
        (bool success, ) = payable(owner()).call{value: amount}("");
        require(success, "Withdrawal failed");
    }
    
    /**
     * @dev Allow receiving CELO
     */
    receive() external payable {
        emit TreasuryFunded(msg.value);
    }
}
