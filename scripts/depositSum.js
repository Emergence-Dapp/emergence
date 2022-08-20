const hre = require("hardhat");
const { Framework } = require("@superfluid-finance/sdk-core");
const { ethers } = require("hardhat");
require("dotenv").config();
const SFRouterABI = require("../artifacts/contracts/SFRouter.sol/SFRouter.json").abi;

// fake coin = fDAIx
// run: npx hardhat run scripts/sendLumpSumToContract.js --network goerli
async function main() {
  const SFRouterAddress = "";
  const provider = new hre.ethers.providers.JsonRpcProvider(process.env.GOERLI_URL);

  const sf = await Framework.create({
    chainId: (await provider.getNetwork()).chainId,
    provider,
    customSubgraphQueriesEndpoint: "",
    dataMode: "WEB3_ONLY"
  });

  const signers = await hre.ethers.getSigners();
  const sfRouter = new ethers.Contract(SFRouterAddress, SFRouterABI, provider);
  const daix = await sf.loadSuperToken("fDAIx");
  
  await sfRouter.connect(signers[0]).sendLumpSumToContract(daix.address, ethers.utils.parseEther("500")).then(function (tx) {
    console.log(`
        Funds successfully sent to SF router. 
        Tx Hash: ${tx.hash}
    `)
  })
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});