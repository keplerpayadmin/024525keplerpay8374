import { type NextRequest, NextResponse } from "next/server"
import { verifyCloudProof, type IVerifyResponse, type ISuccessResult } from "@worldcoin/minikit-js"

interface IRequestPayload {
  payload: ISuccessResult
  action: string
  signal: string | undefined
}

export async function POST(req: NextRequest) {
  try {
    const { payload, action, signal } = (await req.json()) as IRequestPayload

    // Ensure APP_ID is set in your environment variables
    const app_id = process.env.NEXT_PUBLIC_APP_ID as `app_${string}` // Use NEXT_PUBLIC_APP_ID as it's used in MiniKitProvider

    if (!app_id) {
      console.error("APP_ID environment variable is not set.")
      return NextResponse.json({
        status: 500,
        message: "Server configuration error: APP_ID is missing.",
        verified: false,
      })
    }

    console.log("Verifying World ID proof with payload:", payload)
    console.log("Action:", action)
    console.log("Signal:", signal)
    console.log("App ID:", app_id)

    const verifyRes = (await verifyCloudProof(payload, app_id, action, signal)) as IVerifyResponse

    if (verifyRes.success) {
      console.log("World ID proof verified successfully:", verifyRes)
      // Here you would typically update your database to mark the user as verified
      return NextResponse.json({
        status: 200,
        message: "Verification successful",
        verified: true,
        data: verifyRes,
      })
    } else {
      console.error("World ID proof verification failed:", verifyRes)
      // Handle specific errors from World ID /verify endpoint
      let errorMessage = "Verificação falhou."
      if (verifyRes.detail?.includes("already verified")) {
        errorMessage = "Você já verificou seu World ID para esta ação."
      } else if (verifyRes.detail) {
        errorMessage = verifyRes.detail
      }

      return NextResponse.json({
        status: 400,
        message: errorMessage,
        verified: false,
        data: verifyRes,
      })
    }
  } catch (error: any) {
    console.error("Error in World ID verification API:", error)
    return NextResponse.json({
      status: 500,
      message: "Erro interno do servidor durante a verificação.",
      verified: false,
      details: error.message,
    })
  }
}
