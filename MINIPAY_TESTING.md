# Testing Your Park Snake Game in MiniPay

This guide helps you test your game inside the MiniPay app on Android or iOS.

## Prerequisites

1. **MiniPay App Installed**
   - Android: [MiniPay Standalone App](https://play.google.com/store)
   - iOS: [MiniPay iOS App](https://apps.apple.com/app/id)

2. **Testnet Setup**
   - MiniPay switched to Celo Sepolia testnet
   - Development mode enabled

3. **Local Dev Server Running**
   ```bash
   cd /home/daniel/work/celo/minipay-snake
   npm run dev
   # Runs on http://localhost:3000
   ```

## Step 1: Enable MiniPay Developer Mode

**On Your Phone:**

1. Open the MiniPay app
2. Go to **Settings** (⚙️)
3. Find **About** section
4. Tap the **Version number** repeatedly (5-10 times)
5. You'll see: ✅ "Developer Mode Enabled"
6. Return to Settings
7. New option appears: **Developer Settings**

## Step 2: Enable Testnet Mode

1. Go to **Settings** → **Developer Settings**
2. Toggle **Use Testnet** ON
   - This switches MiniPay to Celo Sepolia
3. Enable **Developer Mode**

## Step 3: Set Up ngrok (for local testing)

ngrok creates a public URL that tunnels to your localhost. MiniPay can't access `localhost:3000`, so we need ngrok.

### Install ngrok

```bash
# macOS
brew install ngrok

# Linux
wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.zip
unzip ngrok-v3-stable-linux-amd64.zip
sudo mv ngrok /usr/local/bin

# Windows
# Download from: https://ngrok.com/download
```

### Start ngrok Tunnel

**In a new terminal:**

```bash
ngrok http 3000
```

You'll see output like:

```
ngrok                                                     (Ctrl+C to quit)

Session Status                online
Account                       your-email@gmail.com
Version                        3.X.X
Region                         us-west
Web Interface                  http://127.0.0.1:4040
Forwarding                     https://random-code-123.ngrok.io -> http://localhost:3000
```

**Copy the forwarding URL** (e.g., `https://random-code-123.ngrok.io`)

## Step 4: Load Your Game in MiniPay

1. Open MiniPay app
2. Go to **Settings** → **Developer Settings**
3. Tap **Load Test Page**
4. Enter your ngrok URL:
   ```
   https://random-code-123.ngrok.io
   ```
5. Tap **Go**

**Your game loads in MiniPay!** 🎉

## Step 5: Test MiniPay Features

### Auto-Connect Wallet
- ✅ Wallet connects automatically (no button visible)
- ✅ No "Connect Wallet" button shown
- ✅ Your address displays
- ✅ cUSD balance shows

### Test Gameplay
- ✅ Game runs smoothly
- ✅ Controls work (arrows, swipe, D-pad)
- ✅ Score increases
- ✅ Rewards calculate correctly

### Test Play-to-Earn
1. Play and get a score
2. On Game Over, see rewards
3. Click "CLAIM (MiniPay)"
4. Transaction submits (simulated for now)

## Troubleshooting

### "Cannot reach localhost"
- Make sure ngrok is running in another terminal
- Copy the ngrok URL correctly
- Make sure dev server is running: `npm run dev`

### "No wallet detected"
- Make sure you're in MiniPay's Developer Mode
- Toggle testnet mode off/on
- Restart MiniPay app

### "Wrong network"
- MiniPay must be set to Celo Sepolia
- Check Developer Settings → Use Testnet is ON
- Your .env.local should have: `NEXT_PUBLIC_NETWORK=testnet`

### ngrok URL expired
- ngrok generates a new URL each restart
- Update the URL in MiniPay Developer Settings
- Restart ngrok: `ngrok http 3000`

## Testing Checklist

- [ ] MiniPay Developer Mode enabled
- [ ] Testnet mode enabled
- [ ] ngrok tunnel running
- [ ] Game loads at ngrok URL in MiniPay
- [ ] Wallet auto-connects (no visible button)
- [ ] Address displayed correctly
- [ ] cUSD balance showing
- [ ] Game plays normally
- [ ] Touch controls work
- [ ] Rewards calculate
- [ ] "CLAIM (MiniPay)" button visible

## Important Notes

⚠️ **MiniPay Specifics:**

1. **No EIP-1559 Support**
   - MiniPay only uses legacy transactions
   - maxFeePerGas and maxPriorityFeePerGas are ignored

2. **Custom Fee Currency**
   - Must specify `feeCurrency: cUSD` for all transactions
   - MiniPay only supports cUSD (not USDC or USDT for fees)

3. **Auto-Connection**
   - When inside MiniPay, wallet connects automatically
   - Hide the "Connect Wallet" button (already done)

4. **Testnet Only**
   - Developer testing uses Celo Sepolia testnet
   - Get free cUSD from faucet: https://faucet.celo-testnet.org

## Next Steps After Testing

1. **Deploy to Production**
   - Deploy frontend to Vercel/Netlify
   - Share public URL
   - Users can load your game in MiniPay

2. **Deploy Smart Contract**
   - Deploy to Celo Sepolia or mainnet
   - Update contract address in .env

3. **Submit to MiniPay Store**
   - When ready for public release
   - Follow MiniPay dApp submission guidelines

## Resources

- **MiniPay Docs:** https://docs.celo.org/build/release-cycle/mainnet/minipay
- **ngrok Docs:** https://ngrok.com/docs
- **Celo Faucet:** https://faucet.celo-testnet.org
- **Explorer:** https://sepolia-blockscout.celo-testnet.org

## Quick Command Reference

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Start ngrok tunnel
ngrok http 3000

# Copy ngrok URL → Enter in MiniPay Developer Settings
# Load Test Page in MiniPay
# Game should load!
```

---

**Your MiniPay game is ready to test!** 🎮💚
