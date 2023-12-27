require("@nomicfoundation/hardhat-toolbox")
require("@openzeppelin/hardhat-upgrades")

require("dotenv").config()

// Go to https://alchemy.com, sign up, create a new App in
// its dashboard, and replace "KEY" with its key
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY

// Replace this private key with your Sepolia account private key
// To export your private key from Coinbase Wallet, go to
// Settings > Developer Settings > Show private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Beware: NEVER put real Ether into testing accounts
const PRIVATE_KEY = process.env.PRIVATE_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.20",
    hardhat: {
        initialBaseFeePerGas: 0,
    },
    networks: {
        hardhat: {},
        mainnet: {
            url: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
            accounts: [PRIVATE_KEY],
        },
        sepolia: {
            url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
            accounts: [PRIVATE_KEY],
            gas: 2100000,
            gasPrice: 8000000000,
            saveDeployments: true,
        },
        optimism_goerli: {
            url: `https://opt-goerli.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
            accounts: [PRIVATE_KEY],
        },
        optimism_mainnet: {
            url: `https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
            accounts: [PRIVATE_KEY],
        },
    },
}
