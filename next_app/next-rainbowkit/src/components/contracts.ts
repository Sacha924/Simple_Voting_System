export const wagmiContractConfig = {
  address: '0x88e4a57A70844dbbdD6Bc2cF7746645Eb0943762',
  abi: [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_voteId",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "_yes",
          "type": "bool"
        }
      ],
      "name": "castVote",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getMyVotes",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_voteId",
          "type": "uint256"
        }
      ],
      "name": "getVoteResults",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getVotes",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "ids",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256[]",
          "name": "startTimestamps",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256[]",
          "name": "deadlines",
          "type": "uint256[]"
        },
        {
          "internalType": "string[]",
          "name": "descriptionHashes",
          "type": "string[]"
        },
        {
          "internalType": "uint256[]",
          "name": "yesCounts",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256[]",
          "name": "noCounts",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "nextVoteId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_deadline",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_descriptionHash",
          "type": "string"
        }
      ],
      "name": "proposeVote",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_voteId",
          "type": "uint256"
        }
      ],
      "name": "testGetOneVote",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "startTimestamp",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "descriptionHash",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "yesCount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "noCount",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "voterVotes",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "votes",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "startTimestamp",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "descriptionHash",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "yesCount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "noCount",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
} as const
