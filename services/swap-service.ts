import { ethers } from "ethers"
import {
  config,
  HoldSo,
  SwapHelper,
  TokenProvider,
  ZeroX,
  inmemoryTokenStorage,
  type SwapParams,
} from "@holdstation/worldchain-sdk"
import { Client, Multicall3 } from "@holdstation/worldchain-ethers-v6"
import { TOKENS_BY_SYMBOL } from "./token-registry"

const RPC_URL = "https://worldchain-mainnet.g.alchemy.com/public"
const provider = new ethers.JsonRpcProvider(RPC_URL, { chainId: 480, name: "worldchain" }, { staticNetwork: true })
const client = new Client(provider)
config.client = client
config.multicall3 = new Multicall3(provider)
const swapHelper = new SwapHelper(client, { tokenStorage: inmemoryTokenStorage })
const tokenProvider = new TokenProvider({ client, multicall3: config.multicall3 })
const zeroX = new ZeroX(tokenProvider, inmemoryTokenStorage)
const worldSwap = new HoldSo(tokenProvider, inmemoryTokenStorage)
swapHelper.load(zeroX)
swapHelper.load(worldSwap)

function ensureHexQuantity(v: any): `0x${string}` {
  if (!v) return "0x0"
  if (typeof v === "string" && v.startsWith("0x")) return v as `0x${string}`
  try {
    const bi = typeof v === "bigint" ? v : BigInt(v)
    return bi === 0n ? "0x0" : (("0x" + bi.toString(16)) as `0x${string}`)
  } catch {
    return "0x0"
  }
}

export async function doSwap({
  walletAddress,
  quote,
  amountIn,
  tokenInSymbol,
  tokenOutSymbol,
}: {
  walletAddress: string
  quote: any
  amountIn: string
  tokenInSymbol: "KPP" | "TPF" | "WDD" | "USDC" | "WLD"
  tokenOutSymbol: "KPP" | "TPF" | "WDD" | "USDC" | "WLD"
}) {
  if (!walletAddress || !quote || !amountIn || !tokenInSymbol || !tokenOutSymbol) {
    return { success: false, errorCode: "MISSING_PARAMETERS" }
  }

  const tokenIn = TOKENS_BY_SYMBOL[tokenInSymbol]
  const tokenOut = TOKENS_BY_SYMBOL[tokenOutSymbol]
  if (!tokenIn || !tokenOut) return { success: false, errorCode: "INVALID_TOKEN_SYMBOLS" }

  try {
    const swapParams: SwapParams["input"] = {
      tokenIn: tokenIn.address,
      tokenOut: tokenOut.address,
      amountIn,
      tx: {
        data: quote.data,
        to: quote.to,
        value: ensureHexQuantity(quote.value),
      },
      partnerCode: "24568",
      feeAmountOut: quote.addons?.feeAmountOut,
      fee: "0.2",
      feeReceiver: "0xf04a78df4cc3017c0c23f37528d7b6cbbeea6677",
    }

    const result = await swapHelper.swap(swapParams)
    if (result.success) {
      // wait a little, then poke the chain
      await new Promise((r) => setTimeout(r, 2500))
      await provider.getBlockNumber()
      return { success: true }
    }
    return { success: false, errorCode: result.errorCode || "UNKNOWN_SWAP_ERROR", error: result }
  } catch (error: any) {
    return { success: false, errorCode: error?.message || "EXCEPTION_CAUGHT", error }
  }
}

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
    const tokenMeta =
      TOKENS_BY_SYMBOL[
        Object.keys(TOKENS_BY_SYMBOL).find(
          (key) =>
            TOKENS_BY_SYMBOL[key as keyof typeof TOKENS_BY_SYMBOL].address.toLowerCase() === tokenIn.toLowerCase(),
        ) as keyof typeof TOKENS_BY_SYMBOL
      ]

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
    const value = ensureHexQuantity((quote as any).value)

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
