import { ethers } from "ethers"
import { MiniKit } from "@worldcoin/minikit-js"
import { KSTAKING_CONTRACT_ADDRESS, kstakingContractABI, getKStakingContract } from "./kstakingContractABI"
import { KPP_TOKEN_ADDRESS, erc20ABI } from "./airdropContractABI" // Importar RPC_ENDPOINTS

// Interface para as informações do usuário de staking
export interface UserStakingInfo {
  kppBalance: string
  pendingRewards: string
  lastClaimTime: number
  totalClaimed: string
  rewardsPerDay: string
  rewardsPerYear: string
}

// Interface para as estatísticas do contrato
export interface ContractStakingStats {
  totalRewardsClaimed: string
  contractRewardBalance: string
  currentAPY: string
}

// Função para obter informações de staking do usuário
export async function getUserStakingInfo(
  address: string,
): Promise<{ success: boolean; data?: UserStakingInfo; error?: string }> {
  try {
    if (!address) {
      return { success: false, error: "Address is required" }
    }

    const contract = await getKStakingContract() // Esta função já tenta vários RPCs e retorna um contrato com provedor
    if (!contract) {
      throw new Error("Failed to get KStaking contract instance.")
    }

    const provider = contract.runner?.provider
    if (!provider) {
      // Isso não deve acontecer se getKStakingContract for bem-sucedido, mas é um fallback seguro
      throw new Error("KStaking contract instance does not have a provider attached.")
    }

    const kppTokenContract = new ethers.Contract(KPP_TOKEN_ADDRESS, erc20ABI, provider)

    let kppBalance: bigint = BigInt(0)
    let pendingRewards: bigint = BigInt(0)
    let lastClaimTime: bigint = BigInt(0)
    let totalClaimed: bigint = BigInt(0)
    let rewardsPerDay: bigint = BigInt(0)
    let rewardsPerYear: bigint = BigInt(0)

    // Adicionar try-catch individual para cada chamada de contrato para depuração
    try {
      kppBalance = await kppTokenContract.balanceOf(address)
    } catch (e) {
      console.error("Error fetching kppBalance:", e)
      // Se o erro for 'formatJson', significa que o RPC retornou algo que não é JSON
      if (e instanceof Error && e.message.includes("formatJson")) {
        throw new Error(`RPC Error (kppBalance): ${e.message}. Check RPC endpoint stability.`)
      }
      throw e // Re-lançar outros erros
    }

    try {
      pendingRewards = await contract.calculatePendingRewards(address)
    } catch (e) {
      console.error("Error fetching pendingRewards:", e)
      if (e instanceof Error && e.message.includes("formatJson")) {
        throw new Error(`RPC Error (pendingRewards): ${e.message}. Check RPC endpoint stability.`)
      }
      throw e
    }

    try {
      const userInfo = await contract.users(address)
      lastClaimTime = userInfo.lastClaimTime
      totalClaimed = userInfo.totalClaimed
    } catch (e) {
      console.error("Error fetching user info (lastClaimTime, totalClaimed):", e)
      if (e instanceof Error && e.message.includes("formatJson")) {
        throw new Error(`RPC Error (userInfo): ${e.message}. Check RPC endpoint stability.`)
      }
      throw e
    }

    try {
      rewardsPerDay = await contract.calculateRewardsPerDay(address)
    } catch (e) {
      console.error("Error fetching rewardsPerDay:", e)
      if (e instanceof Error && e.message.includes("formatJson")) {
        throw new Error(`RPC Error (rewardsPerDay): ${e.message}. Check RPC endpoint stability.`)
      }
      throw e
    }

    try {
      const rps = await contract.calculateRewardsPerSecond(address)
      rewardsPerYear = rps * BigInt(365 * 24 * 60 * 60)
    } catch (e) {
      console.error("Error fetching rewardsPerYear:", e)
      if (e instanceof Error && e.message.includes("formatJson")) {
        throw new Error(`RPC Error (rewardsPerYear): ${e.message}. Check RPC endpoint stability.`)
      }
      throw e
    }

    return {
      success: true,
      data: {
        kppBalance: ethers.formatUnits(kppBalance, 18),
        pendingRewards: ethers.formatUnits(pendingRewards, 18),
        lastClaimTime: Number(lastClaimTime),
        totalClaimed: ethers.formatUnits(totalClaimed, 18),
        rewardsPerDay: ethers.formatUnits(rewardsPerDay, 18),
        rewardsPerYear: ethers.formatUnits(rewardsPerYear, 18),
      },
    }
  } catch (error) {
    console.error("Error in getUserStakingInfo (outer catch):", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to fetch user staking info" }
  }
}

// Função para obter estatísticas do contrato de staking
export async function getKStakingContractStats(): Promise<{
  success: boolean
  data?: ContractStakingStats
  error?: string
}> {
  try {
    const contract = await getKStakingContract()
    if (!contract) {
      throw new Error("Failed to get KStaking contract instance.")
    }

    let totalRewardsClaimed: bigint = BigInt(0)
    let contractRewardBalance: bigint = BigInt(0)
    let currentAPY: bigint = BigInt(0)

    try {
      totalRewardsClaimed = await contract.totalRewardsClaimed()
    } catch (e) {
      console.error("Error fetching totalRewardsClaimed:", e)
      if (e instanceof Error && e.message.includes("formatJson")) {
        throw new Error(`RPC Error (totalRewardsClaimed): ${e.message}. Check RPC endpoint stability.`)
      }
      throw e
    }

    try {
      contractRewardBalance = await contract.getRewardBalance()
    } catch (e) {
      console.error("Error fetching contractRewardBalance:", e)
      if (e instanceof Error && e.message.includes("formatJson")) {
        throw new Error(`RPC Error (contractRewardBalance): ${e.message}. Check RPC endpoint stability.`)
      }
      throw e
    }

    try {
      currentAPY = await contract.getCurrentAPY()
    } catch (e) {
      console.error("Error fetching currentAPY:", e)
      if (e instanceof Error && e.message.includes("formatJson")) {
        throw new Error(`RPC Error (currentAPY): ${e.message}. Check RPC endpoint stability.`)
      }
      throw e
    }

    return {
      success: true,
      data: {
        totalRewardsClaimed: ethers.formatUnits(totalRewardsClaimed, 18),
        contractRewardBalance: ethers.formatUnits(contractRewardBalance, 18),
        currentAPY: (Number(currentAPY) / 100).toFixed(2), // APY em % (ex: 1200 basis points = 12.00%)
      },
    }
  } catch (error) {
    console.error("Error in getKStakingContractStats (outer catch):", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to fetch KStaking contract stats" }
  }
}

// Função para reivindicar recompensas
export async function claimKStakingRewards(
  address: string,
): Promise<{ success: boolean; txId?: string; error?: string }> {
  try {
    if (!MiniKit.isInstalled()) {
      throw new Error("MiniKit is not installed. Please install the Worldcoin App.")
    }

    console.log("MiniKit is installed, preparing to claim KStaking rewards...")
    console.log("Contract address:", KSTAKING_CONTRACT_ADDRESS)
    console.log("Using ABI:", JSON.stringify(kstakingContractABI))

    const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
      transaction: [
        {
          address: KSTAKING_CONTRACT_ADDRESS,
          abi: kstakingContractABI,
          functionName: "claimRewards",
          args: [],
        },
      ],
    })

    console.log("MiniKit KStaking transaction response:", finalPayload)

    if (finalPayload.status === "error") {
      console.error("Error claiming KStaking rewards:", finalPayload.message)
      throw new Error(finalPayload.message || "Failed to claim KStaking rewards")
    }

    console.log("KStaking rewards claimed successfully:", finalPayload)

    // Disparar evento para atualizar o saldo na UI (se necessário)
    // Exemplo: window.dispatchEvent(new CustomEvent("kpp_balance_updated"));

    return {
      success: true,
      txId: finalPayload.transaction_id,
    }
  } catch (error) {
    console.error("Error claiming KStaking rewards:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred during the KStaking claim",
    }
  }
}
