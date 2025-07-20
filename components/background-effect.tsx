"use client"

import { useEffect, useRef } from "react"

export function BackgroundEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Define as dimensões do canvas
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    interface Line {
      x: number
      y: number
      length: number
      speed: number
      opacity: number
    }

    const lines: Line[] = []
    const lineCount = 40 // Número de linhas

    // Inicializa as linhas
    for (let i = 0; i < lineCount; i++) {
      lines.push({
        x: Math.random() * canvas.width, // Posição inicial aleatória
        y: Math.random() * canvas.height,
        length: Math.random() * 100 + 50, // Comprimento da linha
        speed: Math.random() * 0.5 + 0.1, // Velocidade de movimento
        opacity: Math.random() * 0.3 + 0.05, // Opacidade da linha
      })
    }

    // Loop de animação
    const animate = () => {
      // Limpa o canvas e desenha um fundo escuro
      ctx.fillStyle = "#121212" // Fundo muito escuro
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Atualiza e desenha as linhas
      lines.forEach((line) => {
        line.x += line.speed // Move a linha para a direita

        // Se a linha sair da tela à direita, reinicia-a à esquerda
        if (line.x > canvas.width) {
          line.x = -line.length // Reinicia fora da tela à esquerda
          line.y = Math.random() * canvas.height // Nova posição Y aleatória
          line.speed = Math.random() * 0.5 + 0.1 // Nova velocidade
          line.opacity = Math.random() * 0.3 + 0.05 // Nova opacidade
        }

        // Desenha a linha
        ctx.beginPath()
        ctx.moveTo(line.x, line.y)
        ctx.lineTo(line.x + line.length, line.y)
        ctx.strokeStyle = `rgba(255, 255, 255, ${line.opacity})` // Linhas brancas
        ctx.lineWidth = 1 // Espessura da linha
        ctx.stroke()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full -z-10" />
      {/* Adiciona uma sobreposição sutil para escurecer um pouco o fundo e dar profundidade */}
      <div className="fixed inset-0 bg-black/30 -z-10" />
    </>
  )
}
