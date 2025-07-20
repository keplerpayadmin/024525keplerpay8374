"use client"

import { useState, useEffect } from "react"

// Tipos para internacionalização
export type Language = "en" | "pt" | "es" | "id"

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

// Nova interface para KStaking
export interface KStakingTranslations {
  title?: string
  subtitle?: string
  yourBalance?: string
  pendingRewards?: string
  lastClaim?: string
  totalClaimed?: string
  contractAPY?: string
  contractBalance?: string
  claimRewardsButton?: string
  processingClaim?: string
  claimSuccess?: string
  claimError?: string
  noKPPBalance?: string
  noRewardsToClaim?: string
  insufficientContractBalance?: string
  connectWalletToStake?: string
  lastClaimTime?: string
  notClaimedYet?: string
  rewardsPerDay?: string
  rewardsPerYear?: string
  dismiss?: string // Adicionado para o botão de dispensar
  powerActivated?: string // Adicionado para o indicador de bateria
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
  kstaking?: KStakingTranslations // Adicionado KStaking
}

// Função para obter o idioma atual do navegador ou o padrão (inglês)
export function getCurrentLanguage(): Language {
  if (typeof window === "undefined") return "en"
  const storedLanguage = localStorage.getItem("tpf_language") as Language | null
  return storedLanguage || "en"
}

// Função para definir o idioma atual
export function setCurrentLanguage(lang: Language): void {
  if (typeof window === "undefined") return
  localStorage.setItem("tpf_language", lang)
  const event = new Event("languageChange")
  window.dispatchEvent(event)
}

