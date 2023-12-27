const { time, loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers")
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs")
const { expect } = require("chai")

describe("Education Protocol", function () {
    const deployingNFTsFixture = async function () {
        const signers = await ethers.getSigners()
        const adminAddress = signers[0].address

        // Deploying EducationCertificate NFT contract
        const EducationCertificateNFT = await ethers.getContractFactory("EducationCertificateNFT")
        const educationCertificateNFT = await upgrades.deployProxy(EducationCertificateNFT, [
            adminAddress,
        ])
        await educationCertificateNFT.waitForDeployment()

        // Deployment of the EducationOrganization NFt contract
        const EducationOrganizationNFT = await ethers.getContractFactory("EducationOrganizationNFT")
        const educationOrganizationNFT = await upgrades.deployProxy(EducationOrganizationNFT, [
            adminAddress,
        ])
        await educationOrganizationNFT.waitForDeployment()

        // Deployment of the EducationProfile contract
        const EducationProfileNFT = await ethers.getContractFactory("EducationProfileNFT")
        const educationProfileNFT = await upgrades.deployProxy(EducationProfileNFT, [adminAddress])
        await educationProfileNFT.waitForDeployment()

        return { educationCertificateNFT, educationOrganizationNFT, educationProfileNFT }
    }

    const deploymentEducationProtocolFixture = async function () {
        const signers = await ethers.getSigners()
        const adminAddress = signers[0].address

        // Deployment of the EducationProtocol contract
        const EducationProtocol = await ethers.getContractFactory("EducationProtocol")
        const educationProtocol = await upgrades.deployProxy(EducationProtocol, [adminAddress])
        await educationProtocol.waitForDeployment()

        const transaction = await educationProtocol.setRegistrationFee("1000000000000000000") // 1 ETH
        await transaction.wait()

        // Deployment nfts
        const { educationCertificateNFT, educationOrganizationNFT, educationProfileNFT } =
            await loadFixture(deployingNFTsFixture)

        // Associate the EducationCertificate contract with the EducationProtocol contract
        await educationProtocol.setEducationCertificateNFT(educationCertificateNFT.target)

        // Associate the EducationOrganization contract with the EducationProtocol contract
        await educationProtocol.setEducationOrganizationNFT(educationOrganizationNFT.target)

        // Associate the EducationProfile contract with the EducationProtocol contract
        await educationProtocol.setEducationProfileNFT(educationProfileNFT.target)

        // Deploy the EducationOrganization contract
        const EducationOrganization = await ethers.getContractFactory("EducationOrganization")
        const educationOrganization = await upgrades.deployProxy(EducationOrganization, [
            educationProtocol.target,
            adminAddress,
        ])
        await educationOrganization.waitForDeployment()

        return { educationProtocol, educationOrganization }
    }

    describe("Deployment", function () {
        it("Check roles", async function () {
            const { educationProtocol } = await loadFixture(deploymentEducationProtocolFixture)
        })
    })
})
