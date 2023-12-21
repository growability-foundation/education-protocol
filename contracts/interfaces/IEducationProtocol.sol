// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "contracts/enums/NFTType.sol";

interface IEducationProtocol {
    function setDefaultMetadataUri(NFTType nftType, string memory metadataUri) external;

    // Anyone can create profile and get Profile NFT
    function createProfile(address owner, uint256 root, uint256 nullifierHash, uint256[8] calldata proof) external;

    // Will register new education organization and mint NFT pass for owner
    function registerOrganization(address contractAddress, string memory name) external payable;

    // Will issue education organization certificate
    function issueCertificate(string memory metadataUri) external returns(uint256);

    // Will associate certificate with profile
    function linkCertificateToProfile(uint256 certificateId, uint256 profileId, string memory metadataUri) external;
}
