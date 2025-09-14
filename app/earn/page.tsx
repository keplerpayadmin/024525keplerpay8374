"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { MiniKit } from "@worldcoin/minikit-js"

const Button = ({ children, onClick, disabled, className, ...props }: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 px-4 py-2 ${className}`}
    {...props}
  >
    {children}
  </button>
)

const Card = ({ children, className, ...props }: any) => (
  <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} {...props}>
    {children}
  </div>
)

const CardContent = ({ children, className, ...props }: any) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
)

const Progress = ({ value, className, ...props }: any) => (
  <div className={`relative h-4 w-full overflow-hidden rounded-full bg-secondary ${className}`} {...props}>
    <div
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </div>
)

// Smart contract configuration
const AIRDROP_CONTRACT_ADDRESS = "0x2E1D3Ec60CC6640249A515d5B3A2CAe711508CCf"
const AIRDROP_CONTRACT_ABI = [
  {
    inputs: [],
    name: "claimAirdrop",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "tokensPerClaim",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_user", type: "address" }],
    name: "getTodaysClaims",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "contractBalance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
]

const quizThemes = {
  astronomy: {
    title: "Astronomy & Space",
    description: "Explore the cosmos and test your knowledge of planets, stars, and space exploration",
    color: "blue",
    questions: [
      {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter"],
        correct: 1,
      },
      {
        question: "Who discovered the laws of planetary motion?",
        options: ["Galileo Galilei", "Johannes Kepler", "Isaac Newton"],
        correct: 1,
      },
      {
        question: "What is the largest planet in our solar system?",
        options: ["Jupiter", "Saturn", "Neptune"],
        correct: 0,
      },
      {
        question: "Which star is at the center of our solar system?",
        options: ["The Sun", "Polaris", "Sirius"],
        correct: 0,
      },
      {
        question: "Which constellation is also called 'The Hunter'?",
        options: ["Orion", "Draco", "Ursa Major"],
        correct: 0,
      },
      {
        question: "How many planets are in our solar system?",
        options: ["8", "9", "10"],
        correct: 0,
      },
      {
        question: "What is the closest planet to the Sun?",
        options: ["Mercury", "Earth", "Venus"],
        correct: 0,
      },
      {
        question: "What galaxy do we live in?",
        options: ["Andromeda", "Milky Way", "Sombrero Galaxy"],
        correct: 1,
      },
      {
        question: "Which planet is famous for its rings?",
        options: ["Uranus", "Neptune", "Saturn"],
        correct: 2,
      },
      {
        question: "What is the brightest star in the night sky (after the Sun)?",
        options: ["Sirius", "Vega", "Betelgeuse"],
        correct: 0,
      },
      {
        question: "Which planet is called the 'Morning Star'?",
        options: ["Mars", "Venus", "Jupiter"],
        correct: 1,
      },
      {
        question: "Which planet has the fastest rotation?",
        options: ["Jupiter", "Earth", "Neptune"],
        correct: 0,
      },
      {
        question: "Which is the hottest planet in our solar system?",
        options: ["Venus", "Mercury", "Mars"],
        correct: 0,
      },
      {
        question: "How long does Earth take to orbit the Sun?",
        options: ["365 days", "180 days", "400 days"],
        correct: 0,
      },
      {
        question: "Which telescope was launched in 1990 and still orbits Earth?",
        options: ["Hubble Space Telescope", "James Webb Telescope", "Kepler Telescope"],
        correct: 0,
      },
      {
        question: "Which is the coldest planet in our solar system?",
        options: ["Uranus", "Neptune", "Pluto"],
        correct: 0,
      },
      {
        question: "Which planet is famous for its Great Red Spot?",
        options: ["Saturn", "Jupiter", "Mars"],
        correct: 1,
      },
      {
        question: "What shape are planetary orbits according to Kepler?",
        options: ["Circular", "Elliptical", "Square"],
        correct: 1,
      },
      {
        question: "Which planet is tilted on its side (rotates almost horizontally)?",
        options: ["Uranus", "Neptune", "Venus"],
        correct: 0,
      },
      {
        question: "How many moons does Mars have?",
        options: ["2", "1", "3"],
        correct: 0,
      },
      {
        question: "Which constellation is known as 'The Big Dipper'?",
        options: ["Ursa Major", "Orion", "Cassiopeia"],
        correct: 0,
      },
      {
        question: "What is the closest star system to Earth?",
        options: ["Alpha Centauri", "Betelgeuse", "Andromeda"],
        correct: 0,
      },
      {
        question: "What protects Earth from harmful solar radiation?",
        options: ["Atmosphere", "Magnetic field", "Gravity"],
        correct: 1,
      },
      {
        question: "What is the name of the first man on the Moon?",
        options: ["Neil Armstrong", "Yuri Gagarin", "Buzz Aldrin"],
        correct: 0,
      },
      {
        question: "What is the speed of light?",
        options: ["300,000 km/s", "150,000 km/s", "1,000,000 km/s"],
        correct: 0,
      },
    ],
  },
  history: {
    title: "History & Cultures",
    description: "Journey through time and explore civilizations, events, and historical figures",
    color: "amber",
    questions: [
      {
        question: "Who was the first President of the United States?",
        options: ["Thomas Jefferson", "George Washington", "Abraham Lincoln"],
        correct: 1,
      },
      {
        question: "In which year did the Berlin Wall fall?",
        options: ["1989", "1991", "1985"],
        correct: 0,
      },
      {
        question: "Which civilization built the Pyramids of Giza?",
        options: ["Romans", "Egyptians", "Babylonians"],
        correct: 1,
      },
      {
        question: "Who painted the 'Mona Lisa'?",
        options: ["Leonardo da Vinci", "Michelangelo", "Pablo Picasso"],
        correct: 0,
      },
      {
        question: "Where were the first modern Olympic Games held in 1896?",
        options: ["Rome", "Athens", "Paris"],
        correct: 1,
      },
      {
        question: "Which emperor initiated the building of the Great Wall of China?",
        options: ["Qin Shi Huang", "Kublai Khan", "Mao Zedong"],
        correct: 0,
      },
      {
        question: "Who was the first woman in space?",
        options: ["Valentina Tereshkova", "Sally Ride", "Svetlana Savitskaya"],
        correct: 0,
      },
      {
        question: "Which city was destroyed by Mount Vesuvius in 79 AD?",
        options: ["Athens", "Pompeii", "Troy"],
        correct: 1,
      },
      {
        question: "Who wrote 'Romeo and Juliet'?",
        options: ["Charles Dickens", "William Shakespeare", "Mark Twain"],
        correct: 1,
      },
      {
        question: "Which war was fought between 1914-1918?",
        options: ["World War I", "World War II", "Korean War"],
        correct: 0,
      },
      {
        question: "Who was the first person to circumnavigate the globe?",
        options: ["Christopher Columbus", "Ferdinand Magellan", "Vasco da Gama"],
        correct: 1,
      },
      {
        question: "In which year did the Titanic sink?",
        options: ["1912", "1914", "1910"],
        correct: 0,
      },
      {
        question: "Which ancient wonder was located in Alexandria?",
        options: ["Colossus of Rhodes", "Lighthouse of Alexandria", "Hanging Gardens"],
        correct: 1,
      },
      {
        question: "Who was the last Pharaoh of Egypt?",
        options: ["Cleopatra VII", "Nefertiti", "Hatshepsut"],
        correct: 0,
      },
      {
        question: "Which empire was ruled by Julius Caesar?",
        options: ["Greek Empire", "Roman Empire", "Byzantine Empire"],
        correct: 1,
      },
      {
        question: "In which year did World War II end?",
        options: ["1945", "1944", "1946"],
        correct: 0,
      },
      {
        question: "Who invented the printing press?",
        options: ["Johannes Gutenberg", "Leonardo da Vinci", "Benjamin Franklin"],
        correct: 0,
      },
      {
        question: "Which revolution began in 1789?",
        options: ["American Revolution", "French Revolution", "Industrial Revolution"],
        correct: 1,
      },
      {
        question: "Who was the first person to reach the South Pole?",
        options: ["Robert Falcon Scott", "Roald Amundsen", "Ernest Shackleton"],
        correct: 1,
      },
      {
        question: "Which ancient city was known as the 'Cradle of Democracy'?",
        options: ["Rome", "Athens", "Sparta"],
        correct: 1,
      },
      {
        question: "Who was the longest-reigning British monarch before Elizabeth II?",
        options: ["Queen Victoria", "King George III", "King Henry VIII"],
        correct: 0,
      },
      {
        question: "Which wall was built by the Romans in northern England?",
        options: ["Antonine Wall", "Hadrian's Wall", "Offa's Dyke"],
        correct: 1,
      },
      {
        question: "In which year did the American Civil War begin?",
        options: ["1861", "1865", "1859"],
        correct: 0,
      },
      {
        question: "Who was the first Emperor of Rome?",
        options: ["Julius Caesar", "Augustus", "Nero"],
        correct: 1,
      },
      {
        question: "Which explorer discovered America in 1492?",
        options: ["Christopher Columbus", "Amerigo Vespucci", "Leif Erikson"],
        correct: 0,
      },
    ],
  },
  crypto: {
    title: "WorldChain & Crypto",
    color: "green",
    questions: [
      {
        question: "What does KPP stand for?",
        options: ["KeplerPay", "KeplerPoint", "KeplerProject"],
        correct: 0,
      },
      {
        question: "Which alliance is KeplerPay part of?",
        options: ["GlobalChain", "WorldChain Alliance", "MetaChain"],
        correct: 1,
      },
      {
        question: "What is the main utility of KeplerPay ($KPP)?",
        options: ["Meme trading only", "Real-world payments and rewards", "Mining Bitcoin"],
        correct: 1,
      },
      {
        question: "Which app supports KeplerPay rewards and staking?",
        options: ["PUF App", "TikTok", "Facebook"],
        correct: 0,
      },
      {
        question: "How much of KeplerPay's supply has already been burned (2025)?",
        options: ["1%", "3%+", "0.5%"],
        correct: 1,
      },
      {
        question: "Which blockchain is KeplerPay built on?",
        options: ["Ethereum", "WorldChain", "Solana"],
        correct: 1,
      },
      {
        question: "What is Bitcoin's maximum supply?",
        options: ["21 million", "100 million", "No limit"],
        correct: 0,
      },
      {
        question: "Who created Bitcoin?",
        options: ["Vitalik Buterin", "Satoshi Nakamoto", "Elon Musk"],
        correct: 1,
      },
      {
        question: "What does DeFi stand for?",
        options: ["Digital Finance", "Decentralized Finance", "Distributed Finance"],
        correct: 1,
      },
      {
        question: "Which consensus mechanism does Bitcoin use?",
        options: ["Proof of Stake", "Proof of Work", "Delegated Proof of Stake"],
        correct: 1,
      },
      {
        question: "What is a smart contract?",
        options: ["A legal document", "Self-executing code on blockchain", "A trading strategy"],
        correct: 1,
      },
      {
        question: "Which year was Bitcoin created?",
        options: ["2008", "2009", "2010"],
        correct: 1,
      },
      {
        question: "What does HODL mean in crypto?",
        options: ["Hold On for Dear Life", "High Order Digital Ledger", "Hold On, Don't Leave"],
        correct: 0,
      },
      {
        question: "What is a blockchain?",
        options: ["A type of cryptocurrency", "A distributed ledger technology", "A mining device"],
        correct: 1,
      },
      {
        question: "Which platform introduced smart contracts?",
        options: ["Bitcoin", "Ethereum", "Litecoin"],
        correct: 1,
      },
      {
        question: "What is the process of creating new cryptocurrency called?",
        options: ["Mining", "Staking", "Farming"],
        correct: 0,
      },
      {
        question: "What does NFT stand for?",
        options: ["New Financial Token", "Non-Fungible Token", "Network File Transfer"],
        correct: 1,
      },
      {
        question: "Which crypto exchange was founded by Changpeng Zhao?",
        options: ["Coinbase", "Binance", "Kraken"],
        correct: 1,
      },
      {
        question: "What is a wallet in cryptocurrency?",
        options: ["A physical device", "Software to store crypto", "Both A and B"],
        correct: 2,
      },
      {
        question: "What does DAO stand for?",
        options: [
          "Digital Asset Organization",
          "Decentralized Autonomous Organization",
          "Distributed Application Operation",
        ],
        correct: 1,
      },
      {
        question: "Which cryptocurrency is known as 'digital silver'?",
        options: ["Ethereum", "Litecoin", "Ripple"],
        correct: 1,
      },
      {
        question: "What is the smallest unit of Bitcoin?",
        options: ["Satoshi", "Wei", "Gwei"],
        correct: 0,
      },
      {
        question: "Which consensus mechanism is more energy-efficient?",
        options: ["Proof of Work", "Proof of Stake", "Both are equal"],
        correct: 1,
      },
      {
        question: "What is a fork in blockchain?",
        options: ["A mining tool", "A change in protocol rules", "A type of wallet"],
        correct: 1,
      },
      {
        question: "Which company's CEO is known for promoting Dogecoin?",
        options: ["Tesla", "Microsoft", "Apple"],
        correct: 0,
      },
    ],
  },
  general: {
    title: "General Knowledge & Science",
    description: "Challenge yourself with questions from science, geography, literature, and more",
    color: "purple",
    questions: [
      {
        question: "What is the chemical symbol for water?",
        options: ["O2", "H2O", "CO2"],
        correct: 1,
      },
      {
        question: "How many continents are there on Earth?",
        options: ["5", "6", "7"],
        correct: 2,
      },
      {
        question: "Who wrote the play 'Romeo and Juliet'?",
        options: ["Charles Dickens", "William Shakespeare", "Mark Twain"],
        correct: 1,
      },
      {
        question: "What is the capital of Japan?",
        options: ["Kyoto", "Tokyo", "Osaka"],
        correct: 1,
      },
      {
        question: "Which gas do humans need to breathe?",
        options: ["Oxygen", "Carbon dioxide", "Nitrogen"],
        correct: 0,
      },
      {
        question: "Who was the first person to step on the Moon?",
        options: ["Buzz Aldrin", "Yuri Gagarin", "Neil Armstrong"],
        correct: 2,
      },
      {
        question: "What is the fastest land animal?",
        options: ["Lion", "Cheetah", "Horse"],
        correct: 1,
      },
      {
        question: "How many sides does a hexagon have?",
        options: ["5", "6", "7"],
        correct: 1,
      },
      {
        question: "What is the largest ocean on Earth?",
        options: ["Atlantic", "Pacific", "Indian"],
        correct: 1,
      },
      {
        question: "Which planet is closest to Earth?",
        options: ["Mars", "Venus", "Mercury"],
        correct: 1,
      },
      {
        question: "What is the hardest natural substance?",
        options: ["Gold", "Diamond", "Iron"],
        correct: 1,
      },
      {
        question: "How many bones are in the adult human body?",
        options: ["206", "208", "210"],
        correct: 0,
      },
      {
        question: "What is the capital of Australia?",
        options: ["Sydney", "Melbourne", "Canberra"],
        correct: 2,
      },
      {
        question: "What is the largest mammal in the world?",
        options: ["Elephant", "Blue Whale", "Giraffe"],
        correct: 1,
      },
      {
        question: "Which element has the chemical symbol 'O'?",
        options: ["Oxygen", "Gold", "Silver"],
        correct: 0,
      },
      {
        question: "How many chambers does a human heart have?",
        options: ["2", "3", "4"],
        correct: 2,
      },
      {
        question: "What is the smallest country in the world?",
        options: ["Monaco", "Vatican City", "San Marino"],
        correct: 1,
      },
      {
        question: "Which organ in the human body produces insulin?",
        options: ["Liver", "Pancreas", "Kidney"],
        correct: 1,
      },
      {
        question: "What is the longest river in the world?",
        options: ["Amazon", "Nile", "Mississippi"],
        correct: 1,
      },
      {
        question: "How many teeth does an adult human typically have?",
        options: ["28", "30", "32"],
        correct: 2,
      },
      {
        question: "What is the study of earthquakes called?",
        options: ["Geology", "Seismology", "Meteorology"],
        correct: 1,
      },
      {
        question: "Which blood type is known as the universal donor?",
        options: ["A", "B", "O"],
        correct: 2,
      },
      {
        question: "What is the largest desert in the world?",
        options: ["Sahara", "Antarctica", "Gobi"],
        correct: 1,
      },
      {
        question: "How many strings does a standard guitar have?",
        options: ["4", "6", "8"],
        correct: 1,
      },
      {
        question: "What is the currency of the United Kingdom?",
        options: ["Euro", "Dollar", "Pound"],
        correct: 2,
      },
    ],
  },
}

function KeplerQuiz() {
  const [gameState, setGameState] = useState("theme-selection") // theme-selection, playing, finished
  const [selectedTheme, setSelectedTheme] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [kppEarned, setKppEarned] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [questions, setQuestions] = useState([])
  const [showKppModal, setShowKppModal] = useState(false)
  const [isClaimingReward, setIsClaimingReward] = useState(false)
  const [claimStatus, setClaimStatus] = useState("")
  const router = useRouter()

  // Timer effect
  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !showResult) {
      handleTimeUp()
    }
  }, [timeLeft, gameState, showResult])

  const handleTimeUp = () => {
    setShowResult(true)
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setSelectedAnswer(null)
        setShowResult(false)
        setTimeLeft(30)
      } else {
        setGameState("finished")
      }
    }, 2000)
  }

  const selectTheme = (themeKey) => {
    const theme = quizThemes[themeKey]
    setSelectedTheme(theme)

    // Shuffle and select 25 random questions
    const shuffled = [...theme.questions].sort(() => 0.5 - Math.random())
    setQuestions(shuffled.slice(0, 25))

    setGameState("playing")
    setCurrentQuestionIndex(0)
    setScore(0)
    setKppEarned(0)
    setTimeLeft(30)
  }

  const handleAnswer = (answerIndex) => {
    if (selectedAnswer !== null || showResult) return

    setSelectedAnswer(answerIndex)
    setShowResult(true)

    const isCorrect = answerIndex === questions[currentQuestionIndex].correct
    if (isCorrect) {
      const newScore = score + 1
      setScore(newScore)

      // Check if player earned KPP (every 5 correct answers)
      if (newScore % 5 === 0) {
        setKppEarned(kppEarned + 1)
        setShowKppModal(true)
      }
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setSelectedAnswer(null)
        setShowResult(false)
        setTimeLeft(30)
      } else {
        setGameState("finished")
      }
    }, 2000)
  }

  const claimReward = async () => {
    if (isClaimingReward) return

    setIsClaimingReward(true)
    setClaimStatus("Preparing transaction...")

    try {
      if (!MiniKit.isInstalled()) {
        throw new Error("MiniKit not installed")
      }

      setClaimStatus("Sending transaction...")

      const response = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: AIRDROP_CONTRACT_ADDRESS,
            abi: AIRDROP_CONTRACT_ABI,
            functionName: "claimAirdrop",
            args: [],
          },
        ],
      })

      if (response.commandPayload.status === "success") {
        setClaimStatus("Reward claimed successfully! 🎉")
        setTimeout(() => {
          setShowKppModal(false)
          setClaimStatus("")
        }, 2000)
      } else {
        throw new Error("Transaction failed")
      }
    } catch (error) {
      console.error("Error claiming reward:", error)
      setClaimStatus("Failed to claim reward. Please try again.")
      setTimeout(() => {
        setClaimStatus("")
      }, 3000)
    } finally {
      setIsClaimingReward(false)
    }
  }

  const resetGame = () => {
    setGameState("theme-selection")
    setSelectedTheme(null)
    setCurrentQuestionIndex(0)
    setScore(0)
    setKppEarned(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setTimeLeft(30)
    setQuestions([])
  }

  const goBackToThemes = () => {
    setGameState("theme-selection")
    setSelectedTheme(null)
    setCurrentQuestionIndex(0)
    setScore(0)
    setKppEarned(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setTimeLeft(30)
    setQuestions([])
  }

  const getThemeColors = (color) => {
    const colors = {
      blue: {
        bg: "from-gray-900 to-black",
        accent: "bg-blue-500",
        text: "text-white",
        border: "border-blue-400",
        hover: "hover:bg-gray-800",
      },
      amber: {
        bg: "from-gray-900 to-black",
        accent: "bg-amber-500",
        text: "text-white",
        border: "border-amber-400",
        hover: "hover:bg-gray-800",
      },
      green: {
        bg: "from-gray-900 to-black",
        accent: "bg-green-500",
        text: "text-white",
        border: "border-green-400",
        hover: "hover:bg-gray-800",
      },
      purple: {
        bg: "from-gray-900 to-black",
        accent: "bg-purple-500",
        text: "text-white",
        border: "border-purple-400",
        hover: "hover:bg-gray-800",
      },
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {gameState === "theme-selection" && (
        <>
          {/* Back Button */}
          <div className="absolute top-4 left-4 z-50">
            <Button onClick={() => router.back()} className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </div>
        </>
      )}

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {gameState === "theme-selection" ? (
          <>
            <div className="text-center mb-8">
              <Image
                src="/keplerlogo.png"
                alt="Kepler Logo"
                width={120}
                height={120}
                className="mx-auto mb-6 filter brightness-0 invert"
              />
              <h1 className="text-4xl font-bold mb-4 text-white drop-shadow-2xl">Choose Your Quiz Theme</h1>
              <p className="text-white text-lg">Select a topic and test your knowledge with 25 questions!</p>
              <p className="text-yellow-400 text-sm mt-2">(Earn 1 KPP for every 5 correct answers)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
              {Object.entries(quizThemes).map(([key, theme]) => {
                const colors = getThemeColors(theme.color)
                return (
                  <div
                    key={key}
                    className={`bg-gradient-to-br ${colors.bg} border-2 ${colors.border} cursor-pointer transform transition-all duration-300 hover:scale-105 ${colors.hover} shadow-2xl rounded-lg p-6 text-center`}
                    onClick={() => selectTheme(key)}
                  >
                    <h3 className="text-2xl font-bold mb-6 text-white">{theme.title}</h3>
                    <div className="mt-4">
                      <div
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${colors.accent} text-white border-none`}
                      >
                        25 Questions
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        ) : (
          <KeplerQuizComponent
            gameState={gameState}
            setGameState={setGameState}
            selectedTheme={selectedTheme}
            setSelectedTheme={setSelectedTheme}
            currentQuestionIndex={currentQuestionIndex}
            setCurrentQuestionIndex={setCurrentQuestionIndex}
            score={score}
            setScore={setScore}
            kppEarned={kppEarned}
            setKppEarned={setKppEarned}
            selectedAnswer={selectedAnswer}
            setSelectedAnswer={setSelectedAnswer}
            showResult={showResult}
            setShowResult={setShowResult}
            timeLeft={timeLeft}
            setTimeLeft={setTimeLeft}
            questions={questions}
            setQuestions={setQuestions}
            showKppModal={showKppModal}
            setShowKppModal={setShowKppModal}
            isClaimingReward={isClaimingReward}
            claimStatus={claimStatus}
            claimReward={claimReward}
            goBackToThemes={goBackToThemes}
            getThemeColors={getThemeColors}
          />
        )}
      </div>
    </div>
  )
}

