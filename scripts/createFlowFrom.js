const hre = require("hardhat");
const { Framework } = require("@superfluid-finance/sdk-core");
const { ethers } = require("hardhat");
require("dotenv").config();
const sfRouterABI = require("../artifacts/contracts/MoneyRouter.sol/MoneyRouter.json").abi;

// run: npx hardhat run scripts/createFlowFromContract.js --network goerli
async function main() {
  const sfRouterAddress = "";
  const receiver = "";
  const provider = new hre.ethers.providers.JsonRpcProvider(process.env.GOERLI_URL);

  const sf = await Framework.create({
    chainId: (await provider.getNetwork()).chainId,
    provider,
    customSubgraphQueriesEndpoint: "",
    dataMode: "WEB3_ONLY"
  });

  const signers = await hre.ethers.getSigners();
  const moneyRouter = new ethers.Contract(sfRouterAddress, sfRouterABI, provider);
  const daix = await sf.loadSuperToken("fDAIx");
  
  await moneyRouter.connect(signers[0]).createFlowFromContract(daix.address, receiver, "385802469135802").then(function (tx) {
    console.log(`
        Flow successfully created. 
        Tx Hash: ${tx.hash}
    `)
  })
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});