import { 
  createPublicClient, 
  http, 
  formatEther,
  createWalletClient,
  custom,
  parseUnits,
} from 'viem';
import { celo, celoSepolia } from 'viem/chains';

const STABLE_TOKEN_ADDRESS = '0x765DE816845861e75A25fCA122bb6898B8B1282a'; // cUSD on mainnet
const STABLE_TOKEN_ADDRESS_TESTNET = '0x86a37b6Ca4f0123b643f785385Eb0860D5EE810d'; // cUSD on Sepolia

// Simple ERC20 ABI for balance checks
const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
] as const;

export async function getMiniPayAddress(): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  if ((window as any).ethereum?.isMiniPay) {
    try {
      const accounts = await (window as any).ethereum.request({
        method: 'eth_requestAccounts',
        params: [],
      });
      return accounts[0] as string;
    } catch (error) {
      console.error('Failed to get MiniPay address:', error);
      return null;
    }
  }
  return null;
}

export async function getBalance(address: string, isTestnet = false): Promise<string> {
  const publicClient = createPublicClient({
    chain: isTestnet ? celoSepolia : celo,
    transport: http(),
  });

  const tokenAddress = isTestnet ? STABLE_TOKEN_ADDRESS_TESTNET : STABLE_TOKEN_ADDRESS;

  try {
    // Use call to get balance - balanceOf(address) function selector
    const data = '0x70a08231' + address.slice(2).padStart(64, '0') as `0x${string}`;
    const result = await publicClient.call({
      account: address as `0x${string}`,
      to: tokenAddress as `0x${string}`,
      data: data,
    });

    if (result.data) {
      const balance = BigInt(result.data);
      return formatEther(balance);
    }
    return '0';
  } catch (error) {
    console.error('Failed to get balance:', error);
    return '0';
  }
}

export async function submitScore(
  score: number,
  address: string,
  isTestnet = false
): Promise<string | null> {
  if (typeof window === 'undefined' || !window.ethereum) return null;

  try {
    const walletClient = createWalletClient({
      chain: isTestnet ? celoSepolia : celo,
      transport: custom(window.ethereum),
    });

    const publicClient = createPublicClient({
      chain: isTestnet ? celoSepolia : celo,
      transport: http(),
    });

    // Calculate reward: 1 cUSD per 100 points, minimum 0.01 cUSD
    const rewardAmount = Math.max(0.01, score / 100);
    const rewardInWei = parseUnits(rewardAmount.toString(), 18);

    // For demo: we'd normally call a contract to register the score
    // For now, we'll just log and return a mock transaction
    console.log(`Score submitted: ${score} points = ${rewardAmount} cUSD reward`);

    // Mock transaction return for demo
    return Math.random().toString(36).substring(2, 15);
  } catch (error) {
    console.error('Failed to submit score:', error);
    return null;
  }
}

export async function estimateGasFee(isTestnet = false): Promise<string> {
  const publicClient = createPublicClient({
    chain: isTestnet ? celoSepolia : celo,
    transport: http(),
  });

  const tokenAddress = isTestnet ? STABLE_TOKEN_ADDRESS_TESTNET : STABLE_TOKEN_ADDRESS;

  try {
    const gasPrice = await publicClient.request({
      method: 'eth_gasPrice',
      params: [tokenAddress],
    });

    // Estimate gas for a simple transaction: ~21000 gas
    const estimatedGas = 21000;
    const gasPriceBigInt = BigInt(gasPrice as string);
    const totalGasWei = gasPriceBigInt * BigInt(estimatedGas);

    return formatEther(totalGasWei);
  } catch (error) {
    console.error('Failed to estimate gas fee:', error);
    return '0.001'; // Fallback estimate
  }
}

export async function checkTransactionStatus(hash: string, isTestnet = false): Promise<boolean> {
  const publicClient = createPublicClient({
    chain: isTestnet ? celoSepolia : celo,
    transport: http(),
  });

  try {
    const receipt = await publicClient.getTransactionReceipt({
      hash: hash as `0x${string}`,
    });

    return receipt.status === 'success';
  } catch (error) {
    console.error('Failed to check transaction status:', error);
    return false;
  }
}

// Leaderboard submission (would connect to a backend API or on-chain contract)
export interface LeaderboardEntry {
  address: string;
  score: number;
  timestamp: number;
  txHash?: string;
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  // In production, this would fetch from a backend or contract
  // For now, return mock data
  return [
    { address: '0x1234...abcd', score: 5000, timestamp: Date.now() - 86400000 },
    { address: '0x5678...efgh', score: 4500, timestamp: Date.now() - 43200000 },
    { address: '0x9abc...ijkl', score: 3200, timestamp: Date.now() - 21600000 },
  ];
}
