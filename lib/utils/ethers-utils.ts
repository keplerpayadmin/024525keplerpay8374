import { ethers } from "ethers"
import { RPC_ENDPOINTS } from "@/lib/airdropContractABI" // Assuming this is the source of RPCs

/**
 * Tries to connect to a Worldchain RPC endpoint from a predefined list.
 * @returns A connected ethers.JsonRpcProvider instance.
 * @throws Error if unable to connect to any RPC endpoint.
 */
export async function getRobustProvider() {
  for (const rpcUrl of RPC_ENDPOINTS) {
    try {
      console.log(`Attempting to connect to RPC: ${rpcUrl}`)
      const provider = new ethers.JsonRpcProvider(rpcUrl, { name: "worldchain", chainId: 10001 })
      // Test connection by getting block number
      await provider.getBlockNumber()
      console.log(`Successfully connected to RPC: ${rpcUrl}`)
      return provider
    } catch (error) {
      console.warn(`Failed to connect to RPC ${rpcUrl}:`, error)
    }
  }
  throw new Error("Failed to connect to any RPC endpoint for Worldchain.")
}
