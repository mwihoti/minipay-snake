'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { GameState } from '@/lib/gameEngine';
import { calculateLevelFromScore, getPlayerLevel, submitScoreWithLevelRewards } from '@/lib/treasuryIntegration';

interface LevelMilestoneProps {
  gameState: GameState;
  onLevelUp?: (level: number, reward: string) => void;
}

const LEVEL_TARGETS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const REWARD_PER_LEVEL = '0.3'; // CELO per level
const LEVEL_SCORE_THRESHOLD = 1000; // Score needed per level

export const LevelMilestone: React.FC<LevelMilestoneProps> = ({ gameState, onLevelUp }) => {
  const { address, isConnected } = useAccount();
  const [currentLevel, setCurrentLevel] = useState(0);
  const [nextLevelScore, setNextLevelScore] = useState(1000);
  const [claimedLevels, setClaimedLevels] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate current level and next target
  useEffect(() => {
    const level = Math.floor(gameState.score / LEVEL_SCORE_THRESHOLD);
    setCurrentLevel(level);
    setNextLevelScore((level + 1) * LEVEL_SCORE_THRESHOLD);
  }, [gameState.score]);

  // Load player progress on mount (from contract + localStorage)
  useEffect(() => {
    const loadProgress = async () => {
      if (!address || !isConnected) return;

      const treasuryAddress = process.env.NEXT_PUBLIC_TREASURY_CONTRACT;
      if (!treasuryAddress) return;

      try {
        // Load from contract
        const progress = await getPlayerLevel(address, treasuryAddress);
        if (progress && progress.exists) {
          const contractLevels = Array.from({ length: Number(progress.lastRewardedLevel) }, (_, i) => i + 1);
          
          // Also load from localStorage (in case of offline claims)
          const storageKey = `claimed_levels_${address.toLowerCase()}`;
          const stored = localStorage.getItem(storageKey);
          const storedLevels = stored ? JSON.parse(stored) : [];
          
          // Merge both sources (contract is source of truth)
          const allLevels = [...new Set([...contractLevels, ...storedLevels])];
          setClaimedLevels(allLevels);
          
          // Update player stats in localStorage
          const statsKey = `player_stats_${address.toLowerCase()}`;
          const statsStored = localStorage.getItem(statsKey);
          if (statsStored) {
            const stats = JSON.parse(statsStored);
            stats.claimedLevels = allLevels;
            localStorage.setItem(statsKey, JSON.stringify(stats));
          }
        }
      } catch (error) {
        console.error('Failed to load progress:', error);
      }
    };

    loadProgress();
  }, [address, isConnected]);

  const handleClaimLevel = async () => {
    if (!isConnected || !address || gameState.gamePaused) return;

    const treasuryAddress = process.env.NEXT_PUBLIC_TREASURY_CONTRACT;
    if (!treasuryAddress) {
      alert('Treasury not configured');
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await submitScoreWithLevelRewards(gameState.score, treasuryAddress);

      if (result.success && result.txHash) {
        const newClaimedLevels = [...claimedLevels, currentLevel];
        setClaimedLevels(newClaimedLevels);
        
        // Persist to localStorage
        const storageKey = `claimed_levels_${address.toLowerCase()}`;
        localStorage.setItem(storageKey, JSON.stringify(newClaimedLevels));
        
        // Save claim details for stats modal
        const claimKey = `level_claims_${address.toLowerCase()}`;
        const existingClaims = localStorage.getItem(claimKey);
        const claims = existingClaims ? JSON.parse(existingClaims) : [];
        
        claims.push({
          level: currentLevel,
          score: gameState.score,
          reward: REWARD_PER_LEVEL,
          txHash: result.txHash,
          timestamp: new Date().toISOString(),
        });
        
        localStorage.setItem(claimKey, JSON.stringify(claims));
        
        // Update player stats
        const statsKey = `player_stats_${address.toLowerCase()}`;
        const statsStored = localStorage.getItem(statsKey);
        if (statsStored) {
          const stats = JSON.parse(statsStored);
          stats.claimedLevels = newClaimedLevels;
          localStorage.setItem(statsKey, JSON.stringify(stats));
        }
        
        onLevelUp?.(currentLevel, REWARD_PER_LEVEL);
        alert(`🎉 Level ${currentLevel} reached!\n💰 Received ${REWARD_PER_LEVEL} CELO!\n\n🔗 Tx: ${result.txHash.slice(0, 10)}...`);
      } else {
        alert('Failed to claim level reward');
      }
    } catch (error) {
      console.error('Failed to claim:', error);
      alert('Error claiming reward');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isConnected || !gameState.gameOver) return null;

  return (
    <div className="mt-4 bg-purple-500/20 border-2 border-purple-400 rounded-lg p-4">
      <div className="text-white mb-3">
        <div className="font-bold mb-2 text-lg">📊 LEVEL PROGRESSION</div>

        {/* Level Bar */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <div className="text-sm">
              Level <span className="text-purple-300 font-bold">{currentLevel}</span>
            </div>
            <div className="text-xs text-gray-300">
              {gameState.score} / {nextLevelScore}
            </div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div
              className="bg-purple-500 h-3 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, ((gameState.score % 1000) / 1000) * 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Targets (1-10) */}
        <div className="mb-3">
          <div className="text-xs font-bold mb-2">TARGETS REACHED:</div>
          <div className="grid grid-cols-5 gap-2">
            {LEVEL_TARGETS.map((target) => (
              <div
                key={target}
                className={`p-2 rounded text-center text-xs font-bold border ${
                  claimedLevels.includes(target)
                    ? 'bg-green-600 border-green-500 text-white'
                    : currentLevel >= target
                      ? 'bg-yellow-600 border-yellow-500 text-white'
                      : 'bg-gray-600 border-gray-500 text-gray-300'
                }`}
              >
                {target}
                {claimedLevels.includes(target) && '✓'}
              </div>
            ))}
          </div>
        </div>

        {/* Claim Button */}
        {currentLevel > 0 && !claimedLevels.includes(currentLevel) && (
          <button
            onClick={handleClaimLevel}
            disabled={isSubmitting}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white py-2 px-4 text-sm font-bold rounded transition mt-2"
          >
            {isSubmitting ? '⏳ CLAIMING...' : `💰 CLAIM LEVEL ${currentLevel} (${REWARD_PER_LEVEL} CELO)`}
          </button>
        )}

        {claimedLevels.includes(currentLevel) && (
          <div className="mt-2 text-center text-green-300 text-sm font-bold">
            ✓ Level {currentLevel} Already Claimed!
          </div>
        )}

        <div className="text-xs text-gray-300 mt-2">
          Score {nextLevelScore - gameState.score} more to reach level {currentLevel + 1}
        </div>
      </div>
    </div>
  );
};
