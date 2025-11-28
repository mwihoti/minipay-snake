# Smart Contract Deployment - Quick Reference 🚀

## TL;DR - 10 Minute Deploy

### 1. Go to Remix
https://remix.ethereum.org

### 2. Create SnakeGameRewards.sol
Copy the entire content from:
`/home/daniel/work/celo/minipay-snake/contracts/SnakeGameRewards.sol`

### 3. Compile
- Select Solidity Compiler
- Version: 0.8.20
- Click "Compile"

### 4. Deploy to Sepolia
1. Left sidebar → Deploy
2. Environment: "Injected Provider - MetaMask"
3. Connect MetaMask to Celo Sepolia
4. Click "Deploy"
5. Approve transaction

### 5. Copy Contract Address
After deployment, copy the address:
```
0xAbC123DeF456... (from the "Deployed Contracts" section)
```

### 6. Update .env.local
```env
NEXT_PUBLIC_REWARDS_CONTRACT=0xAbC123DeF456...
```

### 7. Fund Contract
Send testnet cUSD to your contract:
1. Get cUSD: https://faucet.celo-testnet.org
2. Send to contract address (any amount, 1-100 cUSD)

### 8. Done! 🎉
Your game now pays out real cUSD rewards!

---

## Detailed Deployment Guide

### Prerequisites
- MetaMask or similar wallet
- 0.1+ Celo (for gas fees) - optional, faucet might work
- Celo Sepolia added to MetaMask

### Adding Celo Sepolia to MetaMask

**Manual:**
1. Open MetaMask
2. Settings → Networks → Add Network
3. Fill in:
   - **Network Name:** Celo Sepolia
   - **RPC URL:** https://alfajores-forno.celo-testnet.org
   - **Chain ID:** 44787
   - **Currency Symbol:** CELO
   - **Explorer:** https://sepolia-blockscout.celo-testnet.org

**Or use:** https://chainlist.org (search "Celo Sepolia")

### Deploy Via Remix (Easiest)

**Step 1: Prepare Contract**
```bash
# Get the contract source
cat > SnakeGameRewards.sol << 'EOF'
// Copy entire contents of contracts/SnakeGameRewards.sol
EOF
```

**Step 2: Open Remix**
1. Go to https://remix.ethereum.org
2. Left sidebar → File Explorer
3. Create new file: `SnakeGameRewards.sol`
4. Paste contract code

**Step 3: Compile**
1. Left sidebar → Compiler icon
2. Select Solidity Compiler
3. Set version to 0.8.20
4. Ensure "Enable optimization" is OFF
5. Click "Compile SnakeGameRewards.sol"

**Step 4: Deploy**
1. Left sidebar → Deploy icon
2. Environment: "Injected Provider - MetaMask"
3. Connect MetaMask (switch to Sepolia if needed)
4. Contract: "SnakeGameRewards"
5. Click "Deploy"
6. Confirm transaction in MetaMask
7. Wait for confirmation...

**Step 5: Copy Address**
After deployment:
1. Expand "Deployed Contracts" section
2. Copy the contract address (0x...)

### Deploy Via Hardhat (Advanced)

**Installation:**
```bash
npm install --save-dev hardhat @nomiclabs/hardhat-ethers ethers

# Initialize Hardhat
npx hardhat
```

**Create hardhat.config.js:**
```javascript
require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.20",
  networks: {
    celoSepolia: {
      url: "https://alfajores-forno.celo-testnet.org",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 44787,
    },
  },
};
```

**Create scripts/deploy.js:**
```javascript
const hre = require("hardhat");

async function main() {
  console.log("Deploying SnakeGameRewards...");
  
  const SnakeGameRewards = await hre.ethers.getContractFactory("SnakeGameRewards");
  const contract = await SnakeGameRewards.deploy();
  await contract.deployed();
  
  console.log("✅ Contract deployed to:", contract.address);
  console.log("⚠️  Fund it with cUSD before using!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

**Deploy:**
```bash
# Set private key
export PRIVATE_KEY=0x...

# Deploy
npx hardhat run scripts/deploy.js --network celoSepolia

# Output: ✅ Contract deployed to: 0x...
```

---

## Funding Your Contract

Contract needs cUSD to pay rewards. Without funding, transactions will fail.

### Get Testnet cUSD

**From Faucet:**
1. Go to https://faucet.celo-testnet.org
2. Enter your wallet address
3. Request cUSD (usually 1-2 tokens)
4. Wait for confirmation

### Send cUSD to Contract

**Via MetaMask:**
1. Switch to Sepolia network
2. Get contract address from deployment
3. Open cUSD token: 0x86a37b6Ca4f0123b643f785385Eb0860D5EE810d
4. Click "Send"
5. Paste contract address
6. Send amount (e.g., 10 cUSD)
7. Confirm

**Via Ethers.js Script:**
```javascript
const { ethers } = require("ethers");

