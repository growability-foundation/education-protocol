const { ethers } = require("hardhat")

/**
 * Deploys the EducationCertificateNFT contract
 * @param {HardhatEthersSigner} deployer
 */
async function deployEducationCertificateNFT(deployer) {
    // Deployment of the EducationOrganization NFt contract
    const EducationCertificateNFT = await ethers.getContractFactory("EducationCertificateNFT")
    const educationCertificateNFT = await upgrades.deployProxy(EducationCertificateNFT, [
        deployer.address,
    ])
    await educationCertificateNFT.waitForDeployment()

    console.log("EducationCertificateNFT deployed to:", educationCertificateNFT.target)
}

module.exports = { deployEducationCertificateNFT }
