export interface TokenInfo {
  address: string
  symbol: string
  name: string
  decimals: number
  image?: string
}

export const TOKEN_REGISTRY: Record<string, TokenInfo> = {
  KPP: {
    address: "0x5fa570E9c8514cdFaD81DB6ce0A327D55251fBD4",
    symbol: "KPP",
    name: "KeplerPay",
    decimals: 18,
    image: "/images/keplerpay-logo-new.png",
  },
  TPF: {
    address: "0x834a73c0a83F3BCe349A116FFB2A4c2d1C651E45",
    symbol: "TPF",
    name: "TPulseFi",
    decimals: 18,
    image: "/tpf-logo.png",
  },
  WDD: {
    address: "0xEdE54d9c024ee80C85ec0a75eD2d8774c7Fbac9B",
    symbol: "WDD",
    name: "Drachma",
    decimals: 18,
    image: "/images/drachma-token.png",
  },
  USDC: {
    address: "0x79A02482A880bCE3F13e09Da970dC34db4CD24d1",
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    image: "/images/usdc.png",
  },
  WLD: {
    address: "0x2cFc85d8E48F8EAB294be644d9E25C3030863003",
    symbol: "WLD",
    name: "Worldcoin",
    decimals: 18,
    image: "/worldcoin-logo.jpeg",
  },
}

export function getTokenByAddress(address: string): TokenInfo | undefined {
  return Object.values(TOKEN_REGISTRY).find((token) => token.address.toLowerCase() === address.toLowerCase())
}

export function getTokenBySymbol(symbol: string): TokenInfo | undefined {
  return TOKEN_REGISTRY[symbol.toUpperCase()]
}

export function getAllTokens(): TokenInfo[] {
  return Object.values(TOKEN_REGISTRY)
}

// Export TOKENS_BY_SYMBOL as an alias for TOKEN_REGISTRY for compatibility
export const TOKENS_BY_SYMBOL = TOKEN_REGISTRY
