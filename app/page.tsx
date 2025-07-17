"use client"

import { useState } from "react"
import { LandingScreen } from "@/components/landing-screen"
import { MiniKitProvider } from "@/minikit-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Gift, Coins, TrendingUp, CheckCircle, LogOut, ExternalLink, Handshake } from "lucide-react"
import Image from "next/image"
import { useEffect } from "react"
import { AnimatedBackground } from "@/components/animated-background"
import { BottomNavigation } from "@/components/bottom-navigation"

function MainApp({ onDisconnect }: { onDisconnect: () => void }) {
  const [kppBalance, setKppBalance] = useState(0) // KPP tokens from check-ins
  const [balance, setBalance] = useState(1250.75) // WLD balance for staking only
  const [stakedAmount, setStakedAmount] = useState(500)
  const [stakeInput, setStakeInput] = useState("")
  const [checkedIn, setCheckedIn] = useState(false)
  const [stakingRewards, setStakingRewards] = useState(12.34)
  const [timeLeft, setTimeLeft] = useState(86400) // 24 hours in seconds
  const [activeTab, setActiveTab] = useState("airdrop")

  // Countdown timer for next check-in
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Auto-increment staking rewards
  useEffect(() => {
    const rewardTimer = setInterval(() => {
      setStakingRewards((prev) => prev + 0.001)
    }, 5000)
    return () => clearInterval(rewardTimer)
  }, [])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleCheckIn = () => {
    setKppBalance((prev) => prev + 1)
    setCheckedIn(true)
    setTimeout(() => setCheckedIn(false), 3000)
  }

  const handleStake = () => {
    const amount = Number.parseFloat(stakeInput)
    if (amount > 0 && amount <= balance) {
      setBalance((prev) => prev - amount)
      setStakedAmount((prev) => prev + amount)
      setStakeInput("")
    }
  }

  const handleUnstake = () => {
    const amount = Number.parseFloat(stakeInput)
    if (amount > 0 && amount <= stakedAmount) {
      setStakedAmount((prev) => prev - amount)
      setBalance((prev) => prev + amount)
      setStakeInput("")
    }
  }

  const handleClaimRewards = () => {
    setBalance((prev) => prev + stakingRewards)
    setStakingRewards(0)
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 min-h-screen pb-24">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <Image
              src="/images/keplerpay-logo-light.png"
              alt="KeplerPay Logo"
              width={60}
              height={60}
              className="drop-shadow-lg"
            />
            <Button
              onClick={onDisconnect}
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10 bg-black/20 backdrop-blur-sm"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Disconnect
            </Button>
          </div>

          {/* KPP Balance Card */}
          <Card className="mb-6 bg-black/40 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Gift className="h-5 w-5" />
                KPP Tokens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-400 mb-2">{kppBalance} KPP</div>
              <div className="text-sm text-white/60">Check-in Rewards</div>
            </CardContent>
          </Card>

          {/* Content based on active tab */}
          {activeTab === "airdrop" && (
            <div className="space-y-4">
              <Card className="bg-black/40 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Gift className="h-5 w-5" />
                    Daily Check-in
                  </CardTitle>
                  <CardDescription className="text-white/60">Check in daily to earn 1 KPP token</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                    <div>
                      <div className="text-lg font-semibold text-white">1 KPP</div>
                      <div className="text-sm text-white/60">Daily reward available</div>
                    </div>
                    <Badge variant="secondary" className="bg-green-600/20 text-green-400 border-green-400/20">
                      Available
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Next check-in in:</span>
                      <span className="text-white font-mono">{formatTime(timeLeft)}</span>
                    </div>
                    <Progress value={(86400 - timeLeft) / 864} className="h-2" />
                  </div>

                  <Button
                    onClick={handleCheckIn}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={checkedIn}
                  >
                    {checkedIn ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Checked In!
                      </>
                    ) : (
                      <>
                        <Gift className="mr-2 h-4 w-4" />
                        Check in
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Check-in Streak */}
              <Card className="bg-black/40 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Check-in Streak</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-orange-400">7 Days</div>
                      <div className="text-sm text-white/60">Current streak</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-white">{kppBalance} KPP</div>
                      <div className="text-sm text-white/60">Total earned</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "staking" && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Staking Stats */}
                <Card className="bg-black/40 border-white/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Coins className="h-5 w-5" />
                      Active Staking
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-2xl font-bold text-white">{stakedAmount.toFixed(2)} WLD</div>
                      <div className="text-sm text-white/60">Total staked</div>
                    </div>
                    <Separator className="bg-white/20" />
                    <div className="flex justify-between">
                      <span className="text-white/60">APY</span>
                      <span className="text-green-400 font-semibold">8.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Lock period</span>
                      <span className="text-white">Flexible</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Rewards */}
                <Card className="bg-black/40 border-white/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <TrendingUp className="h-5 w-5" />
                      Rewards
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-2xl font-bold text-green-400">{stakingRewards.toFixed(3)} WLD</div>
                      <div className="text-sm text-white/60">Accumulated rewards</div>
                    </div>
                    <Button
                      onClick={handleClaimRewards}
                      variant="outline"
                      className="w-full border-green-500 text-green-400 hover:bg-green-500/10 bg-transparent"
                      disabled={stakingRewards < 0.001}
                    >
                      <Coins className="mr-2 h-4 w-4" />
                      Claim Rewards
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Staking Actions */}
              <Card className="bg-black/40 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Manage Staking</CardTitle>
                  <CardDescription className="text-white/60">Stake or unstake your WLD tokens</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-white">
                      Amount
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={stakeInput}
                      onChange={(e) => setStakeInput(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40 backdrop-blur-sm"
                    />
                    <div className="text-sm text-white/60">
                      Available: {balance.toFixed(2)} WLD | Staked: {stakedAmount.toFixed(2)} WLD
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={handleStake}
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={
                        !stakeInput || Number.parseFloat(stakeInput) <= 0 || Number.parseFloat(stakeInput) > balance
                      }
                    >
                      Stake
                    </Button>
                    <Button
                      onClick={handleUnstake}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                      disabled={
                        !stakeInput ||
                        Number.parseFloat(stakeInput) <= 0 ||
                        Number.parseFloat(stakeInput) > stakedAmount
                      }
                    >
                      Unstake
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setStakeInput((balance * 0.25).toString())}
                      className="text-white/60 hover:text-white hover:bg-white/10"
                    >
                      25%
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setStakeInput((balance * 0.5).toString())}
                      className="text-white/60 hover:text-white hover:bg-white/10"
                    >
                      50%
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setStakeInput((balance * 0.75).toString())}
                      className="text-white/60 hover:text-white hover:bg-white/10"
                    >
                      75%
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setStakeInput(balance.toString())}
                      className="text-white/60 hover:text-white hover:bg-white/10"
                    >
                      MAX
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "partnerships" && (
            <div className="space-y-4">
              <Card className="bg-black/40 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Handshake className="h-5 w-5" />
                    Our Partners
                  </CardTitle>
                  <CardDescription className="text-white/60">
                    Companies and projects that support our ecosystem
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* TPulseFi Partner */}
                    <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                      <div className="flex-shrink-0">
                        <Image
                          src="/images/tpulsefi-logo.png"
                          alt="TPulseFi Logo"
                          width={48}
                          height={48}
                          className="rounded-lg"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-white">TPulseFi</h3>
                          <Badge variant="outline" className="border-blue-400/50 text-blue-400 text-xs">
                            Development Partner
                          </Badge>
                        </div>
                        <p className="text-sm text-white/70 mb-3">
                          This partner was responsible for helping with the development of our application
                        </p>
                        <Button
                          onClick={() =>
                            window.open(
                              "https://worldcoin.org/mini-app?app_id=app_a3a55e132983350c67923dd57dc22c5e&app_mode=mini-app",
                              "_blank",
                            )
                          }
                          variant="outline"
                          size="sm"
                          className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Visit Partner
                        </Button>
                      </div>
                    </div>

                    {/* Coming Soon */}
                    <div className="text-center py-8">
                      <div className="text-white/40 mb-2">
                        <Handshake className="h-12 w-12 mx-auto mb-3" />
                      </div>
                      <h3 className="text-lg font-medium text-white/60 mb-2">More Partners Coming Soon</h3>
                      <p className="text-sm text-white/40">
                        We're actively building partnerships to expand our ecosystem
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Partnership Benefits */}
              <Card className="bg-black/40 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Partnership Benefits</CardTitle>
                  <CardDescription className="text-white/60">What our partners bring to the ecosystem</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-white font-medium">Technical Expertise</h4>
                        <p className="text-sm text-white/60">Advanced development and blockchain integration</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-white font-medium">Ecosystem Growth</h4>
                        <p className="text-sm text-white/60">Expanding reach and user adoption</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-white font-medium">Innovation</h4>
                        <p className="text-sm text-white/60">Bringing new features and capabilities</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}

export default function WorldcoinApp() {
  const [isConnected, setIsConnected] = useState(false)

  return (
    <MiniKitProvider>
      {!isConnected ? (
        <LandingScreen onConnect={() => setIsConnected(true)} />
      ) : (
        <MainApp onDisconnect={() => setIsConnected(false)} />
      )}
    </MiniKitProvider>
  )
}
