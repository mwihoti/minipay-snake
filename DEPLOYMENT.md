# MiniPay Snake Game - Deployment Guide

## Overview

This guide covers deploying the Park Snake game to production on MiniPay.

## Prerequisites

- Domain name (recommended)
- Hosting provider (Vercel, Netlify, AWS, etc.)
- Celo mainnet tokens for gas fees
- Updated MiniPay app

## Step 1: Prepare for Production

### Update Environment

```bash
# Create .env.local
cp .env.example .env.local

# Edit with production values
NEXT_PUBLIC_NETWORK=mainnet
NEXT_PUBLIC_RPC_URL=https://forno.celo.org
```

### Build Verification

```bash
npm run build
npm start

# Test locally at http://localhost:3000
```

## Step 2: Deploy to Vercel (Recommended)

### Quick Setup

```bash
npm install -g vercel
vercel login
vercel
```

### Configure Project

```
? Set up and deploy "~/minipay-snake"? yes
? Which scope do you want to deploy to? [your-username]
? Link to existing project? no
? What's your project's name? minipay-snake-game
? In which directory is your code? ./
? Want to override the settings? no
```

### Set Environment Variables

```bash
vercel env add NEXT_PUBLIC_NETWORK
> mainnet

vercel env add NEXT_PUBLIC_RPC_URL
> https://forno.celo.org
```

### Deploy

```bash
vercel --prod
```

Your app will be available at: `https://minipay-snake-game.vercel.app`

## Step 3: Deploy to Netlify

```bash
# Connect GitHub repo or deploy directly
netlify deploy

# For production
netlify deploy --prod
```

Configure environment variables in Netlify dashboard.

## Step 4: Deploy to AWS Amplify

```bash
npm install -g @aws-amplify/cli
amplify configure
amplify init

# Select Next.js, production build
# Deploy
amplify publish
```

## Step 5: Custom Domain Setup

### For Vercel

1. Go to Vercel project settings
2. Domains → Add → Enter your domain
3. Configure DNS records (A, CNAME as shown)
4. SSL automatically configured

### For Netlify

1. Domain Settings → Add Domain
2. Follow DNS instructions
3. SSL auto-provisioned via Let's Encrypt

## Step 6: Register with MiniPay

1. **Submit Your App**
   - Go to [MiniPay App Store](https://minipay.opera.com/)
   - Create developer account
   - Submit app listing with:
     - App name: "Park Snake"
     - Description: "Earn cUSD by playing park-themed snake"
     - Icon: 512x512 PNG
     - URL: `https://your-domain.com`
     - Category: Games

2. **Add to MiniPay Discovery Page**
   - Wait for approval (~2-7 days)
   - App appears in MiniPay "Mini Apps" section

## Step 7: Testing on Mainnet

### Get Funds

1. Testnet testing:
   ```bash
   # Get testnet CELO from faucet
   # https://faucet.celo.org/celo-sepolia
   
   # Swap for cUSD
   # https://app.mento.org/
   ```

2. Mainnet testing:
   ```bash
   # Use real cUSD (small amount)
   # Test with friends
   ```

### Monitor Performance

- **Vercel Analytics**: Dashboard → Analytics
- **Error Tracking**: Set up Sentry
  ```bash
  npm install @sentry/nextjs
  ```

## Step 8: Monitoring & Maintenance

### Set Up Alerts

```bash
# Vercel automatic alerts for failed deployments
# Netlify automatic alerts for build failures
```

### Monitor Blockchain Transactions

- Check transaction history via [explorer.celo.org](https://explorer.celo.org)
- Monitor gas prices
- Track player rewards

### Update Game

```bash
# Make changes locally
git commit -am "Update game mechanics"

# Deploy
vercel --prod
# OR
netlify deploy --prod
```

## Security Considerations

1. **Never expose private keys**
   - Use public endpoints only
   - All keys should be in environment variables
   - Never commit `.env.local`

2. **Validate user input**
   - Scores should be validated on backend
   - Prevent score manipulation

3. **Rate limiting**
   - Implement rate limits for score submissions
   - Prevent spam/abuse

4. **SSL/HTTPS**
   - All hosting providers offer free SSL
   - Required for wallet integration

## Performance Optimization

### Lighthouse Scores

Current performance targets:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

### Optimize

```bash
# Check lighthouse
npm run build
npm start

# Use Lighthouse extension in Chrome DevTools
```

### CDN Configuration

- Images: Vercel/Netlify CDN (automatic)
- Static files: Enable aggressive caching
- API: Cache game state locally

## Troubleshooting

### MiniPay Not Detecting App

```
Error: window.ethereum is undefined
```

- Ensure running in MiniPay browser
- Check app URL is HTTPS
- Verify app is whitelisted

### Transaction Failures

```
Error: Insufficient balance
```

- Check cUSD balance in MiniPay
- Ensure gas allowance
- Retry with smaller reward

### Slow Performance

- Check network tab for slow requests
- Optimize canvas rendering
- Enable Web Workers for game loop

## Contact & Support

- **Celo Docs**: https://docs.celo.org
- **MiniPay Support**: support@opera.com
- **Community**: https://discord.gg/celo

---

**Deployment successful! 🎉**

Your Park Snake game is now live on Celo + MiniPay.
