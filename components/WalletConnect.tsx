'use client';

import React, { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance, useConnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { StatsModal } from './StatsModal';

export const WalletConnect: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address, query: { enabled: isConnected } });
  const { connect } = useConnect();
  const [hideConnectBtn, setHideConnectBtn] = useState(false);
  const [isMiniPay, setIsMiniPay] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);

  // Auto-connect if MiniPay
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const isMiniPayDetected = (window.ethereum as any).isMiniPay;
      setIsMiniPay(isMiniPayDetected);

      if (isMiniPayDetected) {
        // Hide connect button when inside MiniPay
        setHideConnectBtn(true);

        // Auto-connect with MiniPay
        if (!isConnected) {
          try {
            connect({ connector: injected({ target: 'metaMask' }) });
          } catch (error) {
            console.log('MiniPay auto-connect:', error);
          }
        }
      }
    }
  }, [connect, isConnected]);

  if (isMiniPay && hideConnectBtn) {
    // Inside MiniPay - show balance only
    return (
      <>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
            {isConnected && balance && (
              <div className="text-sm text-white text-right">
                <div className="opacity-75">cUSD Balance</div>
                <div className="font-bold text-green-300">
                  ${Number(balance?.formatted || 0).toFixed(2)}
                </div>
              </div>
            )}
          </div>
          {isConnected && address && (
            <button
              onClick={() => setIsStatsOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 text-xs font-bold rounded-lg transition text-center"
              title="View your achievements and transactions"
            >
              🏆 My Stats
            </button>
          )}
        </div>
        <StatsModal isOpen={isStatsOpen} onClose={() => setIsStatsOpen(false)} />
      </>
    );
  }

  // Outside MiniPay - show full Rainbow connect button
  return (
    <>
      <div className="flex flex-col gap-2">
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
        
        {isConnected && address && (
          <button
            onClick={() => setIsStatsOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 text-xs font-bold rounded-lg transition text-center"
            title="View your achievements and transactions"
          >
            🏆 My Stats
          </button>
        )}
      </div>
      <StatsModal isOpen={isStatsOpen} onClose={() => setIsStatsOpen(false)} />
    </>
  );
};
