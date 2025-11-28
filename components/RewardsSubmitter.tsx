'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useContractWrite, useWaitForTransactionReceipt } from 'wagmi';
import { GameState } from '@/lib/gameEngine';

const REWARDS_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_REWARDS_CONTRACT || '0x0000000000000000000000000000000000000000';

const SUBMIT_SCORE_ABI = [
  {
    name: 'submitScore',
    type: 'function',
    inputs: [
      { name: 'score', type: 'uint256' },
      { name: 'sunsetMode', type: 'bool' },
    ],
    outputs: [],
  },
] as const;

interface RewardsSubmitterProps {
  gameState: GameState;
  onScoreSubmitted?: (reward: number) => void;
}

export const RewardsSubmitter: React.FC<RewardsSubmitterProps> = ({ gameState, onScoreSubmitted }) => {
  const { address, isConnected } = useAccount();
  const [submitted, setSubmitted] = useState(false);
  const [estimatedReward, setEstimatedReward] = useState(0);

  // Calculate estimated reward
  useEffect(() => {
    if (gameState.gameOver) {
      let reward = gameState.score / 100; // Base: 0.01 cUSD per point
      
      if (gameState.sunsetMode) {
        reward *= 1.5; // 50% bonus
      }
      
      setEstimatedReward(Math.min(reward, 100)); // Max 100 cUSD
    }
  }, [gameState.gameOver, gameState.score, gameState.sunsetMode]);

  const handleSubmitToBlockchain = async () => {
    if (!isConnected || !address) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      setSubmitted(true);
      
      // Contract interaction would happen here
      // For now, show simulated success
      setTimeout(() => {
        setSubmitted(false);
        onScoreSubmitted?.(estimatedReward);
      }, 2000);
    } catch (error) {
      console.error('Failed to submit score:', error);
      setSubmitted(false);
    }
  };

  return (
    <>
      {gameState.gameOver && isConnected && (
        <div className="mt-4 bg-blue-500/20 border-2 border-blue-400 rounded-lg p-4">
          <div className="text-white text-sm mb-3">
            <div className="font-bold mb-2">💰 Play-to-Earn Rewards</div>
            <div>
              Base Reward: <span className="text-yellow-300">{(gameState.score / 100).toFixed(2)}</span> cUSD
            </div>
            {gameState.sunsetMode && (
              <div>
                Sunset Bonus: <span className="text-orange-300">+50%</span>
              </div>
            )}
            <div className="border-t border-blue-300 mt-2 pt-2 font-bold">
              Total Reward: <span className="text-green-300">${estimatedReward.toFixed(2)}</span> cUSD
            </div>
          </div>

          <button
            onClick={handleSubmitToBlockchain}
            disabled={submitted}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white py-2 px-4 text-sm font-bold rounded transition"
          >
            {submitted ? '⏳ SUBMITTING TO BLOCKCHAIN...' : '🚀 CLAIM REWARD ON CELO'}
          </button>
        </div>
      )}
    </>
  );
};
