"use client"

import { useState, useEffect } from "react"

// Tipos para internacionalização
export type Language = "en"

export interface AirdropTranslations {
  title?: string
  subtitle?: string
  contractBalance?: string
  dailyAirdrop?: string
  nextClaimIn?: string
  claimButton?: string
  processing?: string
  tokensClaimedSuccess?: string
  availableForAirdrop?: string
}

export interface HistoryTranslations {
  title?: string
  all?: string
  loading?: string
  loadMore?: string
  noTransactions?: string
  showAllTransactions?: string
  received?: string
  sent?: string
  from?: string
  to?: string
  block?: string
  txHash?: string
  today?: string
  yesterday?: string
}

export interface NavTranslations {
  home?: string
  wallet?: string
  learn?: string
  profile?: string
  news?: string
  agenda?: string
  winners?: string
  games?: string
  storm?: string
  about?: string
  finances?: string
  partnerships?: string
  membership?: string
  menu?: string
  close?: string
}

export interface GamesTranslations {
  title?: string
  subtitle?: string
  allGames?: string
  action?: string
  adventure?: string
  strategy?: string
  puzzle?: string
  rpg?: string
  comingSoon?: string
  enterNow?: string
  moreGames?: string
  featuredGame?: string
  back?: string
  start?: string
  score?: string
  round?: string
  lives?: string
  shots?: string
  gameOver?: string
  playAgain?: string
  loading?: string
  developed?: string
}

export interface WalletTranslations {
  title?: string
  balance?: string
  send?: string
  receive?: string
  swap?: string
  otherTokens?: string
  errorMessage?: string
  address?: string
  assets?: string
  activity?: string
  copyAddress?: string
  addressCopied?: string
  refreshBalances?: string
  balancesUpdated?: string
  errorUpdatingBalances?: string
}

export interface SwapTranslations {
  title?: string
  subtitle?: string
  from?: string
  to?: string
  amount?: string
  estimatedOutput?: string
  slippage?: string
  slippageTooltip?: string
  swapButton?: string
  processing?: string
  success?: string
  error?: string
  insufficientBalance?: string
  selectToken?: string
  enterAmount?: string
  gettingQuote?: string
  noQuoteAvailable?: string
  swapTokens?: string
  maxSlippage?: string
  priceImpact?: string
  minimumReceived?: string
  networkFee?: string
  route?: string
}

export interface WinnersTranslations {
  title?: string
  subtitle?: string
  noWinners?: string
  noWinnersDesc?: string
}

export interface AgendaTranslations {
  title?: string
  subtitle?: string
  today?: string
  event?: string
  noEvents?: string
  howToParticipate?: string
  incentivePeriod?: string
  eventsAndActivities?: string
  online?: string
  participants?: string
  days?: string[]
  months?: string[]
  eventTypes?: {
    airdrop?: string
    community?: string
    competition?: string
    education?: string
  }
  events?: {
    topHoldersIncentive?: {
      title?: string
      description?: string
      howToParticipate?: string[]
    }
  }
}

export interface FurnaceTranslations {
  title?: string
  subtitle?: string
  totalBurned?: string
  amountToBurn?: string
  startBurn?: string
  openFurnace?: string
  burning?: string
  burnCompleted?: string
  instructions?: string
  furnaceInfo?: string
  deflation?: string
  lastTransaction?: string
}

export interface LearnTranslations {
  title?: string
  search?: string
  searchTerms?: string
  searchInGlossary?: string
  didYouKnow?: string
  bitcoinPizza?: string
  tokenomics?: string
  tokenomicsDesc?: string
  glossary?: string
  glossaryDesc?: string
  glossaryTitle?: string
  tokenomicsTitle?: string
  tokenomicsIntro?: string
  supplyDistribution?: string
  supplyDistributionDesc?: string
  tokenUtility?: string
  tokenUtilityDesc?: string
  valueMechanisms?: string
  valueMechanismsDesc?: string
  kppTokenomics?: string
  totalSupply?: string
  liquidity?: string
  staking?: string
  team?: string
  marketing?: string
  reserve?: string
  tradingSimulator?: string
}

