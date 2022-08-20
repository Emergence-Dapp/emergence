const hre = require("hardhat");

const owner = ""
const dao = ""

async function main() {
  const sf = await Framework.create({
    chainId: (await provider.getNetwork()).chainId,
    provider,
    customSubgraphQueriesEndpoint: "",
    dataMode: "WEB3_ONLY"
  });

  const Router = await hre.ethers.getContractFactory("SFRouter");
  const sfRouter = await Router.deploy(sf.settings.config.hostAddress, owner, dao);

  await sfRouter.deployed();

  console.log(`contract deployed at: ${sfRouter.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
