const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers")
const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("Education Protocol", function () {
    const deploymentEducationProtocolFixture = async function () {
        const signers = await ethers.getSigners()
        const adminAddress = signers[0].address

        // Deployment of the EducationProtocol contract
        const EducationProtocol = await ethers.getContractFactory("EducationProtocol")
        const educationProtocol = await upgrades.deployProxy(EducationProtocol, [adminAddress])
        await educationProtocol.waitForDeployment()

        // Deployment nfts
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

        // Initialize the EducationProtocol contract

        // Associate the EducationCertificate contract with the EducationProtocol contract
        await educationProtocol.setEducationCertificateNFT(educationCertificateNFT.target)

        // Associate the EducationOrganization contract with the EducationProtocol contract
        await educationProtocol.setEducationOrganizationNFT(educationOrganizationNFT.target)

        // Associate the EducationProfile contract with the EducationProtocol contract
        await educationProtocol.setEducationProfileNFT(educationProfileNFT.target)

        // Set Education Protocol as minter for EducationOrganization NFT
        educationOrganizationNFT.grantRole(
            await educationOrganizationNFT.MINTER_ROLE(),
            educationProtocol.target
        )

        // Deploy the EducationOrganization contract
        const EducationOrganization = await ethers.getContractFactory("EducationOrganization")
        const educationOrganization = await upgrades.deployProxy(EducationOrganization, [
            educationProtocol.target,
            adminAddress,
        ])
        await educationOrganization.waitForDeployment()

        return {
            signers,
            educationProtocol,
            educationOrganization,
            educationCertificateNFT,
            educationOrganizationNFT,
            educationProfileNFT,
        }
    }

    describe("Deployment", function () {
        it("Organization Registration", async function () {
            const { signers, educationOrganizationNFT, educationProtocol, educationOrganization } =
                await loadFixture(deploymentEducationProtocolFixture)

            // Set registration fee to 1 ETH
            await educationProtocol.setRegistrationFee(ethers.parseEther("1"))

            try {
                // Register an organization
                const registerOrganization = await educationProtocol.registerOrganization(
                    educationOrganization.target,
                    "Organization 1",
                    { value: ethers.parseEther("0.5") }
                )
                await registerOrganization.wait()
            } catch (e) {
                expect(e.message).to.contain("EducationProtocol: Registration fee is required")
            }

            // Register an organization with sending 1 ETH
            const registerOrganization = await educationProtocol.registerOrganization(
                educationOrganization.target,
                "Organization 1",
                { value: ethers.parseEther("1") }
            )
            await registerOrganization.wait()

            // Check NFT owner
            const owner = await educationOrganizationNFT.ownerOf(0)
            expect(owner).to.equal(signers[0].address)
        })
    })
})
