import { ethers } from "hardhat";

const contractAddress = "0x50cf1849e32E6A17bBFF6B1Aa8b1F7B479Ad6C12";

async function purchase(amount: number) {
  console.log("자판기 계약에서 구매 중");

  // 컨트랙트 인스턴스 가져오기
  const vendingMachine = await ethers.getContractAt(
    "VendingMachine",
    contractAddress
  );

  // 구매 가격 계산 (1 ETH per cupcake)
  const purchaseValue = ethers.parseEther(amount.toString());

  // 트랜잭션 발생
  const tx = await vendingMachine.purchase(amount, { value: purchaseValue });

  // 트랜잭션 완료 대기
  const receipt = await tx.wait();

  console.log("구매 완료:", receipt?.hash);
}

async function main() {
  try {
    await purchase(10);
  } catch (error) {
    console.error("구매 중 오류 발생:", error);
    process.exitCode = 1;
  }
}

main();
