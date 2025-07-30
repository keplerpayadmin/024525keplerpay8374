export interface Transaction {
  id: string
  hash: string
  type: "send" | "receive" | "claim" // Adicione 'claim' se necessário
  amount: string
  tokenSymbol: string
  tokenAddress: string
  from: string
  to: string
  timestamp: Date
  status: "pending" | "completed" | "failed"
  blockNumber: number
}
