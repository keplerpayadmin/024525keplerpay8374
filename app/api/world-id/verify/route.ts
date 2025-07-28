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

    console.log("=== World ID Verify Backend API START ===")
    console.log("Received payload:", JSON.stringify(payload, null, 2))
    console.log("Received action:", action)
    console.log("Received signal:", signal)

    // Certifique-se de que APP_ID está configurado nas suas variáveis de ambiente do Vercel.
    // Este APP_ID deve ser o mesmo usado no MiniKitProvider no frontend.
    const app_id = process.env.APP_ID as `app_${string}` // Usando APP_ID conforme seu prompt

    if (!app_id) {
      console.error("❌ APP_ID environment variable is not set.")
      return NextResponse.json(
        {
          status: 500,
          message: "Server configuration error: APP_ID is missing.",
          verified: false,
        },
        { status: 500 },
      )
    }
    console.log("Using APP_ID:", app_id)

    console.log("Calling verifyCloudProof...")
    const verifyRes = (await verifyCloudProof(payload, app_id, action, signal)) as IVerifyResponse
    console.log("Response from verifyCloudProof:", JSON.stringify(verifyRes, null, 2))

    if (verifyRes.success) {
      console.log("✅ World ID proof verified successfully!")
      // Aqui você pode adicionar lógica para atualizar seu banco de dados, etc.
      return NextResponse.json(
        {
          status: 200,
          message: "Verification successful",
          verified: true,
          data: verifyRes,
        },
        { status: 200 },
      )
    } else {
      console.error("❌ World ID proof verification failed.")
      let errorMessage = "Verificação falhou."
      if (verifyRes.detail?.includes("already verified")) {
        errorMessage = "Você já verificou seu World ID para esta ação."
      } else if (verifyRes.detail) {
        errorMessage = verifyRes.detail
      }

      return NextResponse.json(
        {
          status: 400,
          message: errorMessage,
          verified: false,
          data: verifyRes,
        },
        { status: 400 },
      )
    }
  } catch (error: any) {
    console.error("=== World ID Verify Backend API ERROR ===")
    console.error("Error type:", typeof error)
    console.error("Error message:", error.message)
    console.error("Error stack:", error.stack)
    console.error("Full error object:", error)
    console.error("=== END ERROR ===")

    return NextResponse.json(
      {
        status: 500,
        message: "Erro interno do servidor durante a verificação.",
        verified: false,
        details: error.message,
      },
      { status: 500 },
    )
  } finally {
    console.log("=== World ID Verify Backend API END ===")
  }
}