export interface AboutTranslations {
  title?: string
  subtitle?: string
  about?: string
  roadmap?: string
  tokenomics?: string
  whyChoose?: string
  airdrops?: string
  community?: string
  utility?: string
  longTerm?: string
  growthStrategy?: string
  marketing?: string
  incentives?: string
  governance?: string
  phase1?: string
  phase1Completed?: string
  phase2?: string
  phase2Development?: string
  phase3?: string
  phase3Future?: string
  tokenLaunch?: string
  websiteDocs?: string
  communityGrowth?: string
  miniApp?: string
  airdropCampaigns?: string
  fiGames?: string
  fiStaking?: string
  pulseGame?: string
  fiPay?: string
  enhancedSecurity?: string
  exchangeListings?: string
  ecosystem?: string
  partnerships?: string
  mobileApp?: string
  tokenDetails?: string
  holderBenefits?: string
  buyKPP?: string
}

export interface SendTokenTranslations {
  title?: string
  subtitle?: string
  address?: string
  amount?: string
  selectToken?: string
  send?: string
  processing?: string
  addressRequired?: string
  invalidAmount?: string
  error?: string
  transactionSuccess?: string
  transactionFailed?: string
  sentTo?: string
  viewTx?: string
  minikitNotInstalled?: string
  tokenNotSupported?: string
  warning?: string
  warningWorldchain?: string
  hideWarning?: string
  transactionPending?: string
}

export interface ConnectButtonTranslations {
  connect?: string
  connecting?: string
  connected?: string
  installMiniKit?: string
  errorConnecting?: string
}

export interface StormTranslations {
  title?: string
  subtitle?: string
  placeholder?: string
  publish?: string
  connectWallet?: string
  wordPublished?: string
  enterWord?: string
  publishing?: string
}

export interface ProfileTranslations {
  inviteBanner?: string
  shareButton?: string
  profile?: string
  logOut?: string
  shareWithFriends?: string
  followUs?: string
  notConnected?: string
}

export interface DailyCheckInTranslations {
  title?: string
  subtitle?: string
  checkInButton?: string
  alreadyCheckedIn?: string
  points?: string
  totalPoints?: string
  streak?: string
  days?: string
  checkInSuccess?: string
  history?: string
  showHistory?: string
  hideHistory?: string
  noHistory?: string
  today?: string
  yesterday?: string
  daysAgo?: string
  consecutiveDays?: string
  nextCheckIn?: string
  hours?: string
  minutes?: string
  seconds?: string
  availableNow?: string
}

export interface FinancesTranslations {
  title?: string
  subtitle?: string
  transparencyMessage?: string
  incentivesReceived?: string
  transactionFees?: string
  tradingRevenue?: string
  projectExpenses?: string
  lastUpdated?: string
  overview?: string
  revenue?: string
  expenses?: string
  netBalance?: string
  financialChart?: string
  revenueBreakdown?: string
  expenseBreakdown?: string
  noData?: string
  totalRevenue?: string
  totalExpenses?: string
}

export interface PartnershipsTranslations {
  title?: string
  subtitle?: string
  ourPartners?: string
  holdstationTitle?: string
  holdstationDescription?: string
  visitApp?: string
  poweredBy?: string
  swapIntegration?: string
  swapDescription?: string
  morePartnerships?: string
  comingSoon?: string
}

export interface LevelTranslations {
  title?: string
  multiplier?: string
  progress?: string
  toNextLevel?: string
  xpSources?: string
  dailyCheckIn?: string
  checkInXP?: string
  kppHolding?: string
  currentBalance?: string
  totalXP?: string
  levelBenefits?: string
  eventRewards?: string
  level?: string
  viewDetails?: string
}

export interface EventsTranslations {
  topHoldersEvent?: {
    title?: string
    description?: string
    remaining?: string
  }
  snakeTournament?: {
    registrationTitle?: string
    registrationDescription?: string
    tournamentTitle?: string
    tournamentDescription?: string
    instructions?: string
    rules?: {
      rule1?: string
      rule2?: string
      rule3?: string
      rule4?: string
      rule5?: string
    }
    registrationAddress?: string
    copyAddress?: string
    addressCopied?: string
    email?: string
    remaining?: string
    phase?: string
    registration?: string
    tournament?: string
  }
}

