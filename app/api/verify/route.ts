import { verifyCloudProof, type IVerifyResponse, type ISuccessResult } from "@worldcoin/minikit-js"
import { type NextRequest, NextResponse } from "next/server"

interface IRequestPayload {
  payload: ISuccessResult
  action: string
  signal: string | undefined
}

export async function POST(req: NextRequest) {
  const { payload, action, signal } = (await req.json()) as IRequestPayload
  // Ensure APP_ID is set in your environment variables
  const app_id = process.env.APP_ID as `app_${string}`

  if (!app_id) {
    console.error("APP_ID environment variable is not set.")
    return NextResponse.json({ error: "Server configuration error: APP_ID is missing." }, { status: 500 })
  }

  const verifyRes = (await verifyCloudProof(payload, app_id, action, signal)) as IVerifyResponse

  console.log("World ID verification response:", verifyRes)

  if (verifyRes.success) {
    // This is where you should perform backend actions if the verification succeeds
    // Such as, setting a user as "verified" in a database
    return NextResponse.json({ verifyRes, status: 200 })
  } else {
    // This is where you should handle errors from the World ID /verify endpoint.
    // Usually these errors are due to a user having already verified.
    return NextResponse.json({ verifyRes, status: 400 })
  }
}
