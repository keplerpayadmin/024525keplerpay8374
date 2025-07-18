// Definir o tipo Transaction (se ainda não existir)
export type Transaction = {
  id: string
  hash: string
  type: "send" | "receive"
  amount: string
  tokenSymbol: string
  tokenAddress: string
  from: string
  to: string
  timestamp: Date
  status: string
  blockNumber: number
}