export interface MembershipTranslations {
  title?: string
  subtitle?: string
  readyQuestion?: string
  whatWeOffer?: string
  benefitDescription?: string
  benefitNote?: string
  price?: string
  priceForever?: string
  priceExplanation?: string
  becomeButton?: string
  processing?: string
  paymentInfo?: string
  destinationWallet?: string
  afterPayment?: string
  contactSupport?: string
  tip?: string
  tipDescription?: string
}

export interface Translations {
  airdrop?: AirdropTranslations
  history?: HistoryTranslations
  nav?: NavTranslations
  games?: GamesTranslations
  wallet?: WalletTranslations
  swap?: SwapTranslations
  winners?: WinnersTranslations
  agenda?: AgendaTranslations
  furnace?: FurnaceTranslations
  learn?: LearnTranslations
  about?: AboutTranslations
  sendToken?: SendTokenTranslations
  connectButton?: ConnectButtonTranslations
  storm?: StormTranslations
  profile?: ProfileTranslations
  dailyCheckIn?: DailyCheckInTranslations
  finances?: FinancesTranslations
  partnerships?: PartnershipsTranslations
  level?: LevelTranslations
  events?: EventsTranslations
  membership?: MembershipTranslations
}

// Função para obter o idioma atual do navegador ou o padrão (inglês)
export function getCurrentLanguage(): Language {
  // Sempre retorna "en" conforme solicitado
  return "en"
}

// Função para definir o idioma atual
export function setCurrentLanguage(lang: Language): void {
  // Não faz nada, pois o idioma é fixo em "en"
  if (typeof window === "undefined") return
  localStorage.setItem("tpf_language", lang) // Mantém para compatibilidade, mas não afeta o idioma
  const event = new Event("languageChange")
  window.dispatchEvent(event)
}

