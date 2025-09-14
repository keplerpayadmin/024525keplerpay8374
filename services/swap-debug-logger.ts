type LogLevel = "info" | "warn" | "error"
export type SwapLog = {
  id: string
  ts: number
  level: LogLevel
  tag: string
  message: string
  data?: unknown
}

type Listener = (logs: SwapLog[]) => void

class SwapDebugLogger {
  private logs: SwapLog[] = []
  private listeners: Set<Listener> = new Set()
  private max = 500 // Aumentado para mais logs

  private push(level: LogLevel, tag: string, message: string, data?: unknown) {
    const entry: SwapLog = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      ts: Date.now(),
      level,
      tag,
      message,
      data,
    }
    this.logs.push(entry)
    if (this.logs.length > this.max) this.logs = this.logs.slice(-this.max)
    this.emit()

    // Log detalhado no console do browser
    const stamp = new Date(entry.ts).toLocaleTimeString()
    const dataStr = data ? `\n${JSON.stringify(data, null, 2)}` : ""

    if (level === "error") {
      console.group(`🔴 [SWAP ${stamp}] [${tag}] ${message}`)
      if (data) console.error("Data:", data)
      console.groupEnd()
    } else if (level === "warn") {
      console.group(`🟡 [SWAP ${stamp}] [${tag}] ${message}`)
      if (data) console.warn("Data:", data)
      console.groupEnd()
    } else {
      console.group(`🔵 [SWAP ${stamp}] [${tag}] ${message}`)
      if (data) console.log("Data:", data)
      console.groupEnd()
    }
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener)
    // envio inicial
    listener([...this.logs])
    return () => this.listeners.delete(listener)
  }

  clear() {
    this.logs = []
    this.emit()
    console.clear()
    console.log("🧹 Swap debug logs cleared")
  }

  getAll() {
    return [...this.logs]
  }

  private emit() {
    const snapshot = [...this.logs]
    this.listeners.forEach((l) => l(snapshot))
  }

  info(tag: string, message: string, data?: unknown) {
    this.push("info", tag, message, data)
  }

  warn(tag: string, message: string, data?: unknown) {
    this.push("warn", tag, message, data)
  }

  error(tag: string, message: string, data?: unknown) {
    this.push("error", tag, message, data)
  }

  // Métodos de conveniência para logs específicos do swap
  quoteRequest(fromToken: string, toToken: string, amount: string, data?: unknown) {
    this.info("QUOTE_REQUEST", `Requesting quote: ${amount} ${fromToken} → ${toToken}`, data)
  }

  quoteSuccess(amountOut: string, priceImpact: string, data?: unknown) {
    this.info("QUOTE_SUCCESS", `Quote received: ${amountOut} (${priceImpact}% impact)`, data)
  }

  quoteFailed(error: string, data?: unknown) {
    this.warn("QUOTE_FAILED", `Quote failed: ${error}`, data)
  }

  swapSubmit(fromToken: string, toToken: string, amount: string, data?: unknown) {
    this.info("SWAP_SUBMIT", `Submitting swap: ${amount} ${fromToken} → ${toToken}`, data)
  }

  swapSuccess(txId: string, data?: unknown) {
    this.info("SWAP_SUCCESS", `Swap successful: ${txId}`, data)
  }

  swapFailed(error: string, data?: unknown) {
    this.error("SWAP_FAILED", `Swap failed: ${error}`, data)
  }

  balanceCheck(token: string, available: string, required: string, hasBalance: boolean) {
    const level = hasBalance ? "info" : "warn"
    this.push(level, "BALANCE_CHECK", `${token}: ${available} available, ${required} required`, {
      token,
      available,
      required,
      hasBalance,
      sufficient: hasBalance,
    })
  }

  tokenInfo(token: string, data: unknown) {
    this.info("TOKEN_INFO", `Token details: ${token}`, data)
  }

  transactionPrepared(to: string, value: string, data?: unknown) {
    this.info("TX_PREPARED", `Transaction prepared to ${to} with value ${value}`, data)
  }
}

export const swapLogger = new SwapDebugLogger()
