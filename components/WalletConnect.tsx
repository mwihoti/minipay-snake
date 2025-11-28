'use client';

import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance } from 'wagmi';

export const WalletConnect: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address, query: { enabled: isConnected } });

  return (
    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
      <ConnectButton 
        accountStatus={{
          smallScreen: 'avatar',
          largeScreen: 'full',
        }}
        chainStatus="full"
        showBalance={{
          smallScreen: false,
          largeScreen: true,
        }}
      />
      
      {isConnected && balance && (
        <div className="text-sm text-white text-right">
          <div className="opacity-75">cUSD Balance</div>
          <div className="font-bold text-green-300">
            ${Number(balance?.formatted || 0).toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
};
