import { ethers } from "hardhat";
import { MyERC20 } from "../../typechain-types/contracts/MyERC20";

async function main() {
  console.log("Deploying MyERC20 token...");

  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const MyERC20 = await ethers.getContractFactory("MyERC20");
  const myERC20: MyERC20 = await MyERC20.deploy();

  await myERC20.waitForDeployment();

  console.log("MyERC20 token deployed to:", await myERC20.getAddress());

  // 추가적인 설정이 필요한 경우 여기에 작성할 수 있습니다.
  // 예: 다른 계정에 MINTER_ROLE 부여
  // const MINTER_ROLE = await myERC20.MINTER_ROLE();
  // await myERC20.grantRole(MINTER_ROLE, "0x...");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
