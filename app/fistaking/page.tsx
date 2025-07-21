"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useMiniKit } from "@/hooks/use-minikit"
import { formatUnits } from "ethers"
import { Skeleton } from "@/components/ui/skeleton"
import { Token } from "@/lib/constants/tokens"
import { useTranslation } from "@/lib/i18n"
import { formatTimeDifference } from "@/lib/utils"
import { getKPPTokenContract, getFiStakingContract, getProvider } from "@/lib/utils/ethers-utils"
import TransactionEffects from "@/components/transaction-effects"

interface StakingData {
  userKPPBalance: string
  pendingRewards: string
  lastClaimTime: number
  totalClaimed: string
  contractAPY: string
  contractRewardBalance: string
  nextClaimIn: string
  isClaiming: boolean
}

const formatNumber = (value: string, decimals = 2) => {
  const num = Number.parseFloat(value)
  if (isNaN(num)) return "0.00"
  return num.toFixed(decimals)
}

export default function FiStaking() {
  const { address, miniKit, isConnected } = useMiniKit()
  const { t } = useTranslation()
  const [stakingData, setStakingData] = useState<StakingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [claimStatus, setClaimStatus] = useState<{ success: boolean; message: string } | null>(null)

  const loadStakingData = async () => {
    if (!isConnected || !address) {
      console.log("Wallet not connected or address missing, cannot load staking data.")
      setLoading(false)
      setStakingData(null)
      setError(t.fistaking?.connectWalletFirst || "Connect your wallet first to view staking details.")
      return
    }

    setLoading(true)
    setError(null)
    console.log("Loading staking data for address:", address)

    try {
      const provider = getProvider()
      console.log("Provider connected to network:", (await provider.getNetwork()).name)

      const fiStakingContract = getFiStakingContract(provider)
      const kppTokenContract = getKPPTokenContract(provider)

      if (!fiStakingContract || !kppTokenContract) {
        throw new Error("Failed to get contract instances. Check contract ABIs and addresses.")
      }
      console.log("FiStaking Contract Address:", await fiStakingContract.getAddress())
      console.log("KPP Token Contract Address:", await kppTokenContract.getAddress())

      const [
        userKPPBalanceRaw,
        pendingRewardsRaw,
        lastClaimTimeRaw,
        totalClaimedRaw,
        contractAPYRaw,
        contractRewardBalanceRaw,
      ] = await Promise.all([
        kppTokenContract.balanceOf(address),
        fiStakingContract.pendingRewards(address),
        fiStakingContract.lastClaimTime(address),
        fiStakingContract.totalClaimed(address),
        fiStakingContract.apy(),
        fiStakingContract.getContractBalance(),
      ])

      console.log("Raw Data:", {
        userKPPBalanceRaw: userKPPBalanceRaw.toString(),
        pendingRewardsRaw: pendingRewardsRaw.toString(),
        lastClaimTimeRaw: lastClaimTimeRaw.toString(),
        totalClaimedRaw: totalClaimedRaw.toString(),
        contractAPYRaw: contractAPYRaw.toString(),
        contractRewardBalanceRaw: contractRewardBalanceRaw.toString(),
      })

      const userKPPBalance = formatUnits(userKPPBalanceRaw, Token.KPP.decimals)
      const pendingRewards = formatUnits(pendingRewardsRaw, Token.WLD.decimals) // Assuming WLD for rewards
      const lastClaimTime = Number(lastClaimTimeRaw) * 1000 // Convert to milliseconds
      const totalClaimed = formatUnits(totalClaimedRaw, Token.WLD.decimals)
      const contractAPY = formatUnits(contractAPYRaw, 16) // APY is percentage, likely fixed point
      const contractRewardBalance = formatUnits(contractRewardBalanceRaw, Token.WLD.decimals)

      console.log("Formatted Data:", {
        userKPPBalance,
        pendingRewards,
        lastClaimTime,
        totalClaimed,
        contractAPY,
        contractRewardBalance,
      })

      const nextClaimIn =
        lastClaimTime > 0
          ? formatTimeDifference(lastClaimTime + 24 * 60 * 60 * 1000)
          : t.fistaking?.availableNow || "Available now!"

      setStakingData({
        userKPPBalance,
        pendingRewards,
        lastClaimTime,
        totalClaimed,
        contractAPY,
        contractRewardBalance,
        nextClaimIn,
        isClaiming: false,
      })
    } catch (err) {
      console.error("Error loading staking data:", err)
      setError(t.common?.unexpectedError || "An unexpected error occurred.")
      setStakingData(null)
    } finally {
      setLoading(false)
    }
  }

  const handleClaimRewards = async () => {
    if (!miniKit || !miniKit.provider || !address) {
      setError(t.fistaking?.connectWalletToStake || "Connect your wallet to stake.")
      return
    }

    if (!stakingData || Number.parseFloat(stakingData.pendingRewards) <= 0) {
      setError(t.fistaking?.noRewardsToClaim || "No rewards to claim.")
      return
    }

    setStakingData((prev) => (prev ? { ...prev, isClaiming: true } : null))
    setClaimStatus(null)

    try {
      const signer = miniKit.provider.getSigner()
      const fiStakingContract = getFiStakingContract(signer)
      console.log("Attempting to claim rewards...")

      const tx = await fiStakingContract.claimRewards()
      console.log("Transaction sent:", tx.hash)
      setClaimStatus({ success: true, message: t.fistaking?.processingClaim || "Processing Claim..." })

      await tx.wait()
      console.log("Transaction confirmed!")
      setClaimStatus({
        success: true,
        message: t.fistaking?.rewardsClaimedSuccess?.replace("{token}", "WLD") || "Rewards claimed successfully!",
      })

      await loadStakingData() // Reload data after successful claim
    } catch (err) {
      console.error("Error claiming rewards:", err)
      setError(t.fistaking?.claimError || "Failed to claim rewards.")
      setClaimStatus({ success: false, message: t.fistaking?.claimFailed || "Claim Failed" })
    } finally {
      setStakingData((prev) => (prev ? { ...prev, isClaiming: false } : null))
    }
  }

  useEffect(() => {
    loadStakingData()
    const interval = setInterval(loadStakingData, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [isConnected, address])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-3xl font-bold text-center">{t.fistaking?.title}</h1>
        <p className="text-center text-gray-500 dark:text-gray-400">{t.fistaking?.subtitle}</p>

        {!isConnected ? (
          <Card>
            <CardHeader>
              <CardTitle>{t.fistaking?.connectWalletToStake}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{t.fistaking?.connectWalletFirst}</p>
            </CardContent>
          </Card>
        ) : loading ? (
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-3/4" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="h-4 w-full" />
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-red-500">{t.common?.error}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-400">{error}</p>
              <Button onClick={loadStakingData} className="mt-4">
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : stakingData ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>{t.fistaking?.yourBalance}</CardTitle>
                <CardDescription>{t.fistaking?.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>KPP:</span>
                  <span className="font-medium">{formatNumber(stakingData.userKPPBalance)} KPP</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.fistaking?.pendingRewards}</span>
                  <span className="font-medium">{formatNumber(stakingData.pendingRewards)} WLD</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.fistaking?.totalClaimed}</span>
                  <span className="font-medium">{formatNumber(stakingData.totalClaimed)} WLD</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.fistaking?.lastClaimTime}</span>
                  <span className="font-medium">
                    {stakingData.lastClaimTime > 0
                      ? new Date(stakingData.lastClaimTime).toLocaleString()
                      : t.fistaking?.notClaimedYet}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{t.fistaking?.nextClaimIn}</span>
                  <span className="font-medium">{stakingData.nextClaimIn}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t.fistaking?.contractBalance}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>{t.fistaking?.contractAPY}</span>
                  <span className="font-medium">{formatNumber(stakingData.contractAPY)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.fistaking?.rewardsPerDay}</span>
                  <span className="font-medium">
                    {formatNumber(
                      (Number.parseFloat(stakingData.contractAPY) / 36500) *
                        Number.parseFloat(stakingData.userKPPBalance),
                    )}{" "}
                    WLD
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{t.fistaking?.rewardsPerYear}</span>
                  <span className="font-medium">
                    {formatNumber(
                      (Number.parseFloat(stakingData.contractAPY) / 100) *
                        Number.parseFloat(stakingData.userKPPBalance),
                    )}{" "}
                    WLD
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{t.fistaking?.contractRewardBalance}</span>
                  <span className="font-medium">{formatNumber(stakingData.contractRewardBalance)} WLD</span>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleClaimRewards}
              className="w-full"
              disabled={
                stakingData.isClaiming ||
                Number.parseFloat(stakingData.pendingRewards) <= 0 ||
                Number.parseFloat(stakingData.contractRewardBalance) <= 0
              }
            >
              {stakingData.isClaiming ? t.fistaking?.claiming : t.fistaking?.claim}
            </Button>
            {claimStatus && (
              <TransactionEffects
                success={claimStatus.success}
                message={claimStatus.message}
                onDismiss={() => setClaimStatus(null)}
              />
            )}
          </>
        ) : null}
      </div>
    </main>
  )
}
