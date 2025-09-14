import { ethers } from "ethers"
import { config, HoldSo, SwapHelper, TokenProvider, ZeroX, inmemoryTokenStorage } from "@holdstation/worldchain-sdk"
import { Client, Multicall3 } from "@holdstation/worldchain-ethers-v6"

/**
 * Local token registry (addresses and decimals) used to:
 * - Convert amountIn from wei -> normal units for the SDK
 * - Improve reliability when token metadata is needed quickly
 */
const TOKENS = [
  {
    address: "0x2cFc85d8E48F8EAB294be644d9E25C3030863003",
    symbol: "WLD",
    name: "Worldcoin",
    decimals: 18,
  },
  {
    address: "0x834a73c0a83F3BCe349A116FFB2A4c2d1C651E45",
    symbol: "TPF",
    name: "TPulseFi",
    decimals: 18,
  },
  {
    address: "0xEdE54d9c024ee80C85ec0a75eD2d8774c7Fbac9B",
    symbol: "WDD",
    name: "Drachma",
    decimals: 18,
  },
  {
    address: "0x79A02482A880bCE3F13e09Da970dC34db4CD24d1",
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
  },
  {
    address: "0x5fa570E9c8514cdFaD81DB6ce0A327D55251fBD4",
    symbol: "KPP",
    name: "KeplerPay",
    decimals: 18,
  },
  {
    address: "0xbF0B23Ec1b8F8505b4F1772517151B2df4A27703",
    symbol: "EDEN",
    name: "Eden Project",
    decimals: 18,
  },
] as const

function findToken(address: string) {
  return TOKENS.find((t) => t.address.toLowerCase() === address.toLowerCase())
}

/**
 * Normalize tx.value for the SDK. It must be a hex quantity string.
 * Examples:
 * - 0, "0" -> "0x0"
 * - "123"  -> "0x7b"
 * - "0x0"  -> "0x0"
 */
function normalizeTxValue(input: unknown): string {
  try {
    if (input === undefined || input === null || input === "" || input === "0") return "0x0"
    if (typeof input === "string") {
      const lower = input.toLowerCase()
      if (lower === "0x" || lower === "0x0" || lower === "0x00") return "0x0"
      if (lower.startsWith("0x")) return input
      const bi = BigInt(input) // decimal string
      return ethers.toQuantity(bi)
    }
    if (typeof input === "number") return ethers.toQuantity(BigInt(input))
    if (typeof input === "bigint") return ethers.toQuantity(input)
  } catch {
    // If parsing fails for any reason, be safe and send zero
  }
  return "0x0"
}

// --- SDK bootstrap (client-side friendly) ---
const RPC_URL = "https://worldchain-mainnet.g.alchemy.com/public"
const provider = new ethers.JsonRpcProvider(RPC_URL, { chainId: 480, name: "worldchain" }, { staticNetwork: true })
const client = new Client(provider)
config.client = client
config.multicall3 = new Multicall3(provider)

const tokenProvider = new TokenProvider({ client, multicall3: config.multicall3 })
const swapHelper = new SwapHelper(client, { tokenStorage: inmemoryTokenStorage })
const zeroX = new ZeroX(tokenProvider, inmemoryTokenStorage)
const worldSwap = new HoldSo(tokenProvider, inmemoryTokenStorage)
swapHelper.load(zeroX)
swapHelper.load(worldSwap)

/**
 * Quote response shape expected by app/dashboard page:
 * {
 *   success: boolean
 *   data?: {
 *     to: string
 *     data: string
 *     value: string           // hex quantity string (e.g. "0x0")
 *     amountOut: string       // human-readable decimal
 *     priceImpact: string
 *     addons?: any
 *   }
 *   error?: string
 * }
 */
export async function getQuote(
  tokenIn: string,
  tokenOut: string,
  amountInWei: string,
  slippage = "0.3",
): Promise<{
  success: boolean
  data?: {
    to: string
    data: string
    value: string
    amountOut: string
    priceImpact: string
    addons?: any
  }
  error?: string
}> {
  try {
    const tokenMeta = findToken(tokenIn)
    const decimals = tokenMeta?.decimals ?? 18

    // Convert incoming wei amount into normal units the SDK expects.
    const amountIn = ethers.formatUnits(amountInWei, decimals)

    // Keep fee settings consistent with your swap execution path.
    const quote = await swapHelper.estimate.quote({
      tokenIn,
      tokenOut,
      amountIn, // decimal string, not wei
      slippage,
      fee: "0.2",
      feeReceiver: "0xf04a78df4cc3017c0c23f37528d7b6cbbeea6677",
    })

    if (!quote || !quote.data || !quote.to) {
      return { success: false, error: "Invalid quote returned from SDK" }
    }

    // Determine output amount string
    let outAmount = "0"
    if (quote.outAmount != null) {
      outAmount = quote.outAmount.toString()
    } else if (quote.addons?.outAmount != null) {
      outAmount = quote.addons.outAmount.toString()
    }

    const priceImpact =
      (quote.addons?.priceImpact != null ? String(quote.addons.priceImpact) : undefined) ??
      (quote.priceImpact != null ? String(quote.priceImpact) : "0")

    // Normalize tx.value to a hex quantity string
    const value = normalizeTxValue((quote as any).value)

    return {
      success: true,
      data: {
        to: quote.to,
        data: quote.data,
        value,
        amountOut: outAmount,
        priceImpact,
        addons: quote.addons,
      },
    }
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to get quote" }
  }
}

/**
 * Validate that the user has enough balance to cover amount (in normal units).
 */
export async function validateBalance(
  amountNormal: string,
  tokenAddress: string,
  walletAddress: string,
  decimals: number,
): Promise<{
  hasBalance: boolean
  available: string
  required: string
  token: string
}> {
  try {
    if (!ethers.isAddress(walletAddress)) {
      return {
        hasBalance: false,
        available: "0",
        required: amountNormal,
        token: tokenAddress,
      }
    }

    const erc20 = new ethers.Contract(tokenAddress, ["function balanceOf(address) view returns (uint256)"], provider)

    const bal = await erc20.balanceOf(walletAddress)
    const available = ethers.formatUnits(bal, decimals)

    const hasBalance = Number.parseFloat(available) >= Number.parseFloat(amountNormal)

    return {
      hasBalance,
      available,
      required: amountNormal,
      token: tokenAddress,
    }
  } catch {
    return {
      hasBalance: false,
      available: "0",
      required: amountNormal,
      token: tokenAddress,
    }
  }
}