// Função para obter as traduções para um idioma específico
export function getTranslations(lang: Language): Translations {
  // Retorna apenas as traduções em inglês
  return {
    airdrop: {
      title: "KPP Airdrop",
      subtitle: "Claim your free KPP tokens!",
      contractBalance: "Contract balance:",
      dailyAirdrop: "Daily airdrop:",
      nextClaimIn: "Next claim in:",
      claimButton: "Claim KPP",
      processing: "Processing...",
      tokensClaimedSuccess: "KPP tokens claimed successfully!",
      availableForAirdrop: "Available for Airdrop:",
    },
    history: {
      title: "Transaction History",
      all: "All",
      loading: "Loading...",
      loadMore: "Load more",
      noTransactions: "No transactions found",
      showAllTransactions: "Show all transactions",
      received: "Received",
      sent: "Sent",
      from: "From",
      to: "To",
      block: "Block",
      txHash: "Transaction Hash",
      today: "Today",
      yesterday: "Yesterday",
    },
    nav: {
      home: "Home",
      wallet: "Wallet",
      learn: "Learn",
      profile: "Profile",
      news: "News",
      agenda: "Agenda",
      winners: "Winners",
      games: "Games",
      storm: "Storm",
      about: "About",
      finances: "Finances",
      partnerships: "Partnerships",
      membership: "Membership",
      menu: "Close",
      close: "Close",
    },
    games: {
      title: "FiGames",
      subtitle: "Play and earn KPP",
      allGames: "All",
      action: "Action",
      adventure: "Adventure",
      strategy: "Strategy",
      puzzle: "Puzzle",
      rpg: "RPG",
      comingSoon: "Coming Soon",
      enterNow: "Enter Now",
      moreGames: "More games coming soon",
      featuredGame: "Featured Game",
      back: "Back",
      start: "Start Game",
      score: "Score",
      round: "Round",
      lives: "Lives",
      shots: "Shots",
      gameOver: "Game Over",
      playAgain: "Play Again",
      loading: "Loading",
      developed: "Developed by KeplerPay",
    },
    wallet: {
      title: "Wallet",
      balance: "KPP Balance",
      send: "Send",
      receive: "Receive",
      swap: "Swap",
      otherTokens: "Other Tokens",
      errorMessage: "Could not get real balance. Try setting it manually.",
      address: "Address",
      assets: "Assets",
      activity: "Activity",
      copyAddress: "Copy address",
      addressCopied: "Address copied!",
      refreshBalances: "Refresh balances",
      balancesUpdated: "Balances updated!",
      errorUpdatingBalances: "Error updating balances",
    },
    swap: {
      title: "Swap Tokens",
      subtitle: "Swap tokens quickly and securely",
      from: "From",
      to: "To",
      amount: "Amount",
      estimatedOutput: "Estimated output",
      slippage: "Slippage",
      slippageTooltip: "Maximum price variation tolerance",
      swapButton: "Swap",
      processing: "Processing...",
      success: "Swap completed successfully!",
      error: "Error performing swap",
      insufficientBalance: "Insufficient balance",
      selectToken: "Select token",
      enterAmount: "Enter amount",
      gettingQuote: "Getting quote...",
      noQuoteAvailable: "Quote not available",
      swapTokens: "Swap tokens",
      maxSlippage: "Max slippage",
      priceImpact: "Price impact",
      minimumReceived: "Minimum received",
      networkFee: "Network fee",
      route: "Route",
    },
    winners: {
      title: "Winners",
      subtitle: "Participants rewarded in our events",
      noWinners: "No winners yet",
      noWinnersDesc: "Winners of our events will be displayed here. Stay tuned for upcoming events to participate!",
    },
    agenda: {
      title: "Agenda",
      subtitle: "Events and community activities",
      today: "Today",
      event: "Event",
      noEvents: "No events for this date",
      howToParticipate: "How to participate:",
      incentivePeriod: "Incentive Period",
      eventsAndActivities: "Events and community activities",
      online: "Online",
      participants: "participants",
      days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      eventTypes: {
        airdrop: "Airdrop",
        community: "Community",
        competition: "Competition",
        education: "Education",
      },
      events: {
        topHoldersIncentive: {
          title: "10% Incentive for Top 10 KPP Holders",
          description:
            "Earn 10% bonus tokens if you are among the top 10 KPP holders during the event period. Example: 10M KPP = 1M bonus tokens",
          howToParticipate: [
            "Buy and hold KPP tokens",
            "Reach a position among the top 10 holders",
            "Maintain the position until June 9th",
          ],
        },
      },
    },
    furnace: {
      title: "Furnace",
      subtitle: "Burn KPP tokens and contribute to token stability",
      totalBurned: "Total burned",
      amountToBurn: "Amount of KPP to burn",
      startBurn: "Start Burn",
      openFurnace: "Open the Furnace",
      burning: "Burning...",
      burnCompleted: "Burn Completed!",
      instructions: "Click the button to open the furnace",
      furnaceInfo: "Furnace Information",
      deflation:
        "Deflation: Each burned token is sent to a dead wallet (0x000...dEaD) and permanently removed from circulation.",
      lastTransaction: "Last Transaction",
    },
    learn: {
      title: "Learn",
      search: "Search content...",
      searchTerms: "Search terms...",
      searchInGlossary: "Search in Glossary",
      didYouKnow: "Did you know?",
      bitcoinPizza:
        "On May 22, 2010, Laszlo Hanyecz made the first Bitcoin purchase: two pizzas for 10,000 BTC. Today, that amount would be worth millions of dollars!",
      tokenomics: "Tokenomics",
      tokenomicsDesc: "Understand token economics and how it affects the value and utility of crypto projects.",
      glossary: "Crypto Glossary",
      glossaryDesc: "Complete guide to terms and concepts from the cryptocurrency world for beginners and experts.",
      glossaryTitle: "Crypto Glossary",
      tokenomicsTitle: "Tokenomics",
      tokenomicsIntro:
        "Tokenomics refers to the economics of cryptocurrency tokens. Understanding a project's tokenomics is essential for evaluating its value and long-term potential.",
      supplyDistribution: "Supply and Distribution",
      supplyDistributionDesc:
        "The total, circulating, and maximum supply of tokens, as well as their distribution among team, investors, and community.",
      tokenUtility: "Token Utility",
      tokenUtilityDesc: "How the token is used within the ecosystem and what benefits it offers to holders.",
      valueMechanisms: "Value Mechanisms",
      valueMechanismsDesc: "Token burning, staking, governance, and other mechanisms that affect the token's value.",
      kppTokenomics: "KPP Tokenomics",
      totalSupply: "Total Supply:",
      liquidity: "Liquidity:",
      staking: "Staking:",
      team: "Team:",
      marketing: "Marketing:",
      reserve: "Reserve:",
      tradingSimulator: "Trading Simulator",
    },
    about: {
      title: "About Us",
      subtitle: "Learn about the KeplerPay project",
      about: "About",
      roadmap: "Roadmap",
      tokenomics: "Tokenomics",
      whyChoose: "Why choose KeplerPay?",
      airdrops: "Daily Airdrops",
      community: "Active Community",
      utility: "Utility",
      longTerm: "Long-Term Vision",
      growthStrategy: "Growth Strategy",
      marketing: "Marketing",
      incentives: "Incentives",
      governance: "Governance",
      phase1: "Phase 1",
      phase1Completed: "Completed",
      phase2: "Phase 2",
      phase2Development: "In Development",
      phase3: "Phase 3",
      phase3Future: "Future Goals",
      tokenLaunch: "Token Launch",
      websiteDocs: "Website and Documentation",
      communityGrowth: "Community Growth",
      miniApp: "Mini-App (Worldcoin AppStore)",
      airdropCampaigns: "Airdrop Campaigns",
      fiGames: "Fi Games",
      fiStaking: "FiStaking (12% APY)",
      pulseGame: "Pulse Game",
      fiPay: "FiPay",
      enhancedSecurity: "Enhanced Security",
      exchangeListings: "Exchange Listings",
      ecosystem: "KeplerPay Ecosystem Expansion",
      partnerships: "Partnerships",
      mobileApp: "Mobile App",
      tokenDetails: "Token Details",
      holderBenefits: "Holder Benefits",
      buyKPP: "Buy KPP",
    },
    sendToken: {
      title: "Send Tokens",
      subtitle: "Send tokens to another address",
      address: "Address",
      amount: "Amount",
      selectToken: "Select Token",
      send: "Send",
      processing: "Processing...",
      addressRequired: "Address is required",
      invalidAmount: "Invalid amount",
      error: "Error sending tokens. Please try again.",
      transactionSuccess: "Transaction sent successfully!",
      transactionFailed: "Transaction failed",
      sentTo: "sent to",
      viewTx: "View TX",
      minikitNotInstalled: "MiniKit is not installed",
      tokenNotSupported: "Token not supported",
      warning: "Please verify the recipient address before sending tokens.",
      warningWorldchain:
        "Do not send to wallets that don't support Worldchain, otherwise you may lose your assets. Do not send to exchanges.",
      hideWarning: "Hide warning",
      transactionPending: "Transaction pending. Please wait...",
    },
    connectButton: {
      connect: "Connect Wallet",
      connecting: "Connecting...",
      connected: "Connected",
      installMiniKit: "Please install the Worldcoin App to connect your wallet",
      errorConnecting: "Error connecting wallet. Please try again.",
    },
    storm: {
      title: "Storm",
      subtitle: "Publish words that appear on screen for a few seconds",
      placeholder: "Type a word...",
      publish: "Publish",
      connectWallet: "Connect your wallet to participate",
      wordPublished: "Word published!",
      enterWord: "Enter a word",
      publishing: "Publishing...",
    },
    profile: {
      inviteBanner: "Invite friends and family to try our app",
      shareButton: "Share",
      profile: "Profile",
      logOut: "Log out",
      shareWithFriends: "Share with friends and family",
      followUs: "Follow us",
      notConnected: "Not connected",
    },
    dailyCheckIn: {
      title: "Daily Check-in",
      subtitle: "Earn 1 point per day",
      checkInButton: "Check In",
      alreadyCheckedIn: "Already checked in today!",
      points: "points",
      totalPoints: "Total points",
      streak: "Streak",
      days: "days",
      checkInSuccess: "Check-in completed! +1 point",
      history: "History",
      showHistory: "Show history",
      hideHistory: "Hide history",
      noHistory: "No check-ins yet",
      today: "Today",
      yesterday: "Yesterday",
      daysAgo: "days ago",
      consecutiveDays: "consecutive days",
      nextCheckIn: "Next Check-in in:",
      hours: "h",
      minutes: "m",
      seconds: "s",
      availableNow: "Available now!",
    },
    finances: {
      title: "Finances",
      subtitle: "Project financial transparency",
      transparencyMessage:
        "As our priority is transparency, we seek to align this principle with our users and investors",
      incentivesReceived: "Incentives received for project progression",
      transactionFees: "Revenue obtained from transaction fees",
      tradingRevenue: "Revenue obtained by our Trading team",
      projectExpenses: "Project expenses",
      lastUpdated: "Last updated",
      overview: "Overview",
      revenue: "Revenue",
      expenses: "Expenses",
      netBalance: "Net Balance",
      financialChart: "Financial Chart",
      revenueBreakdown: "Revenue Breakdown",
      expenseBreakdown: "Expense Breakdown",
      noData: "No data available",
      totalRevenue: "Total Revenue",
      totalExpenses: "Total Expenses",
    },
    partnerships: {
      title: "Partnerships",
      subtitle: "Our strategic partners",
      ourPartners: "Our Partners",
      holdstationTitle: "HoldStation",
      holdstationDescription: "Advanced trading and swap platform for WorldChain",
      visitApp: "Visit App",
      poweredBy: "Powered by",
      swapIntegration: "Swap Integration",
      swapDescription: "Swap functionality integrated through HoldStation API",
      morePartnerships: "More Partnerships",
      comingSoon: "Coming soon...",
    },
    level: {
      title: "Level",
      multiplier: "Multiplier",
      progress: "Progress",
      toNextLevel: "to next level",
      xpSources: "XP Sources",
      dailyCheckIn: "Daily Check-in",
      checkInXP: "Check-in XP",
      kppHolding: "KPP Holding",
      currentBalance: "Current balance",
      totalXP: "Total XP",
      levelBenefits: "Level Benefits",
      eventRewards: "event rewards multiplier",
      level: "Level",
      viewDetails: "View details",
    },
    events: {
      topHoldersEvent: {
        title: "Top 10 Event",
        description: "10% Bonus for Top Holders",
        remaining: "remaining",
      },
      snakeTournament: {
        registrationTitle: "Tournament Registration",
        registrationDescription: "Send 200,000 KPP to register for the tournament",
        tournamentTitle: "Snake Game Tournament",
        tournamentDescription: "Get the highest score in the snake game to win the grand prize",
        instructions: "Instructions:",
        rules: {
          rule1: "The player who achieves the highest score in the snake game wins the grand prize",
          rule2: "Screenshot of your score must be sent to support@keplerpay.com by the last day of the tournament",
          rule3: "In case of a tie with any other player, the prize will be divided",
          rule4: "The prize will be announced in the last week of the event",
          rule5: "You can only send one screenshot to the email, more than one will be disregarded, so send carefully",
        },
        registrationAddress: "Registration address:",
        copyAddress: "Copy address",
        addressCopied: "Address copied!",
        email: "Email for score submission:",
        remaining: "remaining",
        phase: "Phase",
        registration: "Registration",
        tournament: "Tournament",
      },
    },
    membership: {
      title: "KeplerPay Membership",
      subtitle: "Premium Membership",
      readyQuestion: "Are you ready to become a true KeplerPay membership?",
      whatWeOffer: "What do we have to offer?",
      benefitDescription: "Part of KPP transaction fees goes to our members on the 9th of every month!",
      benefitNote: "And it's not that little!",
      price: "20 WLD",
      priceForever: "forever!",
      priceExplanation: "That means you pay 20 WLD and get the fees forever!",
      becomeButton: "Become Membership",
      processing: "Processing...",
      paymentInfo: "Payment Information",
      destinationWallet: "Destination Wallet:",
      afterPayment: "After Payment",
      contactSupport: "After payment, contact the support team with the screenshot to:",
      tip: "Tip:",
      tipDescription: "Include the transaction screenshot and your wallet address in the email.",
    },
  }
}

// Hook para usar traduções em componentes
export function useTranslation() {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    setLanguage(getCurrentLanguage())

    const handleLanguageChange = () => {
      setLanguage(getCurrentLanguage())
    }

    window.addEventListener("languageChange", handleLanguageChange)
    return () => window.removeEventListener("languageChange", handleLanguageChange)
  }, [])

  const translations = getTranslations(language)

  return {
    language,
    setLanguage: setCurrentLanguage,
    t: translations,
  }
}

// Alias para compatibilidade
export const useTranslations = useTranslation
