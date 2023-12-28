const { HardhatEthersSigner } = require("@nomicfoundation/hardhat-ethers/signers")
const { ethers } = require("hardhat")

/**
 * Deploys the EducationOrganization contract
 * @param {HardhatEthersSigner} deployer
 */
async function deployEducationOrganization(deployer) {
    // Deployment of the EducationOrganization NFt contract
    const EducationOrganization = await ethers.getContractFactory("EducationOrganization")
    const educationOrganization = await upgrades.deployProxy(EducationOrganization, [
        deployer.address,
    ])
    await educationOrganization.waitForDeployment()

    console.log("EducationOrganization deployed to:", educationOrganization.target)

    return educationOrganization.target
}

module.exports = { deployEducationOrganization }
