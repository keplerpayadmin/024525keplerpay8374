import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { type MiniAppWalletAuthSuccessPayload, verifySiweMessage } from "@worldcoin/minikit-js"

interface RequestPayload {
  payload: MiniAppWalletAuthSuccessPayload
  nonce: string
}

export async function POST(req: NextRequest) {
  try {
    const { payload, nonce } = (await req.json()) as RequestPayload

    // Verify nonce matches the one we created
    const storedNonce = cookies().get("siwe")?.value
    if (nonce !== storedNonce) {
      return NextResponse.json(
        {
          status: "error",
          isValid: false,
          message: "Invalid nonce",
        },
        { status: 400 },
      ) // Adicionado status 400 para bad request
    }

    // Verify the SIWE message
    const validMessage = await verifySiweMessage(payload, nonce)

    if (validMessage.isValid) {
      // Create session cookie
      cookies().set(
        "session",
        JSON.stringify({
          address: payload.address,
          timestamp: Date.now(),
        }),
        {
          secure: process.env.NODE_ENV === "production", // Usar secure em produção
          httpOnly: true,
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: "/", // Definir path para o cookie ser acessível em todo o site
        },
      )
    }

    return NextResponse.json({
      status: "success",
      isValid: validMessage.isValid,
    })
  } catch (error: any) {
    console.error("SIWE verification error:", error)
    return NextResponse.json(
      {
        status: "error",
        isValid: false,
        message: error.message || "Verification failed",
      },
      { status: 500 },
    ) // Adicionado status 500 para erro interno
  }
}
