'use client'
import confetti from 'canvas-confetti'

export function triggerConfetti() {
  confetti({
    particleCount: 120,
    spread: 70,
    origin: { x: 0.5, y: 0.8 },
    colors: ['#f59e0b', '#d97706', '#ffffff', '#fbbf24', '#fcd34d'],
    startVelocity: 45,
    gravity: 0.8,
  })
  setTimeout(() => confetti({
    particleCount: 60,
    spread: 50,
    origin: { x: 0.3, y: 0.8 },
    colors: ['#f59e0b', '#ffffff'],
    startVelocity: 35,
  }), 200)
  setTimeout(() => confetti({
    particleCount: 60,
    spread: 50,
    origin: { x: 0.7, y: 0.8 },
    colors: ['#f59e0b', '#ffffff'],
    startVelocity: 35,
  }), 400)
}
