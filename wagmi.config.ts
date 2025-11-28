import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { celoSepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Park Snake - Play to Earn',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'celo-park-snake',
  chains: [celoSepolia],
  ssr: true,
});
