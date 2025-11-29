require("dotenv").config();

async function main() {
  const contractAddress = process.env.NEXT_PUBLIC_REWARDS_CONTRACT;
  if (!contractAddress) {
    throw new Error("NEXT_PUBLIC_REWARDS_CONTRACT not set in .env.local");
  }

  const [signer] = await ethers.getSigners();
  console.log("Funding contract from:", signer.address);

  // cUSD contract address
  const cUSD = "0x86A37B6CA4F0123b643F785385eb0860D5ee810d";
  
  // Amount to fund (100 cUSD)
  const fundAmount = ethers.parseEther("100");

  // Get cUSD contract
  const IERC20_ABI = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function transferFrom(address from, address to, uint256 amount) external returns (bool)",
    "function balanceOf(address account) external view returns (uint256)",
  ];

  const cUSDContract = new ethers.Contract(cUSD, IERC20_ABI, signer);

  // Check balance
  const balance = await cUSDContract.balanceOf(signer.address);
  console.log("Your cUSD balance:", ethers.formatEther(balance));

  if (balance < fundAmount) {
    console.error("❌ Insufficient cUSD balance. Need at least 100 cUSD.");
    console.error("Get testnet cUSD from: https://faucet.celo.org");
    return;
  }

  // Approve contract to spend cUSD
  console.log("Approving contract to spend cUSD...");
  const approveTx = await cUSDContract.approve(contractAddress, fundAmount);
  await approveTx.wait();
  console.log("✅ Approved");

  // Fund contract
  console.log("Funding contract with 100 cUSD...");
  const snakeContract = new ethers.Contract(
    contractAddress,
    ["function fundContract(uint256 amount) external"],
    signer
  );

  const fundTx = await snakeContract.fundContract(fundAmount);
  await fundTx.wait();
  
  console.log("✅ Contract funded with 100 cUSD!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
