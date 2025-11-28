# Launch Checklist ✅

## Before You Launch

- [ ] Read SETUP.md
- [ ] Run `npm run dev` successfully
- [ ] Wallet connects in browser
- [ ] Lands menu displays correctly
- [ ] Game plays normally
- [ ] Build passes: `npm run build`

## Smart Contract Setup (Required)

- [ ] Deploy SnakeGameRewards.sol to Celo Sepolia
  - Via Remix: https://remix.ethereum.org
  - Via Hardhat: See CONTRACT_DEPLOY.md
- [ ] Copy contract address
- [ ] Add to .env.local: `NEXT_PUBLIC_REWARDS_CONTRACT=0x...`
- [ ] Restart dev server: `npm run dev`

## Funding (Required to Claim Rewards)

- [ ] Get testnet cUSD: https://faucet.celo-testnet.org
- [ ] Send to contract address: Send 1-100 cUSD
- [ ] Verify in block explorer: https://sepolia-blockscout.celo-testnet.org

## Testing (Required Before Production)

- [ ] Connect wallet ✅
- [ ] Switch to Celo Sepolia ✅
- [ ] View cUSD balance ✅
- [ ] See "Lands" menu ✅
- [ ] Activate "Sunny Park" ✅
- [ ] Play game ✅
- [ ] See rewards on Game Over ✅
- [ ] Click "CLAIM REWARD ON CELO" ✅
- [ ] Wait for transaction ✅
- [ ] Check wallet for cUSD ✅

## Production Deployment

- [ ] Build optimized: `npm run build`
- [ ] Test build locally: `npm start`
- [ ] Choose hosting (Vercel/Netlify/Self-hosted)
- [ ] Deploy frontend
- [ ] Verify game runs on production URL
- [ ] Share with community! ��

## Optional: Mainnet Migration

- [ ] Deploy new contract to Celo Mainnet
- [ ] Fund contract with real cUSD
- [ ] Update .env.local with mainnet contract
- [ ] Re-deploy frontend
- [ ] Announce mainnet launch!

## Maintenance

- [ ] Monitor contract on explorer
- [ ] Track player statistics
- [ ] Update rewards as needed
- [ ] Keep documentation current
- [ ] Gather community feedback

---

## Quick Links

**Setup:**
- SETUP.md - Start here
- CONTRACT_DEPLOY.md - Deploy contract
- PLAY_TO_EARN.md - Rewards guide

**Tools:**
- Remix: https://remix.ethereum.org
- Celo Faucet: https://faucet.celo-testnet.org
- Explorer: https://sepolia-blockscout.celo-testnet.org

**Deployment:**
- Vercel: https://vercel.com
- Netlify: https://netlify.com

---

**Status: READY TO LAUNCH! 🚀**