// Função para obter as traduções para um idioma específico
export function getTranslations(lang: Language): Translations {
  const translations: { [key in Language]: Translations } = {
    en: {
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
        streak: "streak",
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
            rule5:
              "You can only send one screenshot to the email, more than one will be disregarded, so send carefully",
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
      kstaking: {
        title: "KPP Staking",
        subtitle:
          "Just for holding KPP, you are entitled to passive earnings from other tokens. The more KPP you have, the more you earn!",
        yourBalance: "Your KPP Balance:",
        pendingRewards: "Pending Rewards:",
        lastClaim: "Last Claim:",
        totalClaimed: "Total Claimed:",
        contractAPY: "Contract APY:",
        contractBalance: "Contract Reward Balance:",
        claimRewardsButton: "Claim Rewards",
        processingClaim: "Processing Claim...",
        claimSuccess: "Rewards claimed successfully!",
        claimError: "Failed to claim rewards.",
        noKPPBalance: "No KPP tokens in wallet to stake.",
        noRewardsToClaim: "No rewards to claim.",
        insufficientContractBalance: "Insufficient reward balance in contract.",
        connectWalletToStake: "Connect your wallet to view staking details.",
        lastClaimTime: "Last Claim Time:",
        notClaimedYet: "Not claimed yet",
        rewardsPerDay: "Rewards per day:",
        rewardsPerYear: "Rewards per year:",
        dismiss: "Dismiss",
        powerActivated: "Power Activated",
      },
    },
    pt: {
      airdrop: {
        title: "KPP Airdrop",
        subtitle: "Reivindique seus tokens KPP grátis!",
        contractBalance: "Saldo do contrato:",
        dailyAirdrop: "Airdrop diário:",
        nextClaimIn: "Próximo claim em:",
        claimButton: "Reivindicar KPP",
        processing: "Processando...",
        tokensClaimedSuccess: "Tokens KPP reivindicados com sucesso!",
        availableForAirdrop: "Disponível para Airdrop:",
      },
      history: {
        title: "Histórico de Transações",
        all: "Todos",
        loading: "Carregando...",
        loadMore: "Carregar mais",
        noTransactions: "Nenhuma transação encontrada",
        showAllTransactions: "Mostrar todas as transações",
        received: "Recebido",
        sent: "Enviado",
        from: "De",
        to: "Para",
        block: "Bloco",
        txHash: "Hash da Transação",
        today: "Hoje",
        yesterday: "Ontem",
      },
      nav: {
        home: "Início",
        wallet: "Carteira",
        learn: "Aprender",
        profile: "Perfil",
        news: "Notícias",
        agenda: "Agenda",
        winners: "Vencedores",
        games: "Jogos",
        storm: "Storm",
        about: "Sobre",
        finances: "Finanças",
        partnerships: "Parcerias",
        membership: "Membresia",
        menu: "Fechar",
        close: "Fechar",
      },
      games: {
        title: "FiGames",
        subtitle: "Jogue e ganhe KPP",
        allGames: "Todos",
        action: "Ação",
        adventure: "Aventura",
        strategy: "Estratégia",
        puzzle: "Quebra-cabeça",
        rpg: "RPG",
        comingSoon: "Em Breve",
        enterNow: "Entrar Agora",
        moreGames: "Mais jogos em breve",
        featuredGame: "Jogo em Destaque",
        back: "Voltar",
        start: "Iniciar Jogo",
        score: "Pontuação",
        round: "Rodada",
        lives: "Vidas",
        shots: "Tiros",
        gameOver: "Fim de Jogo",
        playAgain: "Jogar Novamente",
        loading: "Carregando",
        developed: "Desenvolvido por KeplerPay",
      },
      wallet: {
        title: "Carteira",
        balance: "Saldo KPP",
        send: "Enviar",
        receive: "Receber",
        swap: "Trocar",
        otherTokens: "Outros Tokens",
        errorMessage: "Não foi possível obter o saldo real. Tente defini-lo manualmente.",
        address: "Endereço",
        assets: "Ativos",
        activity: "Atividade",
        copyAddress: "Copiar endereço",
        addressCopied: "Endereço copiado!",
        refreshBalances: "Atualizar saldos",
        balancesUpdated: "Saldos atualizados!",
        errorUpdatingBalances: "Erro ao atualizar saldos",
      },
      swap: {
        title: "Trocar Tokens",
        subtitle: "Troque tokens de forma rápida e segura",
        from: "De",
        to: "Para",
        amount: "Quantidade",
        estimatedOutput: "Saída estimada",
        slippage: "Slippage",
        slippageTooltip: "Tolerância máxima de variação de preço",
        swapButton: "Trocar",
        processing: "Processando...",
        success: "Troca concluída com sucesso!",
        error: "Erro ao realizar a troca",
        insufficientBalance: "Saldo insuficiente",
        selectToken: "Selecionar token",
        enterAmount: "Inserir quantidade",
        gettingQuote: "Obtendo cotação...",
        noQuoteAvailable: "Cotação não disponível",
        swapTokens: "Trocar tokens",
        maxSlippage: "Slippage máximo",
        priceImpact: "Impacto no preço",
        minimumReceived: "Mínimo recebido",
        networkFee: "Taxa de rede",
        route: "Rota",
      },
      winners: {
        title: "Vencedores",
        subtitle: "Participantes recompensados em nossos eventos",
        noWinners: "Nenhum vencedor ainda",
        noWinnersDesc:
          "Os vencedores de nossos eventos serão exibidos aqui. Fique atento aos próximos eventos para participar!",
      },
      agenda: {
        title: "Agenda",
        subtitle: "Eventos e atividades da comunidade",
        today: "Hoje",
        event: "Evento",
        noEvents: "Nenhum evento para esta data",
        howToParticipate: "Como participar:",
        incentivePeriod: "Período de Incentivo",
        eventsAndActivities: "Eventos e atividades da comunidade",
        online: "Online",
        participants: "participantes",
        days: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
        months: [
          "Janeiro",
          "Fevereiro",
          "Março",
          "Abril",
          "Maio",
          "Junho",
          "Julho",
          "Agosto",
          "Setembro",
          "Outubro",
          "Novembro",
          "Dezembro",
        ],
        eventTypes: {
          airdrop: "Airdrop",
          community: "Comunidade",
          competition: "Competição",
          education: "Educação",
        },
        events: {
          topHoldersIncentive: {
            title: "Incentivo de 10% para os 10 Melhores Detentores de KPP",
            description:
              "Ganhe 10% de tokens de bônus se estiver entre os 10 melhores detentores de KPP durante o período do evento. Exemplo: 10M KPP = 1M tokens de bônus",
            howToParticipate: [
              "Compre e mantenha tokens KPP",
              "Alcance uma posição entre os 10 melhores detentores",
              "Mantenha a posição até 9 de junho",
            ],
          },
        },
      },
      furnace: {
        title: "Fornalha",
        subtitle: "Queime tokens KPP e contribua para a estabilidade do token",
        totalBurned: "Total queimado",
        amountToBurn: "Quantidade de KPP para queimar",
        startBurn: "Iniciar Queima",
        openFurnace: "Abrir a Fornalha",
        burning: "Queimando...",
        burnCompleted: "Queima Concluída!",
        instructions: "Clique no botão para abrir a fornalha",
        furnaceInfo: "Informações da Fornalha",
        deflation:
          "Deflação: Cada token queimado é enviado para uma carteira morta (0x000...dEaD) e removido permanentemente de circulação.",
        lastTransaction: "Última Transação",
      },
      learn: {
        title: "Aprender",
        search: "Pesquisar conteúdo...",
        searchTerms: "Termos de pesquisa...",
        searchInGlossary: "Pesquisar no Glossário",
        didYouKnow: "Você sabia?",
        bitcoinPizza:
          "Em 22 de maio de 2010, Laszlo Hanyecz fez a primeira compra com Bitcoin: duas pizzas por 10.000 BTC. Hoje, essa quantia valeria milhões de dólares!",
        tokenomics: "Tokenomics",
        tokenomicsDesc:
          "Entenda a economia dos tokens e como ela afeta o valor e a utilidade dos projetos de criptomoedas.",
        glossary: "Glossário Cripto",
        glossaryDesc: "Guia completo de termos e conceitos do mundo das criptomoedas para iniciantes e especialistas.",
        glossaryTitle: "Glossário Cripto",
        tokenomicsTitle: "Tokenomics",
        tokenomicsIntro:
          "Tokenomics refere-se à economia dos tokens de criptomoedas. Entender a tokenomics de um projeto é essencial para avaliar seu valor e potencial de longo prazo.",
        supplyDistribution: "Oferta e Distribuição",
        supplyDistributionDesc:
          "A oferta total, circulante e máxima de tokens, bem como sua distribuição entre equipe, investidores e comunidade.",
        tokenUtility: "Utilidade do Token",
        tokenUtilityDesc: "Como o token é usado dentro do ecossistema e quais benefícios ele oferece aos detentores.",
        valueMechanisms: "Mecanismos de Valor",
        valueMechanismsDesc: "Queima de tokens, staking, governança e outros mecanismos que afetam o valor do token.",
        kppTokenomics: "Tokenomics do KPP",
        totalSupply: "Oferta Total:",
        liquidity: "Liquidez:",
        staking: "Staking:",
        team: "Equipe:",
        marketing: "Marketing:",
        reserve: "Reserva:",
        tradingSimulator: "Simulador de Negociação",
      },
      about: {
        title: "Sobre Nós",
        subtitle: "Saiba mais sobre o projeto KeplerPay",
        about: "Sobre",
        roadmap: "Roadmap",
        tokenomics: "Tokenomics",
        whyChoose: "Por que escolher KeplerPay?",
        airdrops: "Airdrops Diários",
        community: "Comunidade Ativa",
        utility: "Utilidade",
        longTerm: "Visão de Longo Prazo",
        growthStrategy: "Estratégia de Crescimento",
        marketing: "Marketing",
        incentives: "Incentivos",
        governance: "Governança",
        phase1: "Fase 1",
        phase1Completed: "Concluída",
        phase2: "Fase 2",
        phase2Development: "Em Desenvolvimento",
        phase3: "Fase 3",
        phase3Future: "Metas Futuras",
        tokenLaunch: "Lançamento do Token",
        websiteDocs: "Site e Documentação",
        communityGrowth: "Crescimento da Comunidade",
        miniApp: "Mini-App (Worldcoin AppStore)",
        airdropCampaigns: "Campanhas de Airdrop",
        fiGames: "Fi Games",
        fiStaking: "FiStaking (12% APY)",
        pulseGame: "Pulse Game",
        fiPay: "FiPay",
        enhancedSecurity: "Segurança Aprimorada",
        exchangeListings: "Listagens em Exchanges",
        ecosystem: "Expansão do Ecossistema KeplerPay",
        partnerships: "Parcerias",
        mobileApp: "Aplicativo Móvel",
        tokenDetails: "Detalhes do Token",
        holderBenefits: "Benefícios para Detentores",
        buyKPP: "Comprar KPP",
      },
      sendToken: {
        title: "Enviar Tokens",
        subtitle: "Enviar tokens para outro endereço",
        address: "Endereço",
        amount: "Quantidade",
        selectToken: "Selecionar Token",
        send: "Enviar",
        processing: "Processando...",
        addressRequired: "Endereço é obrigatório",
        invalidAmount: "Quantidade inválida",
        error: "Erro ao enviar tokens. Por favor, tente novamente.",
        transactionSuccess: "Transação enviada com sucesso!",
        transactionFailed: "Transação falhou",
        sentTo: "enviado para",
        viewTx: "Ver TX",
        minikitNotInstalled: "MiniKit não está instalado",
        tokenNotSupported: "Token não suportado",
        warning: "Por favor, verifique o endereço do destinatário antes de enviar tokens.",
        warningWorldchain:
          "Não envie para carteiras que não suportam Worldchain, caso contrário, você pode perder seus ativos. Não envie para exchanges.",
        hideWarning: "Ocultar aviso",
        transactionPending: "Transação pendente. Por favor, aguarde...",
      },
      connectButton: {
        connect: "Conectar Carteira",
        connecting: "Conectando...",
        connected: "Conectado",
        installMiniKit: "Por favor, instale o aplicativo Worldcoin para conectar sua carteira",
        errorConnecting: "Erro ao conectar a carteira. Por favor, tente novamente.",
      },
      storm: {
        title: "Storm",
        subtitle: "Publique palavras que aparecem na tela por alguns segundos",
        placeholder: "Digite uma palavra...",
        publish: "Publicar",
        connectWallet: "Conecte sua carteira para participar",
        wordPublished: "Palavra publicada!",
        enterWord: "Digite uma palavra",
        publishing: "Publicando...",
      },
      profile: {
        inviteBanner: "Convide amigos e familiares para experimentar nosso aplicativo",
        shareButton: "Compartilhar",
        profile: "Perfil",
        logOut: "Sair",
        shareWithFriends: "Compartilhe com amigos e familiares",
        followUs: "Siga-nos",
        notConnected: "Não conectado",
      },
      dailyCheckIn: {
        title: "Check-in Diário",
        subtitle: "Ganhe 1 ponto por dia",
        checkInButton: "Check In",
        alreadyCheckedIn: "Já fez o check-in hoje!",
        points: "pontos",
        totalPoints: "Total de pontos",
        streak: "sequência",
        days: "dias",
        checkInSuccess: "Check-in concluído! +1 ponto",
        history: "Histórico",
        showHistory: "Mostrar histórico",
        hideHistory: "Ocultar histórico",
        noHistory: "Nenhum check-in ainda",
        today: "Hoje",
        yesterday: "Ontem",
        daysAgo: "dias atrás",
        consecutiveDays: "dias consecutivos",
        nextCheckIn: "Próximo Check-in em:",
        hours: "h",
        minutes: "m",
        seconds: "s",
        availableNow: "Disponível agora!",
      },
      finances: {
        title: "Finanças",
        subtitle: "Transparência financeira do projeto",
        transparencyMessage:
          "Como nossa prioridade é a transparência, buscamos alinhar este princípio com nossos usuários e investidores",
        incentivesReceived: "Incentivos recebidos para o progresso do projeto",
        transactionFees: "Receita obtida com taxas de transação",
        tradingRevenue: "Receita obtida por nossa equipe de Trading",
        projectExpenses: "Despesas do projeto",
        lastUpdated: "Última atualização",
        overview: "Visão geral",
        revenue: "Receita",
        expenses: "Despesas",
        netBalance: "Saldo Líquido",
        financialChart: "Gráfico Financeiro",
        revenueBreakdown: "Distribuição da Receita",
        expenseBreakdown: "Distribuição das Despesas",
        noData: "Nenhum dado disponível",
        totalRevenue: "Receita Total",
        totalExpenses: "Despesas Totais",
      },
      partnerships: {
        title: "Parcerias",
        subtitle: "Nossos parceiros estratégicos",
        ourPartners: "Nossos Parceiros",
        holdstationTitle: "HoldStation",
        holdstationDescription: "Plataforma avançada de negociação e troca para WorldChain",
        visitApp: "Visitar App",
        poweredBy: "Desenvolvido por",
        swapIntegration: "Integração de Troca",
        swapDescription: "Funcionalidade de troca integrada através da API HoldStation",
        morePartnerships: "Mais Parcerias",
        comingSoon: "Em breve...",
      },
      level: {
        title: "Nível",
        multiplier: "Multiplicador",
        progress: "Progresso",
        toNextLevel: "para o próximo nível",
        xpSources: "Fontes de XP",
        dailyCheckIn: "Check-in Diário",
        checkInXP: "XP de Check-in",
        kppHolding: "Detenção de KPP",
        currentBalance: "Saldo atual",
        totalXP: "Total XP",
        levelBenefits: "Benefícios de Nível",
        eventRewards: "multiplicador de recompensas de evento",
        level: "Nível",
        viewDetails: "Ver detalhes",
      },
      events: {
        topHoldersEvent: {
          title: "Evento Top 10",
          description: "Bônus de 10% para os Melhores Detentores",
          remaining: "restante",
        },
        snakeTournament: {
          registrationTitle: "Inscrição no Torneio",
          registrationDescription: "Envie 200.000 KPP para se inscrever no torneio",
          tournamentTitle: "Torneio de Jogo da Cobrinha",
          tournamentDescription: "Obtenha a maior pontuação no jogo da cobrinha para ganhar o grande prêmio",
          instructions: "Instruções:",
          rules: {
            rule1: "O jogador que obtiver a maior pontuação no jogo da cobrinha ganha o grande prêmio",
            rule2:
              "A captura de tela de sua pontuação deve ser enviada para support@keplerpay.com até o último dia do torneio",
            rule3: "Em caso de empate com qualquer outro jogador, o prêmio será dividido",
            rule4: "O prêmio será anunciado na última semana do evento",
            rule5:
              "Você só pode enviar uma captura de tela para o e-mail, mais de uma será desconsiderada, então envie com cuidado",
          },
          registrationAddress: "Endereço de inscrição:",
          copyAddress: "Copiar endereço",
          addressCopied: "Endereço copiado!",
          email: "E-mail para envio da pontuação:",
          remaining: "restante",
          phase: "Fase",
          registration: "Inscrição",
          tournament: "Torneio",
        },
      },
      membership: {
        title: "Membresia KeplerPay",
        subtitle: "Membresia Premium",
        readyQuestion: "Você está pronto para se tornar um verdadeiro membro KeplerPay?",
        whatWeOffer: "O que temos a oferecer?",
        benefitDescription: "Parte das taxas de transação do KPP vai para nossos membros no dia 9 de cada mês!",
        benefitNote: "E não é tão pouco!",
        price: "20 WLD",
        priceForever: "para sempre!",
        priceExplanation: "Isso significa que você paga 20 WLD e recebe as taxas para sempre!",
        becomeButton: "Tornar-se Membro",
        processing: "Processando...",
        paymentInfo: "Informações de Pagamento",
        destinationWallet: "Carteira de Destino:",
        afterPayment: "Após o Pagamento",
        contactSupport: "Após o pagamento, entre em contato com a equipe de suporte com a captura de tela para:",
        tip: "Dica:",
        tipDescription: "Inclua a captura de tela da transação e o endereço da sua carteira no e-mail.",
      },
      kstaking: {
        title: "KPP Staking",
        subtitle:
          "Só por teres KPP tens direito a ganhos passivos de outros tokens, quanto mais KPP tiveres, mais ganhas!",
        yourBalance: "Seu Saldo KPP:",
        pendingRewards: "Recompensas Pendentes:",
        lastClaim: "Último Claim:",
        totalClaimed: "Total Reivindicado:",
        contractAPY: "APY do Contrato:",
        contractBalance: "Saldo de Recompensa do Contrato:",
        claimRewardsButton: "Reivindicar Recompensas",
        processingClaim: "Processando Reivindicação...",
        claimSuccess: "Recompensas reivindicadas com sucesso!",
        claimError: "Falha ao reivindicar recompensas.",
        noKPPBalance: "Nenhum token KPP na carteira para stake.",
        noRewardsToClaim: "Nenhuma recompensa para reivindicar.",
        insufficientContractBalance: "Saldo de recompensa insuficiente no contrato.",
        connectWalletToStake: "Conecte sua carteira para ver os detalhes do staking.",
        lastClaimTime: "Última Hora de Reivindicação:",
        notClaimedYet: "Ainda não reivindicado",
        rewardsPerDay: "Recompensas por dia:",
        rewardsPerYear: "Recompensas por ano:",
        dismiss: "Dispensar",
        powerActivated: "Energia Ativada",
      },
    },
    es: {
      airdrop: {
        title: "KPP Airdrop",
        subtitle: "¡Reclama tus tokens KPP gratis!",
        contractBalance: "Saldo del contrato:",
        dailyAirdrop: "Airdrop diario:",
        nextClaimIn: "Próximo reclamo en:",
        claimButton: "Reclamar KPP",
        processing: "Procesando...",
        tokensClaimedSuccess: "¡Tokens KPP reclamados con éxito!",
        availableForAirdrop: "Disponible para Airdrop:",
      },
      history: {
        title: "Historial de Transacciones",
        all: "Todos",
        loading: "Cargando...",
        loadMore: "Cargar más",
        noTransactions: "No se encontraron transacciones",
        showAllTransactions: "Mostrar todas las transacciones",
        received: "Recibido",
        sent: "Enviado",
        from: "De",
        to: "Para",
        block: "Bloque",
        txHash: "Hash de Transacción",
        today: "Hoy",
        yesterday: "Ayer",
      },
      nav: {
        home: "Inicio",
        wallet: "Billetera",
        learn: "Aprender",
        profile: "Perfil",
        news: "Noticias",
        agenda: "Agenda",
        winners: "Ganadores",
        games: "Juegos",
        storm: "Storm",
        about: "Acerca de",
        finances: "Finanzas",
        partnerships: "Asociaciones",
        membership: "Membresía",
        menu: "Cerrar",
        close: "Cerrar",
      },
      games: {
        title: "FiGames",
        subtitle: "Juega y gana KPP",
        allGames: "Todos",
        action: "Acción",
        adventure: "Aventura",
        strategy: "Estrategia",
        puzzle: "Rompecabezas",
        rpg: "RPG",
        comingSoon: "Próximamente",
        enterNow: "Entrar Ahora",
        moreGames: "Más juegos próximamente",
        featuredGame: "Juego Destacado",
        back: "Volver",
        start: "Iniciar Juego",
        score: "Puntuación",
        round: "Ronda",
        lives: "Vidas",
        shots: "Disparos",
        gameOver: "Fin del Juego",
        playAgain: "Jugar de Nuevo",
        loading: "Cargando",
        developed: "Desarrollado por KeplerPay",
      },
      wallet: {
        title: "Billetera",
        balance: "Saldo KPP",
        send: "Enviar",
        receive: "Recibir",
        swap: "Intercambiar",
        otherTokens: "Otros Tokens",
        errorMessage: "No se pudo obtener el saldo real. Intente configurarlo manualmente.",
        address: "Dirección",
        assets: "Activos",
        activity: "Actividad",
        copyAddress: "Copiar dirección",
        addressCopied: "¡Dirección copiada!",
        refreshBalances: "Actualizar saldos",
        balancesUpdated: "¡Saldos actualizados!",
        errorUpdatingBalances: "Error al actualizar saldos",
      },
      swap: {
        title: "Intercambiar Tokens",
        subtitle: "Intercambia tokens de forma rápida y segura",
        from: "De",
        to: "Para",
        amount: "Cantidad",
        estimatedOutput: "Salida estimada",
        slippage: "Deslizamiento",
        slippageTooltip: "Tolerancia máxima de variación de precio",
        swapButton: "Intercambiar",
        processing: "Procesando...",
        success: "¡Intercambio completado con éxito!",
        error: "Error al realizar el intercambio",
        insufficientBalance: "Saldo insuficiente",
        selectToken: "Seleccionar token",
        enterAmount: "Ingresar cantidad",
        gettingQuote: "Obteniendo cotización...",
        noQuoteAvailable: "Cotización no disponible",
        swapTokens: "Intercambiar tokens",
        maxSlippage: "Deslizamiento máximo",
        priceImpact: "Impacto en el precio",
        minimumReceived: "Mínimo recibido",
        networkFee: "Tarifa de red",
        route: "Ruta",
      },
      winners: {
        title: "Ganadores",
        subtitle: "Participantes recompensados en nuestros eventos",
        noWinners: "Aún no hay ganadores",
        noWinnersDesc:
          "Los ganadores de nuestros eventos se mostrarán aquí. ¡Estén atentos a los próximos eventos para participar!",
      },
      agenda: {
        title: "Agenda",
        subtitle: "Eventos y actividades de la comunidad",
        today: "Hoy",
        event: "Evento",
        noEvents: "No hay eventos para esta fecha",
        howToParticipate: "Cómo participar:",
        incentivePeriod: "Período de Incentivo",
        eventsAndActivities: "Eventos y actividades de la comunidad",
        online: "En línea",
        participants: "participantes",
        days: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
        months: [
          "Enero",
          "Febrero",
          "Marzo",
          "Abril",
          "Mayo",
          "Junio",
          "Julio",
          "Agosto",
          "Septiembre",
          "Octubre",
          "Noviembre",
          "Diciembre",
        ],
        eventTypes: {
          airdrop: "Airdrop",
          community: "Comunidad",
          competition: "Competición",
          education: "Educación",
        },
        events: {
          topHoldersIncentive: {
            title: "Incentivo del 10% para los 10 Mejores Poseedores de KPP",
            description:
              "Gana un 10% de tokens de bonificación si estás entre los 10 mejores poseedores de KPP durante el período del evento. Ejemplo: 10M KPP = 1M tokens de bonificación",
            howToParticipate: [
              "Compra y mantén tokens KPP",
              "Alcanza una posición entre los 10 mejores poseedores",
              "Mantén la posición hasta el 9 de junio",
            ],
          },
        },
      },
      furnace: {
        title: "Horno",
        subtitle: "Quema tokens KPP y contribuye a la estabilidad del token",
        totalBurned: "Total quemado",
        amountToBurn: "Cantidad de KPP para quemar",
        startBurn: "Iniciar Quema",
        openFurnace: "Abrir el Horno",
        burning: "Quemando...",
        burnCompleted: "¡Quema Completada!",
        instructions: "Haz clic en el botón para abrir el horno",
        furnaceInfo: "Información del Horno",
        deflation:
          "Deflación: Cada token quemado se envía a una billetera muerta (0x000...dEaD) y se elimina permanentemente de la circulación.",
        lastTransaction: "Última Transacción",
      },
      learn: {
        title: "Aprender",
        search: "Buscar contenido...",
        searchTerms: "Términos de búsqueda...",
        searchInGlossary: "Buscar en el Glosario",
        didYouKnow: "¿Sabías que?",
        bitcoinPizza:
          "El 22 de mayo de 2010, Laszlo Hanyecz realizó la primera compra con Bitcoin: dos pizzas por 10.000 BTC. ¡Hoy, esa cantidad valdría millones de dólares!",
        tokenomics: "Tokenomics",
        tokenomicsDesc:
          "Comprende la economía de los tokens y cómo afecta el valor y la utilidad de los proyectos de criptomonedas.",
        glossary: "Glosario Cripto",
        glossaryDesc:
          "Guía completa de términos y conceptos del mundo de las criptomonedas para principiantes y expertos.",
        glossaryTitle: "Glosario Cripto",
        tokenomicsTitle: "Tokenomics",
        tokenomicsIntro:
          "Tokenomics se refiere a la economía de los tokens de criptomonedas. Comprender la tokenomics de un proyecto es esencial para evaluar su valor y potencial a largo plazo.",
        supplyDistribution: "Oferta y Distribución",
        supplyDistributionDesc:
          "La oferta total, circulante y máxima de tokens, así como su distribución entre equipo, inversores y comunidad.",
        tokenUtility: "Utilidad del Token",
        tokenUtilityDesc: "Cómo se utiliza el token dentro del ecosistema y qué beneficios ofrece a los poseedores.",
        valueMechanisms: "Mecanismos de Valor",
        valueMechanismsDesc: "Quema de tokens, staking, gobernanza y otros mecanismos que afectan el valor del token.",
        kppTokenomics: "Tokenomics del KPP",
        totalSupply: "Oferta Total:",
        liquidity: "Liquidez:",
        staking: "Staking:",
        team: "Equipo:",
        marketing: "Marketing:",
        reserve: "Reserva:",
        tradingSimulator: "Simulador de Negociación",
      },
      about: {
        title: "Acerca de Nosotros",
        subtitle: "Aprende sobre el proyecto KeplerPay",
        about: "Acerca de",
        roadmap: "Hoja de Ruta",
        tokenomics: "Tokenomics",
        whyChoose: "¿Por qué elegir KeplerPay?",
        airdrops: "Airdrops Diarios",
        community: "Comunidad Activa",
        utility: "Utilidad",
        longTerm: "Visión a Largo Plazo",
        growthStrategy: "Estrategia de Crecimiento",
        marketing: "Marketing",
        incentives: "Incentivos",
        governance: "Gobernanza",
        phase1: "Fase 1",
        phase1Completed: "Completada",
        phase2: "Fase 2",
        phase2Development: "En Desarrollo",
        phase3: "Fase 3",
        phase3Future: "Metas Futuras",
        tokenLaunch: "Lanzamiento del Token",
        websiteDocs: "Sitio Web y Documentación",
        communityGrowth: "Crecimiento de la Comunidad",
        miniApp: "Mini-App (Worldcoin AppStore)",
        airdropCampaigns: "Campañas de Airdrop",
        fiGames: "Fi Games",
        fiStaking: "FiStaking (12% APY)",
        pulseGame: "Pulse Game",
        fiPay: "FiPay",
        enhancedSecurity: "Seguridad Mejorada",
        exchangeListings: "Listados en Exchanges",
        ecosystem: "Expansión del Ecosistema KeplerPay",
        partnerships: "Asociaciones",
        mobileApp: "Aplicación Móvil",
        tokenDetails: "Detalles del Token",
        holderBenefits: "Beneficios para Poseedores",
        buyKPP: "Comprar KPP",
      },
      sendToken: {
        title: "Enviar Tokens",
        subtitle: "Enviar tokens a otra dirección",
        address: "Dirección",
        amount: "Cantidad",
        selectToken: "Seleccionar Token",
        send: "Enviar",
        processing: "Procesando...",
        addressRequired: "Se requiere dirección",
        invalidAmount: "Cantidad inválida",
        error: "Error al enviar tokens. Por favor, inténtalo de nuevo.",
        transactionSuccess: "¡Transacción enviada con éxito!",
        transactionFailed: "Transacción fallida",
        sentTo: "enviado a",
        viewTx: "Ver TX",
        minikitNotInstalled: "MiniKit no está instalado",
        tokenNotSupported: "Token no soportado",
        warning: "Por favor, verifica la dirección del destinatario antes de enviar tokens.",
        warningWorldchain:
          "No envíes a billeteras que no admitan Worldchain, de lo contrario, podrías perder tus activos. No envíes a exchanges.",
        hideWarning: "Ocultar advertencia",
        transactionPending: "Transacción pendiente. Por favor, espera...",
      },
      connectButton: {
        connect: "Conectar Billetera",
        connecting: "Conectando...",
        connected: "Conectado",
        installMiniKit: "Por favor, instala la aplicación Worldcoin para conectar tu billetera",
        errorConnecting: "Error al conectar la billetera. Por favor, inténtalo de nuevo.",
      },
      storm: {
        title: "Storm",
        subtitle: "Publica palabras que aparecen en la pantalla durante unos segundos",
        placeholder: "Escribe una palabra...",
        publish: "Publicar",
        connectWallet: "Conecta tu billetera para participar",
        wordPublished: "¡Palabra publicada!",
        enterWord: "Escribe una palabra",
        publishing: "Publicando...",
      },
      profile: {
        inviteBanner: "Invita a amigos y familiares a probar nuestra aplicación",
        shareButton: "Compartir",
        profile: "Perfil",
        logOut: "Cerrar sesión",
        shareWithFriends: "Comparte con amigos y familiares",
        followUs: "Síguenos",
        notConnected: "No conectado",
      },
      dailyCheckIn: {
        title: "Check-in Diario",
        subtitle: "Gana 1 punto por día",
        checkInButton: "Check In",
        alreadyCheckedIn: "¡Ya has hecho el check-in hoy!",
        points: "puntos",
        totalPoints: "Puntos totales",
        streak: "racha",
        days: "días",
        checkInSuccess: "¡Check-in completado! +1 punto",
        history: "Historial",
        showHistory: "Mostrar historial",
        hideHistory: "Ocultar historial",
        noHistory: "Aún no hay check-ins",
        today: "Hoy",
        yesterday: "Ayer",
        daysAgo: "días atrás",
        consecutiveDays: "días consecutivos",
        nextCheckIn: "Próximo Check-in en:",
        hours: "h",
        minutes: "m",
        seconds: "s",
        availableNow: "¡Disponible ahora!",
      },
      finances: {
        title: "Finanzas",
        subtitle: "Transparencia financiera del proyecto",
        transparencyMessage:
          "Como nuestra prioridad es la transparencia, buscamos alinear este principio con nuestros usuarios e inversores",
        incentivesReceived: "Incentivos recibidos para el progreso del proyecto",
        transactionFees: "Ingresos obtenidos de las tarifas de transacción",
        tradingRevenue: "Ingresos obtenidos por nuestro equipo de Trading",
        projectExpenses: "Gastos del proyecto",
        lastUpdated: "Última actualización",
        overview: "Visión general",
        revenue: "Ingresos",
        expenses: "Gastos",
        netBalance: "Saldo Neto",
        financialChart: "Gráfico Financiero",
        revenueBreakdown: "Distribución de Ingresos",
        expenseBreakdown: "Distribución de Gastos",
        noData: "No hay datos disponibles",
        totalRevenue: "Ingresos Totales",
        totalExpenses: "Gastos Totales",
      },
      partnerships: {
        title: "Asociaciones",
        subtitle: "Nuestros socios estratégicos",
        ourPartners: "Nuestros Socios",
        holdstationTitle: "HoldStation",
        holdstationDescription: "Plataforma avanzada de negociación e intercambio para WorldChain",
        visitApp: "Visitar App",
        poweredBy: "Desarrollado por",
        swapIntegration: "Integración de Intercambio",
        swapDescription: "Funcionalidad de intercambio integrada a través de la API HoldStation",
        morePartnerships: "Más Asociaciones",
        comingSoon: "Próximamente...",
      },
      level: {
        title: "Nivel",
        multiplier: "Multiplicador",
        progress: "Progreso",
        toNextLevel: "para el próximo nivel",
        xpSources: "Fuentes de XP",
        dailyCheckIn: "Check-in Diario",
        checkInXP: "XP de Check-in",
        kppHolding: "Posesión de KPP",
        currentBalance: "Saldo actual",
        totalXP: "XP Total",
        levelBenefits: "Beneficios de Nivel",
        eventRewards: "multiplicador de recompensas de evento",
        level: "Nivel",
        viewDetails: "Ver detalles",
      },
      events: {
        topHoldersEvent: {
          title: "Evento Top 10",
          description: "Bono del 10% para los Mejores Poseedores",
          remaining: "restante",
        },
        snakeTournament: {
          registrationTitle: "Inscripción al Torneo",
          registrationDescription: "Envía 200.000 KPP para inscribirte en el torneo",
          tournamentTitle: "Torneo de Juego de la Serpiente",
          tournamentDescription: "Obtén la puntuación más alta en el juego de la serpiente para ganar el gran premio",
          instructions: "Instrucciones:",
          rules: {
            rule1: "El jugador que obtenga la puntuación más alta en el juego de la serpiente gana el gran premio",
            rule2:
              "La captura de pantalla de tu puntuación debe enviarse a support@keplerpay.com antes del último día del torneo",
            rule3: "En caso de empate con cualquier otro jugador, el premio se dividirá",
            rule4: "El premio se anunciará en la última semana del evento",
            rule5:
              "Solo puedes enviar una captura de pantalla al correo electrónico, se ignorará más de una, así que envíala con cuidado",
          },
          registrationAddress: "Dirección de inscripción:",
          copyAddress: "Copiar dirección",
          addressCopied: "¡Dirección copiada!",
          email: "Correo electrónico para enviar la puntuación:",
          remaining: "restante",
          phase: "Fase",
          registration: "Inscripción",
          tournament: "Torneio",
        },
      },
      membership: {
        title: "Membresía KeplerPay",
        subtitle: "Membresía Premium",
        readyQuestion: "¿Estás listo para convertirte en un verdadero miembro de KeplerPay?",
        whatWeOffer: "¿Qué tenemos para ofrecer?",
        benefitDescription:
          "¡Parte de las tarifas de transacción de KPP se destina a nuestros miembros el día 9 de cada mes!",
        benefitNote: "¡Y no es tan poco!",
        price: "20 WLD",
        priceForever: "¡para siempre!",
        priceExplanation: "¡Eso significa que pagas 20 WLD y obtienes las tarifas para siempre!",
        becomeButton: "Convertirse en Miembro",
        processing: "Procesando...",
        paymentInfo: "Información de Pago",
        destinationWallet: "Billetera de Destino:",
        afterPayment: "Después del Pago",
        contactSupport: "Después del pago, ponte en contacto con el equipo de soporte con la captura de pantalla para:",
        tip: "Consejo:",
        tipDescription:
          "Incluye la captura de pantalla de la transacción y la dirección de tu billetera en el correo electrónico.",
      },
      kstaking: {
        title: "KPP Staking",
        subtitle:
          "¡Solo por tener KPP tienes derecho a ganancias pasivas de otros tokens, cuanto más KPP tengas, más ganas!",
        yourBalance: "Tu Saldo KPP:",
        pendingRewards: "Recompensas Pendientes:",
        lastClaim: "Último Reclamo:",
        totalClaimed: "Total Reclamado:",
        contractAPY: "APY del Contrato:",
        contractBalance: "Saldo de Recompensa del Contrato:",
        claimRewardsButton: "Reclamar Recompensas",
        processingClaim: "Procesando Reclamo...",
        claimSuccess: "¡Recompensas reclamadas con éxito!",
        claimError: "Error al reclamar recompensas.",
        noKPPBalance: "No hay tokens KPP en la billetera para staking.",
        noRewardsToClaim: "No hay recompensas para reclamar.",
        insufficientContractBalance: "Saldo de recompensa insuficiente en el contrato.",
        connectWalletToStake: "Conecta tu billetera para ver los detalles del staking.",
        lastClaimTime: "Última Hora de Reclamo:",
        notClaimedYet: "Aún no reclamado",
        rewardsPerDay: "Recompensas por día:",
        rewardsPerYear: "Recompensas por año:",
        dismiss: "Descartar",
        powerActivated: "Energía Activada",
      },
    },
    id: {
      airdrop: {
        title: "KPP Airdrop",
        subtitle: "Klaim token KPP gratis Anda!",
        contractBalance: "Saldo kontrak:",
        dailyAirdrop: "Airdrop harian:",
        nextClaimIn: "Klaim berikutnya dalam:",
        claimButton: "Klaim KPP",
        processing: "Memproses...",
        tokensClaimedSuccess: "Token KPP berhasil diklaim!",
        availableForAirdrop: "Tersedia untuk Airdrop:",
      },
      history: {
        title: "Riwayat Transaksi",
        all: "Semua",
        loading: "Memuat...",
        loadMore: "Muat lebih banyak",
        noTransactions: "Tidak ada transaksi yang ditemukan",
        showAllTransactions: "Tampilkan semua transaksi",
        received: "Diterima",
        sent: "Dikirim",
        from: "Dari",
        to: "Ke",
        block: "Blok",
        txHash: "Hash Transaksi",
        today: "Hari ini",
        yesterday: "Kemarin",
      },
      nav: {
        home: "Beranda",
        wallet: "Dompet",
        learn: "Belajar",
        profile: "Profil",
        news: "Berita",
        agenda: "Agenda",
        winners: "Pemenang",
        games: "Game",
        storm: "Storm",
        about: "Tentang",
        finances: "Keuangan",
        partnerships: "Kemitraan",
        membership: "Keanggotaan",
        menu: "Tutup",
        close: "Tutup",
      },
      games: {
        title: "FiGames",
        subtitle: "Mainkan dan dapatkan KPP",
        allGames: "Semua",
        action: "Aksi",
        adventure: "Petualangan",
        strategy: "Strategi",
        puzzle: "Teka-teki",
        rpg: "RPG",
        comingSoon: "Segera Hadir",
        enterNow: "Masuk Sekarang",
        moreGames: "Lebih banyak game segera hadir",
        featuredGame: "Game Unggulan",
        back: "Kembali",
        start: "Mulai Game",
        score: "Skor",
        round: "Ronde",
        lives: "Nyawa",
        shots: "Tembakan",
        gameOver: "Game Selesai",
        playAgain: "Main Lagi",
        loading: "Memuat",
        developed: "Dikembangkan oleh KeplerPay",
      },
      wallet: {
        title: "Dompet",
        balance: "Saldo KPP",
        send: "Kirim",
        receive: "Terima",
        swap: "Tukar",
        otherTokens: "Token Lain",
        errorMessage: "Tidak dapat memperoleh saldo sebenarnya. Coba atur secara manual.",
        address: "Alamat",
        assets: "Aset",
        activity: "Aktivitas",
        copyAddress: "Salin alamat",
        addressCopied: "Alamat disalin!",
        refreshBalances: "Segarkan saldo",
        balancesUpdated: "Saldo diperbarui!",
        errorUpdatingBalances: "Kesalahan memperbarui saldo",
      },
      swap: {
        title: "Tukar Token",
        subtitle: "Tukar token dengan cepat dan aman",
        from: "Dari",
        to: "Ke",
        amount: "Jumlah",
        estimatedOutput: "Estimasi hasil",
        slippage: "Slippage",
        slippageTooltip: "Toleransi variasi harga maksimum",
        swapButton: "Tukar",
        processing: "Memproses...",
        success: "Penukaran berhasil diselesaikan!",
        error: "Kesalahan melakukan penukaran",
        insufficientBalance: "Saldo tidak mencukupi",
        selectToken: "Pilih token",
        enterAmount: "Masukkan jumlah",
        gettingQuote: "Mendapatkan kuotasi...",
        noQuoteAvailable: "Kuotasi tidak tersedia",
        swapTokens: "Tukar token",
        maxSlippage: "Slippage maksimum",
        priceImpact: "Dampak harga",
        minimumReceived: "Minimum diterima",
        networkFee: "Biaya jaringan",
        route: "Rute",
      },
      winners: {
        title: "Pemenang",
        subtitle: "Peserta diberi hadiah dalam acara kami",
        noWinners: "Belum ada pemenang",
        noWinnersDesc: "Pemenang acara kami akan ditampilkan di sini. Nantikan acara mendatang untuk berpartisipasi!",
      },
      agenda: {
        title: "Agenda",
        subtitle: "Acara dan aktivitas komunitas",
        today: "Hari ini",
        event: "Acara",
        noEvents: "Tidak ada acara untuk tanggal ini",
        howToParticipate: "Cara berpartisipasi:",
        incentivePeriod: "Periode Insentif",
        eventsAndActivities: "Acara dan aktivitas komunitas",
        online: "Online",
        participants: "peserta",
        days: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
        months: [
          "Januari",
          "Februari",
          "Maret",
          "April",
          "Mei",
          "Juni",
          "Juli",
          "Agustus",
          "September",
          "Oktober",
          "November",
          "Desember",
        ],
        eventTypes: {
          airdrop: "Airdrop",
          community: "Komunitas",
          competition: "Kompetisi",
          education: "Pendidikan",
        },
        events: {
          topHoldersIncentive: {
            title: "Insentif 10% untuk 10 Pemegang KPP Teratas",
            description:
              "Dapatkan 10% token bonus jika Anda termasuk di antara 10 pemegang KPP teratas selama periode acara. Contoh: 10M KPP = 1M token bonus",
            howToParticipate: [
              "Beli dan tahan token KPP",
              "Raih posisi di antara 10 pemegang teratas",
              "Pertahankan posisi hingga 9 Juni",
            ],
          },
        },
      },
      furnace: {
        title: "Tungku",
        subtitle: "Bakar token KPP dan berkontribusi pada stabilitas token",
        totalBurned: "Total dibakar",
        amountToBurn: "Jumlah KPP yang akan dibakar",
        startBurn: "Mulai Bakar",
        openFurnace: "Buka Tungku",
        burning: "Membakar...",
        burnCompleted: "Pembakaran Selesai!",
        instructions: "Klik tombol untuk membuka tungku",
        furnaceInfo: "Informasi Tungku",
        deflation:
          "Deflasi: Setiap token yang dibakar dikirim ke dompet mati (0x000...dEaD) dan dihapus secara permanen dari peredaran.",
        lastTransaction: "Transaksi Terakhir",
      },
      learn: {
        title: "Belajar",
        search: "Cari konten...",
        searchTerms: "Istilah pencarian...",
        searchInGlossary: "Cari di Glosarium",
        didYouKnow: "Tahukah Anda?",
        bitcoinPizza:
          "Pada tanggal 22 Mei 2010, Laszlo Hanyecz melakukan pembelian Bitcoin pertama: dua pizza seharga 10.000 BTC. Saat ini, jumlah itu bernilai jutaan dolar!",
        tokenomics: "Tokenomics",
        tokenomicsDesc: "Pahami ekonomi token dan bagaimana hal itu memengaruhi nilai dan utilitas proyek kripto.",
        glossary: "Glosarium Kripto",
        glossaryDesc: "Panduan lengkap untuk istilah dan konsep dari dunia mata uang kripto untuk pemula dan ahli.",
        glossaryTitle: "Glosarium Kripto",
        tokenomicsTitle: "Tokenomics",
        tokenomicsIntro:
          "Tokenomics mengacu pada ekonomi token mata uang kripto. Memahami tokenomics suatu proyek sangat penting untuk mengevaluasi nilai dan potensi jangka panjangnya.",
        supplyDistribution: "Pasokan dan Distribusi",
        supplyDistributionDesc:
          "Total, yang beredar, dan pasokan maksimum token, serta distribusinya di antara tim, investor, dan komunitas.",
        tokenUtility: "Utilitas Token",
        tokenUtilityDesc:
          "Bagaimana token digunakan dalam ekosistem dan manfaat apa yang ditawarkannya kepada pemegang.",
        valueMechanisms: "Mekanisme Nilai",
        valueMechanismsDesc: "Pembakaran token, staking, tata kelola, dan mekanisme lain yang memengaruhi nilai token.",
        kppTokenomics: "Tokenomics KPP",
        totalSupply: "Total Pasokan:",
        liquidity: "Likuiditas:",
        staking: "Staking:",
        team: "Tim:",
        marketing: "Pemasaran:",
        reserve: "Cadangan:",
        tradingSimulator: "Simulator Perdagangan",
      },
      about: {
        title: "Tentang Kami",
        subtitle: "Pelajari tentang proyek KeplerPay",
        about: "Tentang",
        roadmap: "Peta Jalan",
        tokenomics: "Tokenomics",
        whyChoose: "Mengapa memilih KeplerPay?",
        airdrops: "Airdrop Harian",
        community: "Komunitas Aktif",
        utility: "Utilitas",
        longTerm: "Visi Jangka Panjang",
        growthStrategy: "Strategi Pertumbuhan",
        marketing: "Pemasaran",
        incentives: "Insentif",
        governance: "Tata Kelola",
        phase1: "Fase 1",
        phase1Completed: "Selesai",
        phase2: "Fase 2",
        phase2Development: "Dalam Pengembangan",
        phase3: "Fase 3",
        phase3Future: "Tujuan Masa Depan",
        tokenLaunch: "Peluncuran Token",
        websiteDocs: "Situs Web dan Dokumentasi",
        communityGrowth: "Pertumbuhan Komunitas",
        miniApp: "Mini-App (Worldcoin AppStore)",
        airdropCampaigns: "Kampanye Airdrop",
        fiGames: "Fi Games",
        fiStaking: "FiStaking (12% APY)",
        pulseGame: "Pulse Game",
        fiPay: "FiPay",
        enhancedSecurity: "Keamanan yang Ditingkatkan",
        exchangeListings: "Daftar Bursa",
        ecosystem: "Ekspansi Ekosistem KeplerPay",
        partnerships: "Kemitraan",
        mobileApp: "Aplikasi Seluler",
        tokenDetails: "Detail Token",
        holderBenefits: "Manfaat Pemegang",
        buyKPP: "Beli KPP",
      },
      sendToken: {
        title: "Kirim Token",
        subtitle: "Kirim token ke alamat lain",
        address: "Alamat",
        amount: "Jumlah",
        selectToken: "Pilih Token",
        send: "Kirim",
        processing: "Memproses...",
        addressRequired: "Alamat diperlukan",
        invalidAmount: "Jumlah tidak valid",
        error: "Kesalahan mengirim token. Silakan coba lagi.",
        transactionSuccess: "Transaksi berhasil dikirim!",
        transactionFailed: "Transaksi gagal",
        sentTo: "dikirim ke",
        viewTx: "Lihat TX",
        minikitNotInstalled: "MiniKit tidak terpasang",
        tokenNotSupported: "Token tidak didukung",
        warning: "Harap verifikasi alamat penerima sebelum mengirim token.",
        warningWorldchain:
          "Jangan kirim ke dompet yang tidak mendukung Worldchain, jika tidak, Anda dapat kehilangan aset Anda. Jangan kirim ke bursa.",
        hideWarning: "Sembunyikan peringatan",
        transactionPending: "Transaksi tertunda. Harap tunggu...",
      },
      connectButton: {
        connect: "Hubungkan Dompet",
        connecting: "Menghubungkan...",
        connected: "Terhubung",
        installMiniKit: "Harap instal Aplikasi Worldcoin untuk menghubungkan dompet Anda",
        errorConnecting: "Kesalahan menghubungkan dompet. Silakan coba lagi.",
      },
      storm: {
        title: "Storm",
        subtitle: "Publikasikan kata-kata yang muncul di layar selama beberapa detik",
        placeholder: "Ketik sebuah kata...",
        publish: "Publikasikan",
        connectWallet: "Hubungkan dompet Anda untuk berparticiper",
        wordPublished: "Kata diterbitkan!",
        enterWord: "Masukkan sebuah kata",
        publishing: "Menerbitkan...",
      },
      profile: {
        inviteBanner: "Undang teman dan keluarga untuk mencoba aplikasi kami",
        shareButton: "Bagikan",
        profile: "Profil",
        logOut: "Keluar",
        shareWithFriends: "Bagikan dengan teman dan keluarga",
        followUs: "Ikuti kami",
        notConnected: "Tidak terhubung",
      },
      dailyCheckIn: {
        title: "Check-in Harian",
        subtitle: "Dapatkan 1 poin per hari",
        checkInButton: "Check In",
        alreadyCheckedIn: "Sudah check-in hari ini!",
        points: "poin",
        totalPoints: "Total poin",
        streak: "streak",
        days: "hari",
        checkInSuccess: "Check-in selesai! +1 poin",
        history: "Riwayat",
        showHistory: "Tampilkan riwayat",
        hideHistory: "Sembunyikan riwayat",
        noHistory: "Belum ada check-in",
        today: "Hari ini",
        yesterday: "Kemarin",
        daysAgo: "hari yang lalu",
        consecutiveDays: "hari berturut-turut",
        nextCheckIn: "Check-in Berikutnya dalam:",
        hours: "j",
        minutes: "m",
        seconds: "d",
        availableNow: "Tersedia sekarang!",
      },
      finances: {
        title: "Keuangan",
        subtitle: "Transparansi keuangan proyek",
        transparencyMessage:
          "Karena prioritas kami adalah transparansi, kami berusaha untuk menyelaraskan prinsip ini dengan pengguna dan investor kami",
        incentivesReceived: "Insentif diterima untuk kemajuan proyek",
        transactionFees: "Pendapatan diperoleh dari biaya transaksi",
        tradingRevenue: "Pendapatan diperoleh oleh tim Perdagangan kami",
        projectExpenses: "Biaya proyek",
        lastUpdated: "Terakhir diperbarui",
        overview: "Ikhtisar",
        revenue: "Pendapatan",
        expenses: "Biaya",
        netBalance: "Saldo Bersih",
        financialChart: "Grafik Keuangan",
        revenueBreakdown: "Rincian Pendapatan",
        expenseBreakdown: "Rincian Biaya",
        noData: "Tidak ada data yang tersedia",
        totalRevenue: "Total Pendapatan",
        totalExpenses: "Total Biaya",
      },
      partnerships: {
        title: "Kemitraan",
        subtitle: "Mitra strategis kami",
        ourPartners: "Mitra Kami",
        holdstationTitle: "HoldStation",
        holdstationDescription: "Platform perdagangan dan pertukaran canggih para WorldChain",
        visitApp: "Kunjungi Aplikasi",
        poweredBy: "Didukung oleh",
        swapIntegration: "Integrasi Pertukaran",
        swapDescription: "Fungsi pertukaran terintegrasi melalui API HoldStation",
        morePartnerships: "Lebih Banyak Kemitraan",
        comingSoon: "Segera hadir...",
      },
      level: {
        title: "Level",
        multiplier: "Pengganda",
        progress: "Kemajuan",
        toNextLevel: "ke level berikutnya",
        xpSources: "Sumber XP",
        dailyCheckIn: "Check-in Harian",
        checkInXP: "XP Check-in",
        kppHolding: "Kepemilikan KPP",
        currentBalance: "Saldo saat ini",
        totalXP: "Total XP",
        levelBenefits: "Manfaat Level",
        eventRewards: "pengganda hadiah acara",
        level: "Level",
        viewDetails: "Lihat detail",
      },
      events: {
        topHoldersEvent: {
          title: "Acara Top 10",
          description: "Bonus 10% para Pemegang Teratas",
          remaining: "tersisa",
        },
        snakeTournament: {
          registrationTitle: "Pendaftaran Turnamen",
          registrationDescription: "Kirim 200.000 KPP para mendaftar turnamen",
          tournamentTitle: "Turnamen Game Ular",
          tournamentDescription: "Dapatkan skor tertinggi di game ular para memenangkan hadiah utama",
          instructions: "Instruksi:",
          rules: {
            rule1: "Pemain que mencapai o maior pontuação no game ular ganha o grande prêmio",
            rule2: "Tangkapan layar skor Anda harus dikirim ke support@keplerpay.com pada hari terakhir turnamen",
            rule3: "Jika terjadi seri com pemain lain, hadiah akan dibagi",
            rule4: "Hadiah akan diumumkan pada minggu terakhir acara",
            rule5:
              "Você só pode enviar uma tangkapan layar ke email, mais de uma será diabaikan, jadi kirim com hati-hati",
          },
          registrationAddress: "Alamat pendaftaran:",
          copyAddress: "Salin alamat",
          addressCopied: "Alamat disalin!",
          email: "Email para pengiriman skor:",
          remaining: "tersisa",
          phase: "Fase",
          registration: "Pendaftaran",
          tournament: "Turnamen",
        },
      },
      membership: {
        title: "Keanggotaan KeplerPay",
        subtitle: "Keanggotaan Premium",
        readyQuestion: "Apakah Anda siap untuk menjadi anggota KeplerPay sejati?",
        whatWeOffer: "Apa yang kami tawarkan?",
        benefitDescription: "Sebagian dari biaya transaksi KPP masuk ke anggota kami pada tanggal 9 setiap bulan!",
        benefitNote: "Dan itu tidak sedikit!",
        price: "20 WLD",
        priceForever: "selamanya!",
        priceExplanation: "Itu berarti Anda membayar 20 WLD dan mendapatkan biaya selamanya!",
        becomeButton: "Menjadi Anggota",
        processing: "Memproses...",
        paymentInfo: "Informasi Pembayaran",
        destinationWallet: "Dompet Tujuan:",
        afterPayment: "Setelah Pembayaran",
        contactSupport: "Setelah pembayaran, hubungi tim dukungan com a tangkapan layar ke:",
        tip: "Tip:",
        tipDescription: "Sertakan tangkapan layar transaksi e o endereço da sua carteira no email.",
      },
      kstaking: {
        title: "KPP Staking",
        subtitle:
          "Hanya com KPP você tem direito a ganhos passivos de outros tokens, quanto mais KPP você tiver, mais você ganha!",
        yourBalance: "Seu Saldo KPP:",
        pendingRewards: "Recompensas Pendentes:",
        lastClaim: "Último Claim:",
        totalClaimed: "Total Reivindicado:",
        contractAPY: "APY do Contrato:",
        contractBalance: "Saldo de Recompensa do Contrato:",
        claimRewardsButton: "Reivindicar Recompensas",
        processingClaim: "Processando Reivindicação...",
        claimSuccess: "Recompensas reivindicadas com sucesso!",
        claimError: "Falha ao reivindicar recompensas.",
        noKPPBalance: "Nenhum token KPP na carteira para stake.",
        noRewardsToClaim: "Nenhuma recompensa para reivindicar.",
        insufficientContractBalance: "Saldo de recompensa insuficiente no contrato.",
        connectWalletToStake: "Conecte sua carteira para ver os detalhes do staking.",
        lastClaimTime: "Última Hora de Reivindicação:",
        notClaimedYet: "Ainda não reivindicado",
        rewardsPerDay: "Recompensas por dia:",
        rewardsPerYear: "Recompensas por ano:",
        dismiss: "Dispensar",
        powerActivated: "Energia Ativada",
      },
    },
  }

  return translations[lang] || translations["en"]
}

// Hook para usar traduções em componentes
export function useTranslation() {
  const [language, setLanguage] = useState<Language>(getCurrentLanguage())

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
