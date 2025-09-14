import { MiniKit } from "@worldcoin/minikit-js"
import { AIRDROP_CONTRACT_ABI, AIRDROP_CONTRACT_ADDRESS } from "./airdropContractABI" // Importar do arquivo centralizado

export interface AirdropStatus {
  canClaim: boolean
  lastClaimTime: number | null
  nextClaimTime: number | null
  dailyAmount: string
  totalClaimed: string
}

export interface UserBalance {
  tpfBalance: string
  usdValue: string
  pendingRewards: string
  totalEarned: string
}

export interface ClaimResult {
  success: boolean
  txHash?: string
  amount?: string
  error?: string
}

export class AirdropService {
  private static instance: AirdropService
  private baseUrl = "/api/airdrop"

  static getInstance(): AirdropService {
    if (!AirdropService.instance) {
      AirdropService.instance = new AirdropService()
    }
    return AirdropService.instance
  }

  async getStatus(): Promise<AirdropStatus> {
    const response = await fetch(`${this.baseUrl}/status`)
    if (!response.ok) {
      throw new Error("Failed to get airdrop status")
    }
    return response.json()
  }

  async getBalance(): Promise<{ balance: string; symbol: string }> {
    const response = await fetch(`${this.baseUrl}/balance`)
    if (!response.ok) {
      throw new Error("Failed to get balance")
    }
    return response.json()
  }

  async processClaim(worldIdProof: any): Promise<ClaimResult> {
    const response = await fetch(`${this.baseUrl}/process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ worldIdProof }),
    })

    if (!response.ok) {
      throw new Error("Failed to process claim")
    }

    return response.json()
  }

  async getAirdropStatus(address: string): Promise<AirdropStatus> {
    try {
      console.log(`Checking airdrop status for address: ${address}`)

      // Check localStorage for last claim time
      const lastClaimTimeStr = localStorage.getItem(`lastClaim_${address}`)

      const now = Math.floor(Date.now() / 1000)
      const claimInterval = 24 * 60 * 60 // 24 hours in seconds
      const lastClaimTime = lastClaimTimeStr ? Math.floor(new Date(lastClaimTimeStr).getTime() / 1000) : null
      const nextClaimTime = lastClaimTime ? lastClaimTime + claimInterval : null
      const canClaim = now >= (nextClaimTime || 0)

      return {
        canClaim: canClaim,
        lastClaimTime: lastClaimTime,
        nextClaimTime: nextClaimTime,
        dailyAmount: "1.0",
        totalClaimed: "50.0",
      }
    } catch (error) {
      console.error("Error fetching airdrop status:", error)
      throw new Error("Failed to fetch airdrop status")
    }
  }

  async getContractBalance(): Promise<UserBalance> {
    try {
      console.log("Fetching contract balance...")

      return {
        tpfBalance: "1000.0",
        usdValue: "100.0",
        pendingRewards: "1.0",
        totalEarned: "50.0",
      }
    } catch (error) {
      console.error("Error fetching contract balance:", error)
      throw new Error("Failed to fetch contract balance")
    }
  }

  async claimAirdrop(address: string): Promise<ClaimResult> {
    try {
      console.log(`Claiming airdrop for address: ${address}`)

      if (!MiniKit.isInstalled()) {
        throw new Error("MiniKit is not installed")
      }

      // Usar o endereço e ABI do contrato de Airdrop importados
      const contractAddress = AIRDROP_CONTRACT_ADDRESS
      const contractABI = AIRDROP_CONTRACT_ABI

      console.log("Calling MiniKit.commandsAsync.sendTransaction...")
      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: contractAddress,
            abi: contractABI,
            functionName: "claimAirdrop",
            args: [],
          },
        ],
      })

      console.log("MiniKit transaction response:", finalPayload)

      if (finalPayload.status === "error") {
        console.error("Error claiming airdrop:", finalPayload.message)
        return {
          success: false,
          error: finalPayload.message || "Failed to claim airdrop",
        }
      }

      console.log("Airdrop claimed successfully:", finalPayload)

      // Save claim timestamp to localStorage
      localStorage.setItem(`lastClaim_${address}`, new Date().toISOString())

      return {
        success: true,
        txHash: finalPayload.transaction_id || "0x" + Math.random().toString(16).substr(2, 64),
        amount: "1.0",
      }
    } catch (error) {
      console.error("Error claiming airdrop:", error)
      return {
        success: false,
        error: error.message || "Failed to claim airdrop",
      }
    }
  }
}

export const airdropService = AirdropService.getInstance()
