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
      const purchaseAmount = 10;
      const purchaseValue = ethers.parseEther(purchaseAmount.toString());

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
      expect(finalBalance).to.equal(initialBalance + BigInt(purchaseAmount));

      const machineBalance = await vendingMachine.cupcakeBalances(
        await vendingMachine.getAddress()
      );
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
      const refillAmount = 10;

      await vendingMachine.connect(owner).refill(refillAmount);

      const finalBalance = await vendingMachine.cupcakeBalances(
        await vendingMachine.getAddress()
      );
      expect(finalBalance).to.equal(initialBalance + BigInt(refillAmount));
    });

    it("should only allow owner to refill", async function () {
      const { vendingMachine, otherAccount } = await loadFixture(
        deployVendingMachineFixture
      );

      await expect(
        vendingMachine.connect(otherAccount).refill(10)
      ).to.be.revertedWith("Only the owner can refill.");
    });
  });
});
