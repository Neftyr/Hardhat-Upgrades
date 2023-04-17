const networkConfig = {
    31337: {
        name: "localhost",
    },
    5: {
        name: "goerli",
    },
    11155111: {
        name: "sepolia",
    },
    1: {
        name: "mainnet",
    },
}

const developmentChains = ["hardhat", "localhost"]
const nftMarketplaceMother = "0xC15527907cdA4B866D501a200D80DbbA28880266"

module.exports = {
    networkConfig,
    developmentChains,
    nftMarketplaceMother,
}
