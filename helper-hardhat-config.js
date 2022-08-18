const networkConfig = {
    default: {
        name: "hardhat",
    },
    31337: {
        name: "localhost",
    },
    4: {
        name: "rinkeby",
    },
    42: {
        name: "kovan",
    },
    80001: {
        name: "polygonMumbai",
    },
    137: {
        name: "polygon",
    },
    1: {
        name: "mainnet",
    },
}

const developmentChains = ["hardhat", "localhost"]
const VERIFICATION_BLOCK_CONFIRMATIONS = 6

module.exports = {
    networkConfig,
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
}
