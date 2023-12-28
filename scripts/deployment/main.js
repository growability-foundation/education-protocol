const { deployEducationOrganizationNFT } = require("./nft/deployEducationOrganizationNFT")
const { deployEducationCertificateNFT } = require("./nft/deployEducationCertificateNFT")
const { deployEducationProfileNFT } = require("./nft/deployEducationProfileNFT")
const { deployEducationProtocol } = require("./deployEducationProtocol")

async function main() {
    const accounts = await ethers.getSigners()
    const deployer = accounts[0]

    console.log("Deploying NFT contracts with the account:", deployer.address)
    const educationOrganizationNFT = await deployEducationOrganizationNFT(deployer)
    const educationCertificateNFT = await deployEducationCertificateNFT(deployer)
    const educationProfileNFT = await deployEducationProfileNFT(deployer)

    console.log("Deploying EducationProtocol contract with the account:", deployer.address)
    const educationProtocol = await deployEducationProtocol(deployer)

    console.log("Initializing EducationProtocol contract")
    await educationProtocol.setEducationCertificateNFT(educationCertificateNFT)
    await educationProtocol.setEducationOrganizationNFT(educationOrganizationNFT)
    await educationProtocol.setEducationProfileNFT(educationProfileNFT)

    console.log("Set Education Protocol as minter for NFT")
    await educationOrganizationNFT.grantRole(
        await educationOrganizationNFT.MINTER_ROLE(),
        educationProtocol
    )
    await educationCertificateNFT.grantRole(
        await educationCertificateNFT.MINTER_ROLE(),
        educationProtocol
    )
    await educationProfileNFT.grantRole(await educationProfileNFT.MINTER_ROLE(), educationProtocol)

    // Deploying EducationOrganization contract not part of the protocol
    // and should be deployed by the organization

    console.log("Done!")
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
