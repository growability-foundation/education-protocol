// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

import "contracts/helpers/ByteHasher.sol";
import "contracts/interfaces/IWorldID.sol";

/// @custom:security-contact support@growability.network
abstract contract BaseEducationProtocol is Initializable, PausableUpgradeable, AccessControlUpgradeable, UUPSUpgradeable {
    using ByteHasher for bytes;

    /// @notice Thrown when attempting to reuse a nullifier
    error InvalidNullifier();

    /// @dev The World ID instance that will be used for verifying proofs
    IWorldID internal worldId;

    /// @dev The contract's external nullifier hash
    uint256 internal externalNullifier;

    /// @dev The World ID group ID (always 1)
    uint256 internal groupId = 1;

    /// @dev Whether a nullifier hash has been used already. Used to guarantee an action is only performed once by a single person
    mapping(uint256 => bool) internal nullifierHashes;
    
    address public organizationNftAddress;
    address public certificateNftAddress;
    address public profileNftAddress;

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address defaultAdmin) public initializer {
        __Pausable_init();
        __AccessControl_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(PAUSER_ROLE, defaultAdmin);
        _grantRole(UPGRADER_ROLE, defaultAdmin);
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyRole(UPGRADER_ROLE) {}

    function setupProfileVerificator(IWorldID _worldId, string memory _appId, string memory _actionId) public onlyRole(UPGRADER_ROLE) {
        worldId = _worldId;
        externalNullifier = abi.encodePacked(abi.encodePacked(_appId).hashToField(), _actionId).hashToField();
    }

    function setEducationOrganizationNFT(address _address) public onlyRole(UPGRADER_ROLE) {
        organizationNftAddress = _address;
    }

    function setEducationCertificateNFT(address _address) public onlyRole(UPGRADER_ROLE) {
        certificateNftAddress = _address;
    }

    function setEducationProfileNFT(address _address) public onlyRole(UPGRADER_ROLE) {
        profileNftAddress = _address;
    }
}