const RPC = "https://alfajores-forno.celo-testnet.org";
const CUSD = "0x86a37b6Ca4f0123b643f785385Eb0860D5EE810d";
const CONTRACT = "0x..."; // Your contract address
const AMOUNT = ethers.utils.parseUnits("10", 18); // 10 cUSD

const ABI = ["function transfer(address to, uint amount) returns (bool)"];

async function fund() {
  const provider = new ethers.providers.JsonRpcProvider(RPC);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const token = new ethers.Contract(CUSD, ABI, wallet);
  
  const tx = await token.transfer(CONTRACT, AMOUNT);
  await tx.wait();
  
  console.log("✅ Funded:", tx.hash);
}

fund().catch(console.error);
```

---

## Configuration After Deployment

### 1. Update .env.local

```env
NEXT_PUBLIC_REWARDS_CONTRACT=0xYourContractAddress
```

### 2. Restart Dev Server
```bash
npm run dev
```

### 3. Test in Browser

```bash
# Open http://localhost:3000
# 1. Connect wallet
# 2. Click "Lands"
# 3. Play game
# 4. On Game Over, click "CLAIM REWARD ON CELO"
# 5. Check wallet for cUSD!
```

---

## Verify Contract (Optional)

Verification makes your contract readable on Blockscout.

**Via Remix:**
1. After deploying, get contract address
2. Go to https://sepolia-blockscout.celo-testnet.org
3. Search your contract address
4. Click "Code" tab
5. Click "Is this a proxy contract?" → No
6. Paste contract code
7. Submit

**Via Hardhat:**
```bash
npx hardhat verify --network celoSepolia 0xYourAddress
```

---

## Troubleshooting

### "Network Error"
- Check MetaMask is on Celo Sepolia
- Try refreshing page
- Check RPC endpoint: https://alfajores-forno.celo-testnet.org

### "Insufficient Balance"
- Get gas: Need ~0.1 CELO for transaction
- Request from faucet if needed
- Or use Remix (sometimes doesn't need gas)

### "Contract Out of Funds"
- Contract needs cUSD to pay rewards
- Send cUSD to contract address
- Minimum: 1 cUSD to start testing

### "Wrong Network"
```
If game says "Wrong network":
1. Open MetaMask
2. Select "Celo Sepolia" from dropdown
3. Refresh browser
4. Reconnect wallet
```

### "Contract Not Found"
- Verify contract address in `.env.local`
- Check address is on Sepolia (use explorer)
- Redeploy if needed

---

## Security Reminders ⚠️

✅ **DO:**
- Keep private key secure (use .env file)
- Test on testnet first (ALWAYS)
- Verify contract source before deployment
- Use multi-sig for mainnet

❌ **DON'T:**
- Share private keys on Discord/Twitter
- Hardcode secrets in code
- Use personal funds for testing
- Deploy before testing thoroughly

---

## Mainnet Migration (When Ready)

**Not needed for testing, but for production:**

1. Deploy to mainnet
2. Update .env.local with mainnet RPC/contract
3. Fund with REAL cUSD
4. Test thoroughly
5. Launch!

See DEPLOYMENT.md for full instructions.

---

## Quick Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Get contract address after deploy
# Look for "Deployed Contracts" in Remix

# Fund contract with cUSD
# Use MetaMask or script above

# Check contract status on explorer
# https://sepolia-blockscout.celo-testnet.org/address/0xYourContract
```

---

## Support

**Issues?**
- Check IMPLEMENTATION_SUMMARY.md
- Check PLAY_TO_EARN.md
- See Celo Docs: https://docs.celo.org

**Faucets:**
- https://faucet.celo-testnet.org (cUSD)
- https://discord.gg/celo (Discord faucet)

**Explorer:**
- https://sepolia-blockscout.celo-testnet.org

---

## You're Ready! 🚀

```
1. ✅ Deploy contract
2. ✅ Fund with cUSD
3. ✅ Update .env.local
4. ✅ Test game
5. ✅ Ship to production!
```

**That's it! Your Play-to-Earn game is live.** 💚

---

**Questions?** See documentation files in the project root.
