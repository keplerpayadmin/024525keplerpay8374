import { ethers } from "ethers"
import { MiniKit } from "@worldcoin/minikit-js"
import { KSTAKING_CONTRACT_ADDRESS, kstakingContractABI, getKStakingContract } from "./kstakingContractABI"

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

    const contract = await getKStakingContract()
    if (!contract) {
      throw new Error("Failed to get KStaking contract instance.")
    }

    const [kppBalance, pendingRewards, lastClaimTime, totalClaimed, rewardsPerDay, rewardsPerYear] = await Promise.all([
      contract.kppToken.balanceOf(address), // Obter saldo KPP do usuário
      contract.calculatePendingRewards(address),
      contract.users(address).then((info: any) => info.lastClaimTime),
      contract.users(address).then((info: any) => info.totalClaimed),
      contract.calculateRewardsPerDay(address),
      contract
        .calculateRewardsPerSecond(address)
        .then((rps: bigint) => rps * BigInt(365 * 24 * 60 * 60)), // Converter para anual
    ])

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
    console.error("Error fetching user staking info:", error)
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

    const [totalRewardsClaimed, contractRewardBalance, currentAPY] = await Promise.all([
      contract.totalRewardsClaimed(),
      contract.getRewardBalance(),
      contract.getCurrentAPY(),
    ])

    return {
      success: true,
      data: {
        totalRewardsClaimed: ethers.formatUnits(totalRewardsClaimed, 18),
        contractRewardBalance: ethers.formatUnits(contractRewardBalance, 18),
        currentAPY: (Number(currentAPY) / 100).toFixed(2), // APY em % (ex: 1200 basis points = 12.00%)
      },
    }
  } catch (error) {
    console.error("Error fetching KStaking contract stats:", error)
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
