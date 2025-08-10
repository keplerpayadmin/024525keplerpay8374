import { NextResponse } from "next/server"
import { generateNonce } from "siwe"
import { cookies } from "next/headers" // Importar cookies

export async function GET() {
  const nonce = generateNonce()
  cookies().set("siwe", nonce, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 5, // 5 minutes for nonce validity
    path: "/",
    sameSite: "lax",
  })
  return NextResponse.json({ nonce })
}
