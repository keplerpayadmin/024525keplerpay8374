import { ethers } from "ethers"

interface Transaction {
  id: string
  hash: string
  type: "send" | "receive"
  amount: string
  tokenSymbol: string
  tokenAddress: string
  timestamp: Date
  from: string
  to: string
  blockNumber: number
}

// Token contracts que queremos monitorar
const MONITORED_TOKENS = {
  KPP: {
    address: "0x5fa570E9c8514cdFaD81DB6ce0A327D55251fBD4",
    symbol: "KPP",
    decimals: 18,
  },
  TPF: {
    address: "0x834a73c0a83F3BCe349A116FFB2A4c2d1C651E45",
    symbol: "TPF",
    decimals: 18,
  },
  WDD: {
    address: "0xEdE54d9c024ee80C85ec0a75eD2d8774c7Fbac9B",
    symbol: "WDD",
    decimals: 18,
  },
  USDC: {
    address: "0x79A02482A880bCE3F13e09Da970dC34db4CD24d1",
    symbol: "USDC",
    decimals: 6,
  },
  WLD: {
    address: "0x2cFc85d8E48F8EAB294be644d9E25C3030863003",
    symbol: "WLD",
    decimals: 18,
  },
}

// ERC20 Transfer event signature
const TRANSFER_EVENT_SIGNATURE = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"

class BlockchainTransactionService {
  private provider: ethers.JsonRpcProvider
  private cache: Map<string, Transaction[]> = new Map()
  private cacheTimestamp: Map<string, number> = new Map()
  private readonly CACHE_DURATION = 30000 // 30 segundos

  constructor() {
    this.provider = new ethers.JsonRpcProvider(
      "https://worldchain-mainnet.g.alchemy.com/public",
      { chainId: 480, name: "worldchain" },
      { staticNetwork: true },
    )
  }

  private getCacheKey(walletAddress: string): string {
    return walletAddress.toLowerCase()
  }

  private isCacheValid(walletAddress: string): boolean {
    const cacheKey = this.getCacheKey(walletAddress)
    const timestamp = this.cacheTimestamp.get(cacheKey)
    if (!timestamp) return false
    return Date.now() - timestamp < this.CACHE_DURATION
  }

  clearCache(): void {
    this.cache.clear()
    this.cacheTimestamp.clear()
    console.log("🧹 Blockchain transaction cache cleared")
  }

  private findTokenByAddress(address: string): { symbol: string; decimals: number } | null {
    const token = Object.values(MONITORED_TOKENS).find((t) => t.address.toLowerCase() === address.toLowerCase())
    return token ? { symbol: token.symbol, decimals: token.decimals } : null
  }

