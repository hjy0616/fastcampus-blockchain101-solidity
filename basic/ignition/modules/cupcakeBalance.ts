import { ethers } from "hardhat";

const contractAddress = "0x50cf1849e32E6A17bBFF6B1Aa8b1F7B479Ad6C12";
const account = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

async function getBalance(contractAddress: string, account: string) {
  console.log("자판기 계약에서 잔액 조회 중");

  // 컨트랙트 인스턴스 가져오기
  const vendingMachine = await ethers.getContractAt(
    "VendingMachine",
    contractAddress
  );

  // 잔액 조회
  const balance = await vendingMachine.cupcakeBalances(account);
  console.log("컵케이크 잔액:", balance.toString());
}

async function main() {
  await getBalance(contractAddress, account);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
