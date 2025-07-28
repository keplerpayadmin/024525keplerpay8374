"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export function BackButton() {
  const router = useRouter()
  return (
    <Button
      variant="ghost"
      size="icon"
      className="absolute top-4 left-4 z-20 text-white hover:bg-gray-800"
      onClick={() => router.back()}
      aria-label="Go back"
    >
      <ChevronLeft className="h-6 w-6" />
    </Button>
  )
}
