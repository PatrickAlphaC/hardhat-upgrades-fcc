// We are going to skimp a bit on these tests...

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { assert, expect } from "chai"
import { BigNumber } from "ethers"
import { network, deployments, ethers }from "hardhat"
import { developmentChains, networkConfig} from "../../helper-hardhat-config"
import { TransparentUpgradeableProxy, Box, BoxV2, ProxyAdmin } from "../../typechain-types"

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Upgrading tests", function () {
          let box: Box, transparentProxy: TransparentUpgradeableProxy, proxyBox: Box, boxProxyAdmin: ProxyAdmin
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
