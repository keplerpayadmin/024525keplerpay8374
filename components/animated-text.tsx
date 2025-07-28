"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils" // Ensure this import is correct

interface AnimatedTextProps {
  text: string
  className?: string
  delayPerChar?: number
  animationDuration?: number
}

export function AnimatedText({
  text,
  className,
  delayPerChar = 70, // Delay between each character in ms
  animationDuration = 500, // Duration of each character's animation in ms
}: AnimatedTextProps) {
  const [visibleChars, setVisibleChars] = useState<number>(0)

  useEffect(() => {
    if (visibleChars < text.length) {
      const timer = setTimeout(() => {
        setVisibleChars((prev) => prev + 1)
      }, delayPerChar)
      return () => clearTimeout(timer)
    }
  }, [visibleChars, text.length, delayPerChar])

  return (
    <h1 className={cn("text-4xl font-bold text-center", className)}>
      {text.split("").map((char, index) => (
        <span
          key={index}
          className="inline-block opacity-0 transform translate-y-4"
          style={{
            animation:
              index < visibleChars
                ? `fadeInUp ${animationDuration}ms ease-out forwards ${index * delayPerChar}ms`
                : "none",
          }}
        >
          {char === " " ? "\u00A0" : char} {/* Use non-breaking space for spaces */}
        </span>
      ))}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </h1>
  )
}
