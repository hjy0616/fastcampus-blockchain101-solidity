import { ethers } from "hardhat";
import { Contract, Interface, Log } from "ethers";
import dotenv from "dotenv";

// .env 파일 로드
dotenv.config();

// 환경 변수에서 컨트랙트 주소를 가져오거나 하드코딩된 주소 사용
const contractAddress =
  process.env.ERC20 || "0xf31bF6E9a80DfdD31318100F1C36154b105D0Ae2"; // 여기에 실제 컨트랙트 주소를 넣으세요

// 컨트랙트 주소의 유효성을 검사하는 함수
function isValidAddress(address: string): boolean {
  return ethers.isAddress(address);
}

async function transferEvent() {
  console.log("Contract address from env:", process.env.ERC20);
  console.log("Using contract address:", contractAddress);

  // 컨트랙트 주소 유효성 검사
  if (!isValidAddress(contractAddress)) {
    throw new Error(`Invalid contract address: ${contractAddress}`);
  }

  const MyERC20 = await ethers.getContractFactory("MyERC20");
  const erc20 = (await MyERC20.attach(contractAddress)) as Contract;

  const transferEvent = erc20.getEvent("Transfer");
  const topic = transferEvent.fragment.topicHash;

  const filter = {
    address: contractAddress,
    fromBlock: 9066823,
    topics: [topic],
  };

  const logs = await ethers.provider.getLogs(filter);
  console.log("logs >>>", logs);

  const abi = require("../artifacts/contracts/MyERC20.sol/MyERC20.json").abi;
  const iface = new Interface(abi);

  for (const log of logs) {
    const receipt = await ethers.provider.getTransactionReceipt(
      log.transactionHash
    );
    if (!receipt) continue;

    for (const receiptLog of receipt.logs) {
      try {
        const parsedLog = iface.parseLog(receiptLog as Log);
        if (parsedLog && parsedLog.topic === topic) {
          console.log("from >>", parsedLog.args[0]);
          console.log("to >>", parsedLog.args[1]);
          console.log("value >>", parsedLog.args[2]);
        } else {
          console.log(`This topic is not Transfer`);
        }
      } catch (error) {
        console.log("Error parsing log:", error);
      }
    }
  }
}

transferEvent().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
