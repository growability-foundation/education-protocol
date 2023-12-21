// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IEducationCertificateNFT {
    function mint(address to, string memory metadataUri) external returns (uint256);
}
