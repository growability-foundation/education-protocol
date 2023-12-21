// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

import "contracts/interfaces/IEducationOrganization.sol";
import "contracts/interfaces/IEducationProtocol.sol";

/// @custom:security-contact support@growability.network
contract EducationOrganization is Initializable, PausableUpgradeable, AccessControlUpgradeable, UUPSUpgradeable, IEducationOrganization {
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    IEducationProtocol private educationProtocol;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address _educationProtocol, address defaultAdmin) public initializer {
        __Pausable_init();
        __AccessControl_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(PAUSER_ROLE, defaultAdmin);
        _grantRole(UPGRADER_ROLE, defaultAdmin);

        educationProtocol = IEducationProtocol(_educationProtocol);
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyRole(UPGRADER_ROLE) {}

    function issueCertificate(string memory metadataUri) external returns (uint256) {
        return educationProtocol.issueCertificate(metadataUri);
    }

    function linkCertificateToProfile(uint256 certificateId, uint256 profileId, string memory metadataUri) external {
        return educationProtocol.linkCertificateToProfile(certificateId, profileId, metadataUri);
    } 
}
