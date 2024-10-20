import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.27",
  networks: {
    hardhat: {
      forking: {
        url: "https://eth.rpc.blxrbdn.com",
      },
      accounts: {
        mnemonic: "test test test test test test test test test test test junk",
        initialIndex: 0,
        accountsBalance: "10000000000000000000000000000000",
      },
      blockGasLimit: 30000000,
    },
  },
};

export default config;
