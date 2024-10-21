import { ethers } from "hardhat";
import dotenv from "dotenv";
import { Contract } from "ethers";

dotenv.config();

const contractAddress = process.env.ERC20!;
const account = process.env.PUBLIC_KEY!;

// MyERC20 인터페이스 정의
interface MyERC20Interface extends Contract {
  balanceOf: any;
}

async function getBalance(contractAddress: string, account: string) {
  console.log("Contract Address:", contractAddress);
  console.log("Account:", account);
  console.log("Getting balance from ERC20 contract...");

  const Erc20Factory = await ethers.getContractFactory("MyERC20");
  const erc20 = (await Erc20Factory.attach(
    contractAddress
  )) as MyERC20Interface;

  try {
    const balance = await erc20.balanceOf(account);

    console.log(`Raw balance of ${account}: ${balance}`);
    console.log(`Balance in Ether: ${ethers.formatEther(balance)} ETH`);
    console.log(`Balance with 18 decimals: ${ethers.formatUnits(balance, 18)}`);
  } catch (error) {
    console.error("Error fetching balance:", error);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
getBalance(contractAddress, account).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
