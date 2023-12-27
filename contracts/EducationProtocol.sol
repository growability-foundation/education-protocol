// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "contracts/BaseEducationProtocol.sol";

import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "contracts/interfaces/IEducationProtocol.sol";
import "contracts/interfaces/IEducationOrganizationNFT.sol";
import "contracts/interfaces/IEducationCertificateNFT.sol";
import "contracts/interfaces/IEducationProfileNFT.sol";

import "contracts/helpers/ByteHasher.sol";
import "contracts/interfaces/IWorldID.sol";

/// ---
/// Education Protocol
/// ---

/// @custom:security-contact support@growability.network
contract EducationProtocol is BaseEducationProtocol, IEducationProtocol {
    using ByteHasher for bytes;

    uint256 private REGISTRATION_FEE = 0.1 ether;

    mapping(NFTType => string) defaultMetadataUri;
    mapping(uint256 => address) organizationIdToAddress;
    mapping(address => uint256) addressToOrganizationId;

    // Keep metadata uri for individual certificates
    mapping(uint256 => mapping(uint256 => string)) profileCertificateMetadataUri;

    // Events
    event EducationOrganizationRegistered(uint256 id, string name, address account);
    event ProfileCreated(address to, uint256 profileId);

    function setDefaultMetadataUri(NFTType nftType, string memory metadataUri) external onlyRole(UPGRADER_ROLE) {
        defaultMetadataUri[nftType] = metadataUri;
    }

    function setRegistractionFee(uint256 fee) external onlyRole(UPGRADER_ROLE) {
        REGISTRATION_FEE = fee;
    }

    // Will register organization in Education Protocol
    function registerOrganization(address contractAddress, string memory name) public payable {
        // Check registration fee
        require(msg.value == REGISTRATION_FEE, "EducationProtocol: Registration fee is required");

        // If already registered
        require(addressToOrganizationId[contractAddress] == 0, "EducationProtocol: Organization already exist");

        // Mint NFT for access to portal to sender
        uint256 organizationId = IEducationOrganizationNFT(organizationNftAddress).mint(msg.sender, defaultMetadataUri[NFTType.ORGANIZATION]);

        organizationIdToAddress[organizationId] = contractAddress;
        addressToOrganizationId[contractAddress] = organizationId;

        emit EducationOrganizationRegistered(organizationId, name, contractAddress);
    }

    // Create new profile
    function createProfile(address owner, uint256 root, uint256 nullifierHash, uint256[8] calldata proof) external {
        if (nullifierHashes[nullifierHash]) revert InvalidNullifier();

        // We now verify the provided proof is valid and the user is verified by World ID
        worldId.verifyProof(root, groupId, abi.encodePacked(owner).hashToField(), nullifierHash, externalNullifier, proof);

        nullifierHashes[nullifierHash] = true;

        uint256 profileId = IEducationProfileNFT(profileNftAddress).mint(owner, defaultMetadataUri[NFTType.PROFILE]);

        emit ProfileCreated(owner, profileId);
    }

    function issueCertificate(string memory metadataUri) external returns (uint256) {
        // We need to be sure that this method was called by registered organization contract
        require(addressToOrganizationId[msg.sender] != 0, "EducationProtocol: Only for organization");

        // Mint certificate to organization contract address
        uint256 certificateId = IEducationCertificateNFT(certificateNftAddress).mint(msg.sender, metadataUri);

        return certificateId;
    }

    function linkCertificateToProfile(uint256 certificateId, uint256 profileId, string memory metadataUri) external {
        // We need to be sure that this method was called by registered organization contract
        require(addressToOrganizationId[msg.sender] != 0, "EducationProtocol: Only for organization");

        // if organization is issuer
        require(IERC721(certificateNftAddress).ownerOf(certificateId) == msg.sender, "EducationProtocol: Only for issuer");

        profileCertificateMetadataUri[profileId][certificateId] = metadataUri;
    }
}
