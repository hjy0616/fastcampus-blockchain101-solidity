import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("VendingMachine", function () {
  async function deployVendingMachineFixture() {
    const [owner, otherAccount] = await ethers.getSigners();
    const VendingMachine = await ethers.getContractFactory("VendingMachine");
    const vendingMachine = await VendingMachine.deploy();
    await vendingMachine.waitForDeployment();

    return { vendingMachine, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("should initialize with 100 cupcakes", async function () {
      const { vendingMachine } = await loadFixture(deployVendingMachineFixture);
      const balance = await vendingMachine.cupcakeBalances(
        vendingMachine.getAddress()
      );
      console.log("Initial cupcake balance:", balance.toString());
      expect(balance).to.equal(100);
    });
  });

  describe("Purchases", function () {
    it("should transfer cupcakes correctly after purchase", async function () {
      const { vendingMachine, otherAccount } = await loadFixture(
        deployVendingMachineFixture
      );

      const initialBalance = await vendingMachine.cupcakeBalances(
        otherAccount.address
      );
      console.log("Initial balance of buyer:", initialBalance.toString());

      const purchaseAmount = 10;
      const purchaseValue = ethers.parseEther(purchaseAmount.toString());

      console.log("Attempting to purchase", purchaseAmount, "cupcakes");

      await expect(
        vendingMachine
          .connect(otherAccount)
          .purchase(purchaseAmount, { value: purchaseValue })
      )
        .to.emit(vendingMachine, "Purchase")
        .withArgs(otherAccount.address, purchaseAmount);

      const finalBalance = await vendingMachine.cupcakeBalances(
        otherAccount.address
      );
      console.log("Final balance of buyer:", finalBalance.toString());

      const machineBalance = await vendingMachine.cupcakeBalances(
        await vendingMachine.getAddress()
      );
      console.log("Remaining balance in vending machine:", machineBalance.toString());

      expect(finalBalance).to.equal(initialBalance + BigInt(purchaseAmount));
      expect(machineBalance).to.equal(100 - purchaseAmount);
    });
  });

  describe("Refills", function () {
    it("should refill cupcakes correctly", async function () {
      const { vendingMachine, owner } = await loadFixture(
        deployVendingMachineFixture
      );

      const initialBalance = await vendingMachine.cupcakeBalances(
        await vendingMachine.getAddress()
      );
      console.log("Initial vending machine balance:", initialBalance.toString());

      const refillAmount = 10;
      console.log("Attempting to refill", refillAmount, "cupcakes");

      await vendingMachine.connect(owner).refill(refillAmount);

      const finalBalance = await vendingMachine.cupcakeBalances(
        await vendingMachine.getAddress()
      );
      console.log("Final vending machine balance:", finalBalance.toString());

      expect(finalBalance).to.equal(initialBalance + BigInt(refillAmount));
    });

    it("should only allow owner to refill", async function () {
      const { vendingMachine, otherAccount } = await loadFixture(
        deployVendingMachineFixture
      );

      console.log("Attempting to refill by non-owner account");

      await expect(
        vendingMachine.connect(otherAccount).refill(10)
      ).to.be.revertedWith("Only the owner can refill.");

      console.log("Refill attempt by non-owner was correctly rejected");
    });
  });
});
