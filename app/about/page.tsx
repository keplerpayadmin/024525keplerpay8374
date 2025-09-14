import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-4 sm:p-8 relative">
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-50">
        <Link
          href="/dashboard" // Link de volta para o dashboard
          className="flex items-center gap-2 px-4 py-2 bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-full text-white hover:bg-gray-800/80 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Go Back</span>
        </Link>
      </div>

      <div className="max-w-3xl mx-auto text-center mt-16 sm:mt-24">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-200 via-white to-gray-300">
          KeplerPay App – Start Your Journey into Real Utility
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 mb-10 leading-relaxed">
          The KeplerPay App is your entry point into a transparent, reward-driven Web3 ecosystem.
        </p>

        <div className="bg-gray-900/70 backdrop-blur-md rounded-xl p-6 sm:p-8 mb-10 border border-gray-700/50 shadow-xl">
          <p className="text-md sm:text-lg text-gray-200 mb-6 leading-relaxed">
            Right now, you can stake your KPP and earn up to{" "}
            <span className="text-yellow-400 font-semibold">12% APY</span>, plus receive daily login bonuses – simply
            for staying active.
          </p>

          <h2 className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-4">Current Features:</h2>
          <ul className="list-disc list-inside text-left text-gray-300 space-y-2 mb-8 text-md sm:text-lg">
            <li>KPP Staking with up to 12% annual rewards</li>
            <li>Daily Login Bonus – get rewarded every day you log in</li>
            <li>Real-time balance and earnings overview</li>
          </ul>

          <h2 className="text-2xl sm:text-3xl font-bold text-cyan-400 mb-4">Coming Soon:</h2>
          <ul className="list-disc list-inside text-left text-gray-300 space-y-2 text-md sm:text-lg">
            <li>In-app wallet & QR payments</li>
            <li>Stablecoin integration & token swap</li>
            <li>Institutional partnerships (hospitals, schools, NGOs)</li>
          </ul>
        </div>

        <p className="text-xl sm:text-2xl font-bold text-yellow-400 mb-12">Stake. Earn. Be part of something real.</p>

        <div className="text-gray-500 text-sm mt-16">
          Developed By <span className="text-gray-400 font-medium">@PulseCode</span>
        </div>
      </div>
    </div>
  )
}
