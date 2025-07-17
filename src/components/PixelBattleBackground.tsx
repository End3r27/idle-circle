import React, { useEffect, useState } from 'react'

interface PixelBattleBackgroundProps {
  environment?: 'dungeon' | 'forest' | 'desert' | 'ice' | 'volcano' | 'void' | 'celestial'
  intensity?: 'calm' | 'active' | 'intense'
  children?: React.ReactNode
}

export default function PixelBattleBackground({ 
  environment = 'dungeon', 
  intensity = 'active',
  children 
}: PixelBattleBackgroundProps) {
  const [particles, setParticles] = useState<number[]>([])

  useEffect(() => {
    // Generate particles based on intensity
    const particleCount = intensity === 'calm' ? 5 : intensity === 'active' ? 9 : 15
    setParticles(Array.from({ length: particleCount }, (_, i) => i))
  }, [intensity])

  const getEnvironmentStyles = () => {
    switch (environment) {
      case 'forest':
        return {
          background: `
            linear-gradient(180deg, #1a4d1a 0%, #0d2d0d 50%, #051505 100%),
            radial-gradient(circle at 20% 80%, rgba(34, 197, 94, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(34, 197, 94, 0.3) 0%, transparent 50%)
          `,
          particleColor: '#22c55e'
        }
      case 'desert':
        return {
          background: `
            linear-gradient(180deg, #8b4513 0%, #a0522d 50%, #654321 100%),
            radial-gradient(circle at 30% 70%, rgba(255, 165, 0, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 70% 30%, rgba(255, 140, 0, 0.2) 0%, transparent 50%)
          `,
          particleColor: '#ffa500'
        }
      case 'ice':
        return {
          background: `
            linear-gradient(180deg, #b0e0e6 0%, #4682b4 50%, #191970 100%),
            radial-gradient(circle at 25% 75%, rgba(173, 216, 230, 0.4) 0%, transparent 50%),
            radial-gradient(circle at 75% 25%, rgba(135, 206, 250, 0.3) 0%, transparent 50%)
          `,
          particleColor: '#87ceeb'
        }
      case 'volcano':
        return {
          background: `
            linear-gradient(180deg, #8b0000 0%, #ff4500 50%, #ff6347 100%),
            radial-gradient(circle at 40% 80%, rgba(255, 69, 0, 0.5) 0%, transparent 50%),
            radial-gradient(circle at 60% 20%, rgba(255, 99, 71, 0.4) 0%, transparent 50%)
          `,
          particleColor: '#ff4500'
        }
      case 'void':
        return {
          background: `
            linear-gradient(180deg, #000000 0%, #1a0033 50%, #330066 100%),
            radial-gradient(circle at 30% 70%, rgba(75, 0, 130, 0.6) 0%, transparent 50%),
            radial-gradient(circle at 70% 30%, rgba(138, 43, 226, 0.4) 0%, transparent 50%)
          `,
          particleColor: '#9370db'
        }
      case 'celestial':
        return {
          background: `
            linear-gradient(180deg, #ffd700 0%, #ffb347 50%, #ff8c00 100%),
            radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.4) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 140, 0, 0.3) 0%, transparent 50%)
          `,
          particleColor: '#ffd700'
        }
      default: // dungeon
        return {
          background: `
            linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%),
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)
          `,
          particleColor: '#7877c6'
        }
    }
  }

  const environmentStyles = getEnvironmentStyles()

  const getEnvironmentParticles = () => {
    switch (environment) {
      case 'forest':
        return '🍃'
      case 'desert':
        return '💨'
      case 'ice':
        return '❄️'
      case 'volcano':
        return '🔥'
      case 'void':
        return '✨'
      case 'celestial':
        return '⭐'
      default:
        return '💫'
    }
  }

  return (
    <div 
      className="battle-background"
      style={{ background: environmentStyles.background }}
    >
      {/* Pixel Grid Overlay */}
      <div className="pixel-grid" />
      
      {/* Animated Particles */}
      <div className="battle-particles">
        {particles.map((i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${10 + (i * 10)}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
              backgroundColor: environmentStyles.particleColor,
              fontSize: '12px'
            }}
          >
            {Math.random() > 0.7 ? getEnvironmentParticles() : ''}
          </div>
        ))}
      </div>

      {/* Battle Arena Floor */}
      <div className="absolute bottom-0 left-0 right-0 battle-arena">
        {/* Floor Pattern */}
        <div className="absolute inset-0 opacity-30">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className="absolute bottom-0 w-1 bg-gray-600"
              style={{
                left: `${i * 5}%`,
                height: `${10 + Math.random() * 5}px`,
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Environment-specific Effects */}
      {environment === 'volcano' && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-orange-500 rounded-full animate-bounce"
              style={{
                left: `${20 + i * 15}%`,
                bottom: `${10 + Math.random() * 20}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            />
          ))}
        </div>
      )}

      {environment === 'ice' && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="absolute text-blue-200 text-lg animate-pulse"
              style={{
                left: `${10 + i * 10}%`,
                top: `${10 + Math.random() * 60}%`,
                animationDelay: `${i * 0.4}s`
              }}
            >
              ❄️
            </div>
          ))}
        </div>
      )}

      {environment === 'forest' && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="absolute text-green-400 text-sm animate-pulse"
              style={{
                left: `${15 + i * 12}%`,
                top: `${20 + Math.random() * 40}%`,
                animationDelay: `${i * 0.6}s`
              }}
            >
              🌿
            </div>
          ))}
        </div>
      )}

      {environment === 'void' && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 10 }, (_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-purple-400 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      {environment === 'celestial' && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className="absolute text-yellow-300 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${8 + Math.random() * 8}px`,
                animationDelay: `${i * 0.3}s`
              }}
            >
              ✨
            </div>
          ))}
        </div>
      )}

      {/* Lightning Effect for Electric Environments */}
      {(environment === 'void' || intensity === 'intense') && (
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute inset-0 bg-white opacity-0 animate-pulse"
            style={{
              animation: 'lightningFlash 3s infinite',
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

// Environment selector component
export function BattleEnvironmentSelector({ 
  currentEnvironment, 
  onEnvironmentChange 
}: {
  currentEnvironment: string
  onEnvironmentChange: (env: string) => void
}) {
  const environments = [
    { id: 'dungeon', name: 'Dungeon', icon: '🏰', color: 'bg-gray-600' },
    { id: 'forest', name: 'Forest', icon: '🌲', color: 'bg-green-600' },
    { id: 'desert', name: 'Desert', icon: '🏜️', color: 'bg-yellow-600' },
    { id: 'ice', name: 'Ice Cave', icon: '🧊', color: 'bg-blue-600' },
    { id: 'volcano', name: 'Volcano', icon: '🌋', color: 'bg-red-600' },
    { id: 'void', name: 'Void', icon: '🌌', color: 'bg-purple-600' },
    { id: 'celestial', name: 'Celestial', icon: '☀️', color: 'bg-yellow-500' }
  ]

  return (
    <div className="flex flex-wrap gap-2 p-4 bg-black bg-opacity-50 rounded-lg">
      <div className="text-sm text-gray-300 mb-2 w-full">Battle Environment:</div>
      {environments.map((env) => (
        <button
          key={env.id}
          onClick={() => onEnvironmentChange(env.id)}
          className={`
            px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
            ${currentEnvironment === env.id 
              ? `${env.color} text-white shadow-lg scale-105` 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }
          `}
        >
          <span className="mr-1">{env.icon}</span>
          {env.name}
        </button>
      ))}
    </div>
  )
}