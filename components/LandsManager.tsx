'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useContractRead, useContractWrite, useWaitForTransactionReceipt } from 'wagmi';

const REWARDS_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_REWARDS_CONTRACT || '0x0000000000000000000000000000000000000000';

const LAND_ABI = [
  {
    name: 'getAllLands',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      {
        type: 'tuple[]',
        components: [
          { name: 'id', type: 'uint256' },
          { name: 'landType', type: 'uint8' },
          { name: 'name', type: 'string' },
          { name: 'description', type: 'string' },
          { name: 'price', type: 'uint256' },
          { name: 'purchased', type: 'bool' },
          { name: 'rewardMultiplier', type: 'uint256' },
        ],
      },
    ],
  },
  {
    name: 'getPlayerStats',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'player', type: 'address' }],
    outputs: [
      {
        type: 'tuple',
        components: [
          { name: 'totalEarned', type: 'uint256' },
          { name: 'totalScored', type: 'uint256' },
          { name: 'gamesPlayed', type: 'uint256' },
          { name: 'activeLandId', type: 'uint256' },
          { name: 'exists', type: 'bool' },
        ],
      },
    ],
  },
  {
    name: 'activateLand',
    type: 'function',
    inputs: [{ name: 'landId', type: 'uint256' }],
    outputs: [],
  },
  {
    name: 'purchaseLand',
    type: 'function',
    inputs: [{ name: 'landId', type: 'uint256' }],
    outputs: [],
  },
] as const;

interface Land {
  id: number;
  landType: number;
  name: string;
  description: string;
  price: bigint;
  purchased: boolean;
  rewardMultiplier: number;
}

interface PlayerStats {
  totalEarned: bigint;
  totalScored: bigint;
  gamesPlayed: bigint;
  activeLandId: bigint;
  exists: boolean;
}

export const LandsManager: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [lands, setLands] = useState<Land[]>([]);
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [activatingLand, setActivatingLand] = useState<number | null>(null);

  // Load lands
  useEffect(() => {
    const loadLands = async () => {
      if (!isConnected) return;
      // This would be called via contract interaction
      // For now, we'll set default lands
      setLands([
        {
          id: 1,
          landType: 0,
          name: 'Sunny Park',
          description: 'A beautiful sunny park with green grass',
          price: 0n,
          purchased: true,
          rewardMultiplier: 100,
        },
        {
          id: 2,
          landType: 1,
          name: 'Enchanted Forest',
          description: 'A magical forest with tall trees',
          price: 10n * 10n ** 18n,
          purchased: false,
          rewardMultiplier: 150,
        },
      ]);
    };

    loadLands();
  }, [isConnected]);

  const handleActivateLand = (landId: number) => {
    setActivatingLand(landId);
    // Contract call would happen here
    setTimeout(() => {
      setActivatingLand(null);
      setShowModal(false);
    }, 1000);
  };

  const landTypeEmoji = (type: number) => (type === 0 ? '🌳' : '🌲');

  return (
    <>
      {/* Lands Button */}
      <button
        onClick={() => setShowModal(true)}
        className="absolute top-4 right-4 md:right-auto md:left-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-bold pointer-events-auto transition"
      >
        🏞️ Lands
      </button>

      {/* Lands Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 pointer-events-auto">
          <div className="bg-gradient-to-b from-green-900 to-green-800 rounded-lg p-6 max-w-2xl w-full mx-4 border-4 border-yellow-600 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-2xl font-bold">🏞️ Select Your Land</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-white text-2xl hover:text-red-300"
              >
                ✕
              </button>
            </div>

            {isConnected ? (
              <div className="space-y-3">
                {lands.map(land => (
                  <div
                    key={land.id}
                    className="bg-green-700/50 border-2 border-yellow-500 rounded-lg p-4 hover:bg-green-600/50 transition"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg">
                          {landTypeEmoji(land.landType)} {land.name}
                        </h3>
                        <p className="text-green-100 text-sm">{land.description}</p>
                        <div className="text-yellow-300 text-sm mt-2">
                          🎁 Reward Multiplier: {(land.rewardMultiplier / 100).toFixed(1)}x
                        </div>
                        {land.price > 0n && (
                          <div className="text-orange-300 text-sm">
                            💰 Price: {Number(land.price) / 10 ** 18} cUSD
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleActivateLand(land.id)}
                        disabled={activatingLand === land.id}
                        className={`ml-4 px-4 py-2 rounded font-bold transition ${
                          land.purchased || land.price === 0n
                            ? 'bg-green-600 hover:bg-green-700 active:bg-green-800 text-white disabled:bg-gray-500'
                            : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white disabled:bg-gray-500'
                        }`}
                      >
                        {activatingLand === land.id
                          ? '...'
                          : land.purchased || land.price === 0n
                            ? 'Activate'
                            : 'Buy'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-white text-center py-8">
                <p className="mb-4">Connect your wallet to manage lands</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
