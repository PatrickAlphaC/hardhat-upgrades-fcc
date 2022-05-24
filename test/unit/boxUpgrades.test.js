// We are going to skimp a bit on these tests...

const { assert } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Upgrading tests", function () {
          let box, transparentProxy, proxyBox, boxProxyAdmin
          beforeEach(async () => {
              await deployments.fixture(["box"])
              box = await ethers.getContract("Box")
              transparentProxy = await ethers.getContract("Box_Proxy")
              proxyBox = await ethers.getContractAt("Box", transparentProxy.address)
              boxProxyAdmin = await ethers.getContract("BoxProxyAdmin")
          })
          it("can deploy and upgrade a contract", async function () {
              const startingVersion = await proxyBox.version()
              assert.equal(startingVersion.toString(), "1")
              await deployments.fixture(["boxv2"])
              const boxV2 = await ethers.getContract("BoxV2")
              const upgradeTx = await boxProxyAdmin.upgrade(transparentProxy.address, boxV2.address)
              await upgradeTx.wait(1)
              const endingVersion = await proxyBox.version()
              assert.equal(endingVersion.toString(), "2")
          })
      })
