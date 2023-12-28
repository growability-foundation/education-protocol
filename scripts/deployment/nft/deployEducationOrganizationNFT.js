const { ethers } = require("hardhat")

/**
 * Deploys the EducationOrganizationNFT contract
 * @param {HardhatEthersSigner} deployer
 */
async function deployEducationOrganizationNFT(deployer) {
    // Deployment of the EducationOrganization NFt contract
    const EducationOrganizationNFT = await ethers.getContractFactory("EducationOrganizationNFT")
    const educationOrganizationNFT = await upgrades.deployProxy(EducationOrganizationNFT, [
        deployer.address,
    ])
    await educationOrganizationNFT.waitForDeployment()

    console.log("EducationOrganizationNFT deployed to:", educationOrganizationNFT.target)
}

module.exports = { deployEducationOrganizationNFT }
