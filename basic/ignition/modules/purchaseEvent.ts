import { ethers } from "hardhat";

const contractAddress = "0x50cf1849e32E6A17bBFF6B1Aa8b1F7B479Ad6C12";

async function purchaseEvent() {
  console.log("Purchase 이벤트 조회 중...");

  // 컨트랙트 인스턴스 가져오기
  const vendingMachine = await ethers.getContractAt(
    "VendingMachine",
    contractAddress
  );

  // 이벤트 필터 생성
  const filter = vendingMachine.filters.Purchase();

  // 이벤트 조회
  const events = await vendingMachine.queryFilter(filter);

  if (events.length === 0) {
    console.log("조회된 Purchase 이벤트가 없습니다.");
    return;
  }

  events.forEach((event, index) => {
    console.log(`이벤트 #${index + 1}`);
    console.log("구매자:", event.args[0]); // 'purchaser' 인덱스로 접근
    console.log("구매 수량:", event.args[1].toString()); // 'amount' 인덱스로 접근
    console.log("------------------------");
  });
}

async function main() {
  try {
    await purchaseEvent();
  } catch (error) {
    console.error("이벤트 조회 중 오류 발생:", error);
    process.exitCode = 1;
  }
}

main();
