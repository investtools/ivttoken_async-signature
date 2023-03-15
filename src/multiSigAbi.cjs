const multiSigAbi = [{
    "inputs": [
        {
            "internalType": "bytes[]",
            "name": "signatures",
            "type": "bytes[]"
        },
        {
            "internalType": "address",
            "name": "_to",
            "type": "address"
        },
        {
            "internalType": "uint256",
            "name": "_value",
            "type": "uint256"
        },
        {
            "internalType": "bytes",
            "name": "_data",
            "type": "bytes"
        },
        {
            "internalType": "bytes32",
            "name": "_nonce",
            "type": "bytes32"
        }
    ],
    "name": "executeTransaction",
    "outputs": [
        {
            "internalType": "bytes",
            "name": "",
            "type": "bytes"
        }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
}]

module.exports = { multiSigAbi: multiSigAbi }