function KeplerQuizComponent({
  gameState,
  setGameState,
  selectedTheme,
  setSelectedTheme,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  score,
  setScore,
  kppEarned,
  setKppEarned,
  selectedAnswer,
  setSelectedAnswer,
  showResult,
  setShowResult,
  timeLeft,
  setTimeLeft,
  questions,
  setQuestions,
  showKppModal,
  setShowKppModal,
  isClaimingReward,
  claimStatus,
  claimReward,
  goBackToThemes,
  getThemeColors,
}: any) {
  // Timer effect
  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !showResult) {
      handleTimeUp()
    }
  }, [timeLeft, gameState, showResult])

  const handleTimeUp = () => {
    setShowResult(true)
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setSelectedAnswer(null)
        setShowResult(false)
        setTimeLeft(30)
      } else {
        setGameState("finished")
      }
    }, 2000)
  }

  const handleAnswer = (answerIndex) => {
    if (selectedAnswer !== null || showResult) return

    setSelectedAnswer(answerIndex)
    setShowResult(true)

    const isCorrect = answerIndex === questions[currentQuestionIndex].correct
    if (isCorrect) {
      const newScore = score + 1
      setScore(newScore)

      // Check if player earned KPP (every 5 correct answers)
      if (newScore % 5 === 0) {
        setKppEarned(kppEarned + 1)
        setShowKppModal(true)
      }
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setSelectedAnswer(null)
        setShowResult(false)
        setTimeLeft(30)
      } else {
        setGameState("finished")
      }
    }, 2000)
  }

  const resetGame = () => {
    setGameState("theme-selection")
    setSelectedTheme(null)
    setCurrentQuestionIndex(0)
    setScore(0)
    setKppEarned(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setTimeLeft(30)
    setQuestions([])
  }

  if (gameState === "playing") {
    const currentQuestion = questions[currentQuestionIndex]
    const colors = getThemeColors(selectedTheme.color)
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100

    return (
      <div className="min-h-screen bg-black text-white p-4">
        {/* KPP Earned Modal */}
        {showKppModal && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 p-8 rounded-2xl text-center max-w-md mx-4 border-4 border-yellow-400 shadow-2xl">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-white mb-4">Congratulations!</h2>
              <p className="text-xl text-yellow-100 mb-6">You earned 1 KPP!</p>

              {claimStatus && <p className="text-sm text-yellow-200 mb-4">{claimStatus}</p>}

              <Button
                onClick={claimReward}
                disabled={isClaimingReward}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-3 text-lg disabled:opacity-50"
              >
                {isClaimingReward ? "Claiming..." : "Claim Reward"}
              </Button>

              <Button
                onClick={() => setShowKppModal(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold px-4 py-2 text-sm mt-2 ml-2"
              >
                Skip
              </Button>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          {/* Header with Back Button */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <Button onClick={goBackToThemes} className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <Image
                src="/keplerpay-logo.png"
                alt="Kepler Logo"
                width={50}
                height={50}
                className="filter brightness-0 invert"
              />
              <div>
                <h1 className="text-2xl font-bold text-white">{selectedTheme.title}</h1>
                <p className="text-white text-sm">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <Progress value={progress} className="h-3" />
          </div>

          {/* Timer */}
          <div className="text-center mb-6">
            <div
              className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${colors.accent} text-white text-2xl font-bold ${timeLeft <= 10 ? "animate-pulse" : ""}`}
            >
              {timeLeft}
            </div>
          </div>

          {/* Question Card */}
          <Card className="bg-gray-900 border-gray-700 mb-6">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-8 text-center leading-relaxed">
                {currentQuestion.question}
              </h2>

              <div className="grid gap-4">
                {currentQuestion.options.map((option, index) => {
                  let buttonClass = "bg-gray-800 hover:bg-gray-700 text-white border-gray-600 p-6 text-lg h-auto"

                  if (showResult) {
                    if (index === currentQuestion.correct) {
                      buttonClass = "bg-green-600 text-white border-green-500 p-6 text-lg h-auto"
                    } else if (index === selectedAnswer && index !== currentQuestion.correct) {
                      buttonClass = "bg-red-600 text-white border-red-500 p-6 text-lg h-auto"
                    } else {
                      buttonClass = "bg-gray-700 text-gray-400 border-gray-600 p-6 text-lg h-auto"
                    }
                  }

                  return (
                    <Button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      disabled={showResult}
                      className={buttonClass}
                    >
                      {String.fromCharCode(65 + index)}. {option}
                    </Button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (gameState === "finished") {
    const colors = getThemeColors(selectedTheme.color)
    const percentage = Math.round((score / questions.length) * 100)

    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-4 pb-24">
          <div className="text-center max-w-2xl">
            <Image
              src="/keplerpay-logo.png"
              alt="Kepler Logo"
              width={120}
              height={120}
              className="mx-auto mb-6 filter brightness-0 invert"
            />

            <h1 className="text-4xl font-bold mb-6 text-white">Quiz Complete!</h1>

            <div className={`bg-gradient-to-br ${colors.bg} p-8 rounded-2xl border-2 ${colors.border} mb-8`}>
              <div className="text-6xl mb-4">{percentage >= 80 ? "🏆" : percentage >= 60 ? "🎉" : "📚"}</div>
              <h2 className="text-3xl font-bold text-white mb-4">Your Results</h2>
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-4xl font-bold text-white">{score}</div>
                  <div className="text-white text-lg">Correct Answers</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-yellow-400">{kppEarned}</div>
                  <div className="text-yellow-300 text-lg">KPP Earned</div>
                </div>
              </div>
              <div className="mt-6">
                <div className="text-2xl font-bold text-white">{percentage}%</div>
                <div className="text-white">Accuracy</div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={resetGame} className={`${colors.accent} hover:opacity-90 text-white px-8 py-3 text-lg`}>
                Play Again
              </Button>
              <Button
                onClick={() => setSelectedTheme(selectedTheme)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 text-lg"
              >
                Same Theme
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default function EarnPage() {
  return (
    <div className="min-h-screen bg-black">
      <KeplerQuiz />
    </div>
  )
}
