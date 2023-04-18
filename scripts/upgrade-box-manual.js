const { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } = require("../helper-hardhat-config")
const { network, deployments, ethers } = require("hardhat")
const { verify } = require("../helper-functions")

// To run below:
// * First run -> `yarn hardhat node`
// * Then -> `yarn hardhat run scripts/upgrade-box-manual.js --network localhost`

async function main() {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    const waitBlockConfirmations = developmentChains.includes(network.name) ? 1 : VERIFICATION_BLOCK_CONFIRMATIONS

    log("----------------------------------------------------")

    const boxV2 = await deploy("BoxV2", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: waitBlockConfirmations,
    })

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(boxV2.address, [])
    }

    // Not "the hardhat-deploy way"
    const boxProxyAdmin = await ethers.getContract("BoxProxyAdmin")
    const transparentProxy = await ethers.getContract("Box_Proxy")

    const proxyBoxV1 = await ethers.getContractAt("Box", transparentProxy.address)
    let version = await proxyBoxV1.version()
    console.log(`First Box Version: ${version.toString()}`)

    // Performing Upgrade...
    const upgradeTx = await boxProxyAdmin.upgrade(transparentProxy.address, boxV2.address)
    await upgradeTx.wait(1)

    // It is taking ABI from BoxV2 contract and address from transparentProxy contract
    const proxyBoxV2 = await ethers.getContractAt("BoxV2", transparentProxy.address)
    version = await proxyBoxV2.version()
    console.log(`Upgraded Box Version: ${version.toString()}`)
    log("----------------------------------------------------")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
