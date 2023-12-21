// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IEducationOrganization {
    // Will issue education organization certificate
    function issueCertificate(string memory metadataUri) external returns(uint256);

    // Will associate certificate with profile
    function linkCertificateToProfile(uint256 certificateId, uint256 profileId, string memory metadataUri) external;
}
