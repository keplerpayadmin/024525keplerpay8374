"use client"

import type React from "react"

import { useWallet } from "@keplr-wallet/react"
import { useState } from "react"

interface WalletAuthInput {
  chainId: string
  statement: string
  signAlgo?: string
}

interface ConnectButtonProps {
  chainId: string
}

const ConnectButton: React.FC<ConnectButtonProps> = ({ chainId }) => {
  const { connect, disconnect, connected, address } = useWallet(chainId)
  const [signing, setSigning] = useState(false)

  const walletAuthInput: WalletAuthInput = {
    chainId: chainId,
    statement: "Connect your wallet to KeplerPay to access the token ecosystem on Worldchain.",
  }

  const handleConnect = async () => {
    setSigning(true)
    try {
      await connect(walletAuthInput)
    } catch (error) {
      console.error("Connection error:", error)
    } finally {
      setSigning(false)
    }
  }

  const handleDisconnect = () => {
    disconnect()
  }

  return (
    <div>
      {connected ? (
        <div>
          <p>Connected with address: {address}</p>
          <button onClick={handleDisconnect}>Disconnect</button>
        </div>
      ) : (
        <button onClick={handleConnect} disabled={signing}>
          {signing ? "Connecting..." : "Connect Wallet"}
        </button>
      )}
    </div>
  )
}

export default ConnectButton
