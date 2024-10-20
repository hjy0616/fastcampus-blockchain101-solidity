import { ethers } from "hardhat";

async function main() {
  console.log("자판기 계약 배포 중");
  const VendingMachine = await ethers.getContractFactory("VendingMachine");
  const vendingMachine = await VendingMachine.deploy();
  await vendingMachine.waitForDeployment();

  console.log(
    `자판기 계약이 다음 주소로 배포되었습니다: ${await vendingMachine.getAddress()}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
