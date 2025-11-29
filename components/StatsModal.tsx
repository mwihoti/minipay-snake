'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { fetchOnChainClaims, getOnChainProgress, OnChainClaim } from '@/lib/onChainStats';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose }) => {
  const { address, isConnected } = useAccount();
  const [claims, setClaims] = useState<OnChainClaim[]>([]);
  const [totalRewards, setTotalRewards] = useState(0);
  const [highestLevel, setHighestLevel] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address || !isConnected || !isOpen) return;

    // Load claims from blockchain
    const loadOnChainData = async () => {
      setLoading(true);
      try {
        const treasuryAddress = process.env.NEXT_PUBLIC_TREASURY_CONTRACT;
        if (!treasuryAddress) {
          console.error('Treasury contract not configured');
          setLoading(false);
          return;
        }

        // Fetch on-chain events
        const onChainClaims = await fetchOnChainClaims(address, treasuryAddress);
        setClaims(onChainClaims);

        // Fetch player progress from contract
        const progress = await getOnChainProgress(address, treasuryAddress);
        
        if (progress && progress.exists) {
          setTotalRewards(parseFloat(progress.totalEarned));
          setHighestLevel(progress.lastRewardedLevel);
        } else if (onChainClaims.length > 0) {
          // Fallback: calculate from events
          const total = onChainClaims.reduce((sum, claim) => sum + parseFloat(claim.reward), 0);
          setTotalRewards(total);
          const maxLevel = Math.max(...onChainClaims.map(c => c.level), 0);
          setHighestLevel(maxLevel);
        }

        console.log('Loaded on-chain data:', { onChainClaims, progress });
      } catch (error) {
        console.error('Failed to load on-chain data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOnChainData();
  }, [address, isConnected, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 pointer-events-auto">
      <div className="bg-gradient-to-b from-green-900 to-green-950 border-4 border-yellow-600 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-2xl font-bold text-yellow-300">🏆 My Game Stats</div>
          <button
            onClick={onClose}
            className="text-white hover:text-red-400 text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-black/40 rounded-lg p-4 text-center border-2 border-purple-500">
            <div className="text-xs text-gray-300 mb-1">Highest Level</div>
            <div className="text-3xl font-bold text-purple-300">{highestLevel}</div>
          </div>
          <div className="bg-black/40 rounded-lg p-4 text-center border-2 border-green-500">
            <div className="text-xs text-gray-300 mb-1">Total Claims</div>
            <div className="text-3xl font-bold text-green-300">{claims.length}</div>
          </div>
          <div className="bg-black/40 rounded-lg p-4 text-center border-2 border-yellow-500">
            <div className="text-xs text-gray-300 mb-1">Total Earned</div>
            <div className="text-3xl font-bold text-yellow-300">{totalRewards.toFixed(2)}</div>
            <div className="text-[10px] text-gray-400">CELO</div>
          </div>
        </div>

        {/* Claims History */}
        <div className="mb-4">
          <div className="text-lg font-bold text-yellow-300 mb-3">📜 Reward Claims History</div>
          
          {loading ? (
            <div className="bg-black/40 rounded-lg p-8 text-center border-2 border-gray-600">
              <div className="text-gray-400 text-sm">⏳ Loading on-chain data...</div>
            </div>
          ) : claims.length === 0 ? (
            <div className="bg-black/40 rounded-lg p-8 text-center border-2 border-gray-600">
              <div className="text-gray-400 text-sm">No level rewards claimed yet</div>
              <div className="text-gray-500 text-xs mt-2">Play and reach 1000 points to unlock Level 1!</div>
            </div>
          ) : (
            <div className="space-y-3">
              {claims.map((claim, index) => (
                <div
                  key={index}
                  className="bg-black/40 rounded-lg p-4 border-2 border-blue-500 hover:border-blue-400 transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">🎯</div>
                      <div>
                        <div className="text-white font-bold">Level {claim.level}</div>
                        <div className="text-xs text-gray-400">
                          Block: {claim.blockNumber}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-300 font-bold text-lg">+{claim.reward} CELO</div>
                      <div className="text-[10px] text-gray-400">
                        {new Date(claim.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  {/* Transaction Link */}
                  <a
                    href={`https://celo-sepolia.blockscout.com/tx/${claim.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-xs font-bold text-center transition"
                  >
                    🔗 View Transaction: {claim.txHash.slice(0, 10)}...{claim.txHash.slice(-8)}
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex gap-3 mt-6">
          <a
            href={`https://celo-sepolia.blockscout.com/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-bold text-center transition"
          >
            📊 View All Transactions
          </a>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-bold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
