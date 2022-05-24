import {DeployFunction} from "hardhat-deploy/types"
import {HardhatRuntimeEnvironment} from "hardhat/types"
import {
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
}  from "../helper-hardhat-config"
import verify from "../utils/verify"

const deployBox: DeployFunction = async function (
    hre: HardhatRuntimeEnvironment
  ) {
    const { deployments, getNamedAccounts, network, ethers } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS

    log("----------------------------------------------------")

    const box = await deploy("Box", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: waitBlockConfirmations,
        proxy: {
            proxyContract: "OpenZeppelinTransparentProxy",
            viaAdminContract: {
                name: "BoxProxyAdmin",
                artifact: "BoxProxyAdmin",
            },
        },
    })

    // Be sure to check out the hardhat-deploy examples to use UUPS proxies!
    // https://github.com/wighawag/template-ethereum-contracts

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(box.address, [])
    }
    log("----------------------------------------------------")
}

export default deployBox
deployBox.tags = ["all", "box"]
