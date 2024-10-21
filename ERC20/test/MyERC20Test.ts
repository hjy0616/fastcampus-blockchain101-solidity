import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer } from "ethers";
import { MyERC20 } from "../typechain-types/contracts/MyERC20";

describe("MyERC20", function () {
  let myERC20: MyERC20;
  let owner: Signer;
  let addr1: Signer;
  let addr2: Signer;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const MyERC20Factory = await ethers.getContractFactory("MyERC20");
    myERC20 = (await MyERC20Factory.deploy()) as MyERC20;
    await myERC20.waitForDeployment();
  });

  it("Should set the right owner", async function () {
    const defaultAdminRole = await myERC20.DEFAULT_ADMIN_ROLE();
    expect(await myERC20.hasRole(defaultAdminRole, await owner.getAddress())).to
      .be.true;
  });

  it("Should assign the minter role to the owner", async function () {
    const minterRole = await myERC20.MINTER_ROLE();
    expect(await myERC20.hasRole(minterRole, await owner.getAddress())).to.be
      .true;
  });

  it("Should assign the pauser role to the owner", async function () {
    const pauserRole = await myERC20.PAUSER_ROLE();
    expect(await myERC20.hasRole(pauserRole, await owner.getAddress())).to.be
      .true;
  });

  it("Should mint tokens", async function () {
    await myERC20.mint(await addr1.getAddress(), ethers.parseEther("100"));
    expect(await myERC20.balanceOf(await addr1.getAddress())).to.equal(
      ethers.parseEther("100")
    );
  });

  it("Should fail if non-minter tries to mint", async function () {
    await expect(
      myERC20.connect(addr1).mint(await addr2.getAddress(), 100)
    ).to.be.revertedWithCustomError(
      myERC20,
      "AccessControlUnauthorizedAccount"
    );
  });

  it("Should pause and unpause", async function () {
    await myERC20.pause();
    expect(await myERC20.paused()).to.be.true;
    await myERC20.unpause();
    expect(await myERC20.paused()).to.be.false;
  });

  it("Should fail if non-pauser tries to pause", async function () {
    await expect(myERC20.connect(addr1).pause()).to.be.revertedWithCustomError(
      myERC20,
      "AccessControlUnauthorizedAccount"
    );
  });

  it("Should not allow transfers when paused", async function () {
    await myERC20.mint(await addr1.getAddress(), 100);
    await myERC20.pause();
    await expect(
      myERC20.connect(addr1).transfer(await addr2.getAddress(), 50)
    ).to.be.revertedWithCustomError(myERC20, "EnforcedPause");
  });

  it("Should allow transfers when unpaused", async function () {
    await myERC20.mint(await addr1.getAddress(), 100);
    await myERC20.pause();
    await myERC20.unpause();
    await expect(myERC20.connect(addr1).transfer(await addr2.getAddress(), 50))
      .to.not.be.reverted;
    expect(await myERC20.balanceOf(await addr2.getAddress())).to.equal(50);
  });
});
