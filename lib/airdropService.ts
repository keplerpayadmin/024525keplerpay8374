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
      console.log(`Simulating airdrop claim for address: ${address}`)

      // Simulate a successful transaction
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate network delay

      return {
        success: true,
        txHash: "0x" + Math.random().toString(16).substr(2, 64), // Mock transaction hash
        amount: "1.0",
      }
    } catch (error) {
      console.error("Error simulating airdrop claim:", error)
      return {
        success: false,
        error: error.message || "Failed to simulate airdrop claim",
      }
    }
  }
}

export const airdropService = AirdropService.getInstance()
