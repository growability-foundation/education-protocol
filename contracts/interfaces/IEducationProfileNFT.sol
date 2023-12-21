// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IEducationProfileNFT {
    function mint(address to, string memory metadataUri) external returns (uint256);
}
