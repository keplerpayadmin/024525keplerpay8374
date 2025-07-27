import { type NextRequest, NextResponse } from "next/server"
import { verifyCloudProof, type IVerifyResponse, type ISuccessResult } from "@worldcoin/minikit-js"

interface IRequestPayload {
  payload: ISuccessResult
  action: string
  signal: string | undefined
}

export async function POST(req: NextRequest) {
  const { payload, action, signal } = (await req.json()) as IRequestPayload
  // IMPORTANT: Replace 'app_9a78bc78d2107678fa4481a9432ad341' with your actual APP_ID from the Worldcoin Developer Portal.
  // It is highly recommended to store this in an environment variable (e.g., process.env.WORLD_ID_APP_ID)
  // and never hardcode it in production.
  const app_id = (process.env.WORLD_ID_APP_ID as `app_${string}`) || "app_9a78bc78d2107678fa4481a9432ad341" // Placeholder APP_ID from image

  try {
    const verifyRes = (await verifyCloudProof(payload, app_id, action, signal)) as IVerifyResponse

    if (verifyRes.success) {
      // This is where you should perform backend actions if the verification succeeds
      // Such as, setting a user as "verified" in a database
      console.log("Backend verification successful:", verifyRes)
      return NextResponse.json({ verifyRes, status: 200 })
    } else {
      // This is where you should handle errors from the World ID /verify endpoint.
      // Usually these errors are due to a user having already verified.
      console.error("Backend verification failed:", verifyRes)
      return NextResponse.json({ verifyRes, status: 400 })
    }
  } catch (error) {
    console.error("Error during backend proof verification:", error)
    return NextResponse.json({ error: (error as Error).message, status: 500 })
  }
}
