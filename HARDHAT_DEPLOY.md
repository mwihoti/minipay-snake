# Hardhat Deployment Guide for SnakeGameRewards

## Setup

1. **Install dependencies:**
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @nomicfoundation/hardhat-verify dotenv
npm install ethers
```

2. **Create `.env.local` in project root:**
```bash
PRIVATE_KEY=0x...your_private_key...
CELOSCAN_API_KEY=your_celoscan_api_key
```

**Get these from:**
- **PRIVATE_KEY**: Export from MetaMask (Settings → Account → Export Private Key)
- **CELOSCAN_API_KEY**: [celoscan.io](https://celoscan.io/apis) → Create API Key

## Deployment Steps

### 1. Compile the contract
```bash
npx hardhat compile
```

### 2. Deploy to Celo Sepolia
```bash
npx hardhat run scripts/deploy.js --network celoSepolia
```

This will output:
```
✅ SnakeGameRewards deployed to: 0x...
📝 Next steps:
1. Add to .env.local:
   NEXT_PUBLIC_REWARDS_CONTRACT=0x...
```

**Copy the contract address!**

### 3. Update frontend `.env.local`
```bash
echo "NEXT_PUBLIC_REWARDS_CONTRACT=0x..." >> .env.local
```

### 4. Fund the contract with testnet cUSD
First, get testnet cUSD from [faucet.celo.org](https://faucet.celo.org)

Then run:
```bash
npx hardhat run scripts/fund-contract.js --network celoSepolia
```

This funds the contract with 100 cUSD to pay player rewards.

### 5. Verify contract on CeloScan (optional but recommended)
```bash
npx hardhat verify 0x...CONTRACT_ADDRESS... --network celoSepolia
```

Then view on [CeloScan](https://sepolia.celoscan.io)

## Verify Deployment

Check contract state:
```bash
npx hardhat run scripts/check-contract.js --network celoSepolia
```

## Networks

- **Testnet**: `celoSepolia` (11142220)
- **Mainnet**: `celo` (42220)

## Troubleshooting

**"Insufficient funds"**
- Get testnet CELO from [faucet.celo.org](https://faucet.celo.org)

**"Private key not found"**
- Make sure `.env.local` is in the project root with `PRIVATE_KEY=0x...`

**"Contract not verified"**
- CeloScan might be indexing. Wait a few minutes and try again.
- Make sure CELOSCAN_API_KEY is correct

## Commands Reference

```bash
# Compile
npx hardhat compile

# Deploy
npx hardhat run scripts/deploy.js --network celoSepolia

# Fund (after getting testnet cUSD)
npx hardhat run scripts/fund-contract.js --network celoSepolia

# Verify on block explorer
npx hardhat verify 0x... --network celoSepolia
```
