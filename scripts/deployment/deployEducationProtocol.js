const { HardhatEthersSigner } = require("@nomicfoundation/hardhat-ethers/signers")
const { ethers } = require("hardhat")

/**
 * Deploys the EducationProtocol contract
 * @param {HardhatEthersSigner} deployer
 */
async function deployEducationProtocol(deployer) {
    // Deployment of the EducationOrganization NFt contract
    const EducationProtocol = await ethers.getContractFactory("EducationProtocol")
    const educationProtocol = await upgrades.deployProxy(EducationProtocol, [deployer.address])
    await educationProtocol.waitForDeployment()

    console.log("EducationProtocol deployed to:", educationProtocol.target)

    return educationProtocol.target
}

module.exports = { deployEducationProtocol }
