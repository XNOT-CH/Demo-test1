import { useState } from 'react'
import './Confetti.css'

const SYMBOLS = ['🐾', '☕', '💗', '✨', '🐱']

function createPieces(count) {
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    symbol: SYMBOLS[index % SYMBOLS.length],
    left: Math.random() * 100,
    delay: Math.random() * 0.6,
    duration: 1.8 + Math.random() * 1.4,
    rotation: (Math.random() - 0.5) * 720,
    size: 14 + Math.random() * 14,
  }))
}

export default function Confetti({ count = 28 }) {
  // Lazy initial state: random values are generated once per mount.
  const [pieces] = useState(() => createPieces(count))

  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="confetti__piece"
          style={{
            left: `${piece.left}%`,
            fontSize: `${piece.size}px`,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            '--rotation': `${piece.rotation}deg`,
          }}
        >
          {piece.symbol}
        </span>
      ))}
    </div>
  )
}
