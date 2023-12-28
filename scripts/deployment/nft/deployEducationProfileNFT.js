const { HardhatEthersSigner } = require("@nomicfoundation/hardhat-ethers/signers")
const { ethers } = require("hardhat")

/**
 * Deploys the EducationProfileNFT contract
 * @param {HardhatEthersSigner} deployer
 * @returns
 */
async function deployEducationProfileNFT(deployer) {
    // Deployment of the EducationOrganization NFt contract
    const EducationProfileNFT = await ethers.getContractFactory("EducationProfileNFT")
    const educationProfileNFT = await upgrades.deployProxy(EducationProfileNFT, [deployer.address])
    await educationProfileNFT.waitForDeployment()

    console.log("EducationProfileNFT deployed to:", educationProfileNFT.target)

    return educationProfileNFT
}

module.exports = { deployEducationProfileNFT }
