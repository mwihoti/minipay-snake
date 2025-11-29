'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { GameState } from '@/lib/gameEngine';

interface PlayerData {
  highScore: number;
  totalGames: number;
  claimedLevels: number[];
  achievements: string[];
  lastPlayed: string;
}

interface PlayerStatsProps {
  gameState: GameState;
  onClose?: () => void;
}

export const PlayerStats: React.FC<PlayerStatsProps> = ({ gameState, onClose }) => {
  const { address, isConnected } = useAccount();
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [scoreProcessed, setScoreProcessed] = useState(false);

  // Load player data from localStorage
  useEffect(() => {
    const loadPlayerData = () => {
      if (!address) {
        setLoading(false);
        return;
      }

      try {
        const storageKey = `player_stats_${address.toLowerCase()}`;
        const stored = localStorage.getItem(storageKey);
        
        if (stored) {
          const data = JSON.parse(stored) as PlayerData;
          setPlayerData(data);
        } else {
          // Initialize new player
          setPlayerData({
            highScore: 0,
            totalGames: 0,
            claimedLevels: [],
            achievements: [],
            lastPlayed: new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error('Failed to load player data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPlayerData();
    setScoreProcessed(false); // Reset when address changes
  }, [address]);

  // Update high score when game ends
  useEffect(() => {
    const currentScore = gameState.score;
    
    if (gameState.gameOver && currentScore > 0 && playerData && address && !scoreProcessed) {
      const newHighScore = Math.max(playerData.highScore, currentScore);
      const newTotalGames = playerData.totalGames + 1;
      
      // Check for achievements
      const newAchievements = [...playerData.achievements];
      
      if (currentScore >= 1000 && !newAchievements.includes('first_1000')) {
        newAchievements.push('first_1000');
      }
      if (currentScore >= 2000 && !newAchievements.includes('pro_player')) {
        newAchievements.push('pro_player');
      }
      if (currentScore >= 5000 && !newAchievements.includes('snake_master')) {
        newAchievements.push('snake_master');
      }
      if (newTotalGames >= 10 && !newAchievements.includes('veteran')) {
        newAchievements.push('veteran');
      }

      const updatedData: PlayerData = {
        ...playerData,
        highScore: newHighScore,
        totalGames: newTotalGames,
        achievements: newAchievements,
        lastPlayed: new Date().toISOString(),
      };

      setPlayerData(updatedData);
      
      // Save to localStorage
      const storageKey = `player_stats_${address.toLowerCase()}`;
      localStorage.setItem(storageKey, JSON.stringify(updatedData));
      
      // Mark as processed
      setScoreProcessed(true);
      
      console.log('Player stats updated:', updatedData);
    }
  }, [gameState.gameOver, gameState.score, address, playerData, scoreProcessed]);

  if (!isConnected || loading) {
    return null;
  }

  if (!playerData) {
    return null;
  }

  const achievementsList = [
    { id: 'first_1000', name: '🎯 First Milestone', description: 'Reached 1000 points', unlocked: playerData.achievements.includes('first_1000') },
    { id: 'pro_player', name: '🏆 Pro Player', description: 'Reached 2000 points', unlocked: playerData.achievements.includes('pro_player') },
    { id: 'snake_master', name: '👑 Snake Master', description: 'Reached 5000 points', unlocked: playerData.achievements.includes('snake_master') },
    { id: 'veteran', name: '⭐ Veteran', description: 'Played 10 games', unlocked: playerData.achievements.includes('veteran') },
  ];

  return (
    <div className="mt-4 bg-purple-900/30 border-2 border-purple-400 rounded-lg p-4">
      <div className="text-white mb-3">
        <div className="font-bold mb-3 text-lg flex items-center justify-between">
          <span>📊 Your Stats</span>
          {onClose && (
            <button onClick={onClose} className="text-xs text-gray-400 hover:text-white">✕</button>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-black/30 rounded p-2">
            <div className="text-xs text-gray-300">High Score</div>
            <div className="text-xl font-bold text-yellow-300">{playerData.highScore}</div>
          </div>
          <div className="bg-black/30 rounded p-2">
            <div className="text-xs text-gray-300">Total Games</div>
            <div className="text-xl font-bold text-green-300">{playerData.totalGames}</div>
          </div>
          <div className="bg-black/30 rounded p-2">
            <div className="text-xs text-gray-300">Levels Claimed</div>
            <div className="text-xl font-bold text-blue-300">{playerData.claimedLevels.length}</div>
          </div>
          <div className="bg-black/30 rounded p-2">
            <div className="text-xs text-gray-300">Achievements</div>
            <div className="text-xl font-bold text-purple-300">{playerData.achievements.length}/4</div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="mt-4">
          <div className="text-sm font-bold mb-2 text-purple-300">🏆 Achievements</div>
          <div className="space-y-2">
            {achievementsList.map(achievement => (
              <div
                key={achievement.id}
                className={`text-xs p-2 rounded ${
                  achievement.unlocked
                    ? 'bg-purple-600/30 border border-purple-400'
                    : 'bg-gray-800/30 border border-gray-600 opacity-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold">{achievement.name}</div>
                    <div className="text-gray-300 text-[10px]">{achievement.description}</div>
                  </div>
                  {achievement.unlocked && <span className="text-green-400">✓</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View On-Chain Button */}
        <div className="mt-4">
          <a
            href={`https://celo-sepolia.blockscout.com/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 text-xs font-bold rounded transition text-center"
          >
            🔗 View My Transactions On-Chain
          </a>
          <a
            href={`https://celo-sepolia.blockscout.com/address/${process.env.NEXT_PUBLIC_TREASURY_CONTRACT}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 text-xs font-bold rounded transition text-center"
          >
            📊 View Treasury Contract
          </a>
        </div>

        {/* Last Played */}
        <div className="mt-3 text-[10px] text-gray-400 text-center">
          Last played: {new Date(playerData.lastPlayed).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};