  private async fetchTransactionsFromBlockchain(walletAddress: string): Promise<Transaction[]> {
    try {
      console.log(`🔍 Buscando transações REAIS da blockchain para ${walletAddress}`)

      // Buscar o bloco atual
      const currentBlock = await this.provider.getBlockNumber()
      const fromBlock = Math.max(0, currentBlock - 100000) // Últimos 100k blocos

      console.log(`📊 Buscando de bloco ${fromBlock} até ${currentBlock}`)

      const allTransactions: Transaction[] = []

      // Buscar logs de Transfer para cada token monitorado
      for (const [tokenKey, tokenInfo] of Object.entries(MONITORED_TOKENS)) {
        try {
          console.log(`🔎 Buscando transações de ${tokenInfo.symbol} (${tokenInfo.address})`)

          // Buscar transfers onde o wallet é o destinatário (receive)
          const receiveLogs = await this.provider.getLogs({
            address: tokenInfo.address,
            topics: [
              TRANSFER_EVENT_SIGNATURE,
              null, // from (qualquer endereço)
              ethers.zeroPadValue(walletAddress, 32), // to (nosso wallet)
            ],
            fromBlock,
            toBlock: currentBlock,
          })

          // Buscar transfers onde o wallet é o remetente (send)
          const sendLogs = await this.provider.getLogs({
            address: tokenInfo.address,
            topics: [
              TRANSFER_EVENT_SIGNATURE,
              ethers.zeroPadValue(walletAddress, 32), // from (nosso wallet)
              null, // to (qualquer endereço)
            ],
            fromBlock,
            toBlock: currentBlock,
          })

          console.log(`📨 ${tokenInfo.symbol}: ${receiveLogs.length} receives, ${sendLogs.length} sends`)

          // Processar logs de receive
          for (const log of receiveLogs) {
            try {
              const block = await this.provider.getBlock(log.blockNumber)
              if (!block) continue

              const amount = ethers.formatUnits(log.data, tokenInfo.decimals)
              const fromAddress = ethers.getAddress("0x" + log.topics[1].slice(26))

              allTransactions.push({
                id: `${log.transactionHash}-${log.logIndex}`,
                hash: log.transactionHash,
                type: "receive",
                amount,
                tokenSymbol: tokenInfo.symbol,
                tokenAddress: tokenInfo.address,
                timestamp: new Date(block.timestamp * 1000),
                from: fromAddress,
                to: walletAddress,
                blockNumber: log.blockNumber,
              })
            } catch (error) {
              console.error(`❌ Erro ao processar log de receive ${tokenInfo.symbol}:`, error)
            }
          }

          // Processar logs de send
          for (const log of sendLogs) {
            try {
              const block = await this.provider.getBlock(log.blockNumber)
              if (!block) continue

              const amount = ethers.formatUnits(log.data, tokenInfo.decimals)
              const toAddress = ethers.getAddress("0x" + log.topics[2].slice(26))

              allTransactions.push({
                id: `${log.transactionHash}-${log.logIndex}`,
                hash: log.transactionHash,
                type: "send",
                amount,
                tokenSymbol: tokenInfo.symbol,
                tokenAddress: tokenInfo.address,
                timestamp: new Date(block.timestamp * 1000),
                from: walletAddress,
                to: toAddress,
                blockNumber: log.blockNumber,
              })
            } catch (error) {
              console.error(`❌ Erro ao processar log de send ${tokenInfo.symbol}:`, error)
            }
          }
        } catch (error) {
          console.error(`❌ Erro ao buscar transações de ${tokenInfo.symbol}:`, error)
        }
      }

      // Ordenar por timestamp (mais recentes primeiro)
      allTransactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

      console.log(`✅ Total de ${allTransactions.length} transações REAIS encontradas`)

      // Atualizar cache
      const cacheKey = this.getCacheKey(walletAddress)
      this.cache.set(cacheKey, allTransactions)
      this.cacheTimestamp.set(cacheKey, Date.now())

      return allTransactions
    } catch (error) {
      console.error("❌ Erro ao buscar transações da blockchain:", error)
      return []
    }
  }

  async getTransactionHistory(walletAddress: string, limit = 5, offset = 0): Promise<Transaction[]> {
    try {
      const cacheKey = this.getCacheKey(walletAddress)
      let transactions: Transaction[]

      // Verificar cache
      if (this.isCacheValid(walletAddress) && this.cache.has(cacheKey)) {
        console.log("📋 Usando transações do cache")
        transactions = this.cache.get(cacheKey)!
      } else {
        console.log("🔄 Cache expirado ou inexistente, buscando da blockchain...")
        transactions = await this.fetchTransactionsFromBlockchain(walletAddress)
      }

      // Aplicar paginação
      const paginatedTransactions = transactions.slice(offset, offset + limit)

      console.log(`📄 Retornando ${paginatedTransactions.length} transações (offset: ${offset}, limit: ${limit})`)

      return paginatedTransactions
    } catch (error) {
      console.error("❌ Erro no getTransactionHistory:", error)
      return []
    }
  }
}

export const blockchainTransactionService = new BlockchainTransactionService()
