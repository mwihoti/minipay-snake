// MiniPay compatibility utilities and configuration

export const isMiniPay = (): boolean => {
  if (typeof window === 'undefined') return false;
  return (window.ethereum as any)?.isMiniPay === true;
};

export const getMiniPayChain = () => {
  // Use Celo Sepolia for testnet (which MiniPay uses in dev mode)
  // Use Celo mainnet for production
  const isTestnet = process.env.NEXT_PUBLIC_NETWORK === 'testnet';
  return isTestnet ? 'celoSepolia' : 'celo';
};

export const getMiniPayRpcUrl = () => {
  const isTestnet = process.env.NEXT_PUBLIC_NETWORK === 'testnet';
  return isTestnet
    ? 'https://alfajores-forno.celo-testnet.org'
    : 'https://forno.celo.org';
};

/**
 * MiniPay requires:
 * 1. Custom fee abstraction (feeCurrency: cUSD)
 * 2. Legacy transactions (no EIP-1559)
 * 3. Only cUSD stablecoin
 */
export const getMiniPayTransactionConfig = () => {
  return {
    feeCurrency: process.env.NEXT_PUBLIC_cUSD_ADDRESS || '0x86a37b6Ca4f0123b643f785385Eb0860D5EE810d',
    // MiniPay expects legacy transaction format
    maxFeePerGas: undefined, // Not supported in MiniPay
    maxPriorityFeePerGas: undefined, // Not supported in MiniPay
  };
};

/**
 * Format a transaction for MiniPay compatibility
 */
export const formatMiniPayTransaction = (tx: any) => {
  // Remove EIP-1559 properties
  const miniPayTx = { ...tx };
  delete miniPayTx.maxFeePerGas;
  delete miniPayTx.maxPriorityFeePerGas;

  // Add MiniPay fee currency
  miniPayTx.feeCurrency = process.env.NEXT_PUBLIC_cUSD_ADDRESS || '0x86a37b6Ca4f0123b643f785385Eb0860D5EE810d';

  return miniPayTx;
};

/**
 * Get ngrok URL if available (for local testing)
 */
export const getNgrokUrl = (): string | null => {
  if (typeof window === 'undefined') return null;
  const url = new URL(window.location.href);
  const ngrokHeader = (window as any)['ngrok-skip-browser-warning'];
  
  // Check if running under ngrok
  if (url.hostname.includes('ngrok')) {
    return url.origin;
  }
  return null;
};
