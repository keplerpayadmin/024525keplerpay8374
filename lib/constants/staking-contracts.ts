export const STAKING_CONTRACTS = {
  TPT: {
    symbol: "TPT",
    name: "TradePulse Token",
    address: "0x4c1f9CF3c5742c73a00864a32048988b87121e2f",
    image: "/images/logo-tpf.png",
  },
  WDD: {
    symbol: "WDD",
    name: "Drachma",
    address: "0xc4F3ae925E647aa2623200901a43BF65e8542c23",
    image: "/images/drachma-token.png",
  },
  WLD: {
    symbol: "WLD",
    name: "Worldcoin",
    address: "", // No staking contract for WLD yet
    image: "/images/worldcoin.jpeg",
  },
} as const

export const SOFT_STAKING_ABI = [
  {
    inputs: [],
    name: "claimRewards",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_user", type: "address" }],
    name: "calculatePendingRewards",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_user", type: "address" }],
    name: "canClaim",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "apyRate",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "BASIS_POINTS",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "SECONDS_PER_YEAR",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "rewardToken",
    outputs: [{ internalType: "contract IERC20", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalRewardsClaimed",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tpfToken",
    outputs: [{ internalType: "contract IERC20", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "users",
    outputs: [
      { internalType: "uint256", name: "lastClaimTime", type: "uint256" },
      { internalType: "uint256", name: "totalClaimed", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const
