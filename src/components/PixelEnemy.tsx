import React, { useState, useEffect } from 'react'
import { Monster } from '../types'

interface PixelEnemyProps {
  monster: Monster
  isAttacking?: boolean
  isDamaged?: boolean
  isDefeated?: boolean
  showDamage?: number
  showHeal?: number
  className?: string
}

export default function PixelEnemy({ 
  monster, 
  isAttacking = false, 
  isDamaged = false, 
  isDefeated = false,
  showDamage,
  showHeal,
  className = '' 
}: PixelEnemyProps) {
  const [damageNumbers, setDamageNumbers] = useState<Array<{id: number, value: number, type: 'damage' | 'heal'}>>([])

  useEffect(() => {
    if (showDamage) {
      const id = Date.now()
      setDamageNumbers(prev => [...prev, { id, value: showDamage, type: 'damage' }])
      setTimeout(() => {
        setDamageNumbers(prev => prev.filter(num => num.id !== id))
      }, 1000)
    }
  }, [showDamage])

  useEffect(() => {
    if (showHeal) {
      const id = Date.now()
      setDamageNumbers(prev => [...prev, { id, value: showHeal, type: 'heal' }])
      setTimeout(() => {
        setDamageNumbers(prev => prev.filter(num => num.id !== id))
      }, 1000)
    }
  }, [showHeal])

  const getPixelEnemyClass = (monsterName: string): string => {
    const name = monsterName.toLowerCase()
    
    if (name.includes('goblin')) return 'pixel-goblin'
    if (name.includes('wolf')) return 'pixel-wolf'
    if (name.includes('spider')) return 'pixel-spider'
    if (name.includes('slime')) return 'pixel-slime'
    if (name.includes('dragon') || name.includes('wyrm')) return 'pixel-dragon'
    if (name.includes('skeleton') || name.includes('bone')) return 'pixel-skeleton'
    if (name.includes('phoenix') || name.includes('flame')) return 'pixel-phoenix'
    
    // Default to a generic pixel enemy based on element
    if (monster.element === 'fire') return 'pixel-phoenix'
    if (monster.element === 'ice') return 'pixel-skeleton'
    if (monster.element === 'dark') return 'pixel-skeleton'
    if (monster.element === 'earth') return 'pixel-goblin'
    if (monster.element === 'water') return 'pixel-slime'
    if (monster.element === 'poison') return 'pixel-spider'
    
    return 'pixel-goblin' // Default fallback
  }

  const getElementClass = (element?: string): string => {
    if (!element) return ''
    return `${element}-element`
  }

  const getRarityClass = (rarity?: string): string => {
    if (!rarity) return ''
    return `rarity-${rarity}`
  }

  const getAnimationClasses = (): string => {
    let classes = ''
    if (isAttacking) classes += ' attacking'
    if (isDamaged) classes += ' damaged'
    if (isDefeated) classes += ' enemy-defeated'
    return classes
  }

  return (
    <div className={`relative ${className}`}>
      {/* Main Enemy Sprite */}
      <div 
        className={`
          pixel-enemy 
          ${getPixelEnemyClass(monster.name)} 
          ${getElementClass(monster.element)}
          ${getRarityClass(monster.rarity)}
          ${getAnimationClasses()}
        `}
        style={{
          filter: isDefeated ? 'grayscale(100%) brightness(0.5)' : undefined
        }}
      />
      
      {/* Enemy Info Overlay */}
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-center">
        <div className="text-xs font-bold text-white bg-black bg-opacity-75 px-2 py-1 rounded">
          {monster.name}
        </div>
        <div className="text-xs text-gray-300">
          Lv.{monster.level} {monster.element && (
            <span className={`${monster.element === 'fire' ? 'text-red-400' : 
                              monster.element === 'water' ? 'text-blue-400' :
                              monster.element === 'earth' ? 'text-green-400' :
                              monster.element === 'air' ? 'text-cyan-400' :
                              monster.element === 'dark' ? 'text-purple-400' :
                              monster.element === 'light' ? 'text-yellow-400' :
                              monster.element === 'poison' ? 'text-green-600' :
                              monster.element === 'ice' ? 'text-blue-300' :
                              monster.element === 'lightning' ? 'text-yellow-400' :
                              'text-gray-400'}`}>
              {monster.element}
            </span>
          )}
        </div>
      </div>

      {/* Health Bar */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-20">
        <div className="pixel-health-bar">
          <div 
            className="h-full bg-gradient-to-r from-red-500 to-green-500 transition-all duration-300"
            style={{ 
              width: `${Math.max(0, (monster.stats?.health || 100) / (monster.stats?.health || 100) * 100)}%` 
            }}
          />
        </div>
      </div>

      {/* Damage/Heal Numbers */}
      {damageNumbers.map(({ id, value, type }) => (
        <div
          key={id}
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
            type === 'damage' ? 'pixel-damage-number' : 'pixel-heal-number'
          }`}
          style={{
            left: `${50 + (Math.random() - 0.5) * 40}%`,
            top: `${50 + (Math.random() - 0.5) * 20}%`
          }}
        >
          {type === 'damage' ? '-' : '+'}{value}
        </div>
      ))}

      {/* Special Effects for Abilities */}
      {monster.abilities?.map((ability, index) => (
        <div key={ability.id} className="absolute inset-0 pointer-events-none">
          {ability.type === 'passive' && ability.effect.type === 'damage_boost' && (
            <div className="absolute inset-0 bg-red-500 bg-opacity-20 rounded-full animate-pulse" />
          )}
          {ability.type === 'passive' && ability.effect.type === 'defense_boost' && (
            <div className="absolute inset-0 bg-blue-500 bg-opacity-20 rounded-full animate-pulse" />
          )}
          {ability.type === 'passive' && ability.effect.type === 'heal' && (
            <div className="absolute inset-0 bg-green-500 bg-opacity-20 rounded-full animate-pulse" />
          )}
        </div>
      ))}
    </div>
  )
}

// Helper component for creating custom pixel enemies
export function CustomPixelEnemy({ 
  width = 64, 
  height = 64, 
  colors = ['#4a5d23', '#2d3d0f'], 
  pattern = 'goblin',
  className = '' 
}: {
  width?: number
  height?: number
  colors?: string[]
  pattern?: string
  className?: string
}) {
  const getCustomPattern = () => {
    switch (pattern) {
      case 'blob':
        return {
          background: `radial-gradient(ellipse ${width/2}px ${height/2}px at 50% 50%, ${colors[0]} 50%, transparent 50%)`
        }
      case 'humanoid':
        return {
          background: `
            radial-gradient(circle at 50% 25%, ${colors[0]} 15%, transparent 15%),
            linear-gradient(to bottom, transparent 40%, ${colors[1]} 40%, ${colors[1]} 70%, transparent 70%),
            linear-gradient(90deg, transparent 20%, ${colors[0]} 20%, ${colors[0]} 30%, transparent 30%, transparent 70%, ${colors[0]} 70%, ${colors[0]} 80%, transparent 80%)
          `
        }
      case 'beast':
        return {
          background: `
            radial-gradient(ellipse 30% 20% at 30% 40%, ${colors[0]} 50%, transparent 50%),
            radial-gradient(ellipse 50% 30% at 60% 50%, ${colors[1]} 50%, transparent 50%),
            radial-gradient(circle at 25% 35%, #ff0000 8%, transparent 8%)
          `
        }
      default:
        return {
          background: `radial-gradient(circle at 50% 50%, ${colors[0]} 40%, transparent 40%)`
        }
    }
  }

  return (
    <div 
      className={`pixel-enemy ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        ...getCustomPattern(),
        backgroundRepeat: 'no-repeat'
      }}
    />
  )
}