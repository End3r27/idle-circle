import { useState, useEffect } from 'react'
import { Battle, User } from '../types'
import { getMonsterRarityColor, getMonsterRarityName } from '../services/monsters'

interface AutoBattleScreenProps {
  battle: Battle
  user: User
  isOpen: boolean
  onClose: () => void
  onBattleComplete: (result: Battle['result']) => void
}

export default function AutoBattleScreen({ 
  battle, 
  user, 
  isOpen, 
  onClose, 
  onBattleComplete 
}: AutoBattleScreenProps) {
  const [currentLog, setCurrentLog] = useState(0)
  const [playerHealth, setPlayerHealth] = useState(100)
  const [monsterHealth, setMonsterHealth] = useState(100)
  const [battlePhase, setBattlePhase] = useState<'starting' | 'fighting' | 'finished'>('starting')
  const [animatingDamage, setAnimatingDamage] = useState<'player' | 'monster' | null>(null)

  const monster = battle.monster!
  const logs = battle.result.logs

  useEffect(() => {
    if (!isOpen || battlePhase !== 'starting') return

    // Start battle after 2 seconds
    const startTimer = setTimeout(() => {
      setBattlePhase('fighting')
      playBattleLogs()
    }, 2000)

    return () => clearTimeout(startTimer)
  }, [isOpen, battlePhase])

  const playBattleLogs = async () => {
    const totalPlayerHealth = user.level * 20 + 80 // Base health calculation
    const totalMonsterHealth = monster.stats.health
    let currentPlayerHp = totalPlayerHealth
    let currentMonsterHp = totalMonsterHealth

    for (let i = 0; i < logs.length; i++) {
      setCurrentLog(i)
      
      // Parse damage from log
      const log = logs[i]
      const playerDamageMatch = log.match(/Player deals (\d+) damage/)
      const monsterDamageMatch = log.match(/Monster deals (\d+) damage/)
      
      if (playerDamageMatch) {
        const damage = parseInt(playerDamageMatch[1])
        currentMonsterHp = Math.max(0, currentMonsterHp - damage)
        setAnimatingDamage('monster')
        setMonsterHealth((currentMonsterHp / totalMonsterHealth) * 100)
      } else if (monsterDamageMatch) {
        const damage = parseInt(monsterDamageMatch[1])
        currentPlayerHp = Math.max(0, currentPlayerHp - damage)
        setAnimatingDamage('player')
        setPlayerHealth((currentPlayerHp / totalPlayerHealth) * 100)
      }
      
      // Wait for animation
      await new Promise(resolve => setTimeout(resolve, 3000))
      setAnimatingDamage(null)
      await new Promise(resolve => setTimeout(resolve, 1500))
    }

    setBattlePhase('finished')
    
    // Auto close after 5 seconds
    setTimeout(() => {
      onBattleComplete(battle.result)
      onClose()
    }, 5000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 animate-fade-in">
      <div className="w-full max-w-6xl mx-4 bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600/80 to-orange-600/80 p-4 text-center">
          <h2 className="text-2xl font-bold text-white">
            {battle.type === 'solo' ? '⚔️ Solo Battle' : '🏰 Circle Battle'}
          </h2>
          <p className="text-gray-200 text-sm">
            {battlePhase === 'starting' && 'Preparing for battle...'}
            {battlePhase === 'fighting' && 'Battle in progress!'}
            {battlePhase === 'finished' && (
              battle.result.winner === 'player' ? 'Victory!' : 
              battle.result.winner === 'monster' ? 'Defeat!' : 'Draw!'
            )}
          </p>
        </div>

        {/* Battle Arena */}
        <div className="p-8">
          <div className="grid grid-cols-3 gap-8 items-center mb-8">
            {/* Player Side */}
            <div className="text-center">
              <div className={`w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-6xl transition-all duration-500 ${
                animatingDamage === 'player' ? 'animate-pulse scale-110 ring-4 ring-red-500' : ''
              }`}>
                👤
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">{user.displayName}</h3>
                <div className="text-sm text-gray-400">Level {user.level}</div>
                
                {/* Player Health Bar */}
                <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-1000 ease-out"
                    style={{ width: `${playerHealth}%` }}
                  />
                </div>
                <div className="text-xs text-gray-300">{Math.round(playerHealth)}% HP</div>
              </div>
            </div>

            {/* VS */}
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-500 mb-4">VS</div>
              {battlePhase === 'fighting' && (
                <div className="text-sm text-gray-400 animate-pulse">
                  Round {Math.floor(currentLog / 2) + 1}
                </div>
              )}
            </div>

            {/* Monster Side */}
            <div className="text-center">
              <div className={`w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center text-6xl transition-all duration-500 ${
                animatingDamage === 'monster' ? 'animate-pulse scale-110 ring-4 ring-red-500' : ''
              }`}>
                {monster.icon}
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">{monster.name}</h3>
                <div className={`text-sm ${getMonsterRarityColor(getMonsterRarityName(monster.level).toLowerCase())}`}>
                  Level {monster.level} • {getMonsterRarityName(monster.level)}
                </div>
                
                {/* Monster Health Bar */}
                <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-1000 ease-out"
                    style={{ width: `${monsterHealth}%` }}
                  />
                </div>
                <div className="text-xs text-gray-300">{Math.round(monsterHealth)}% HP</div>
              </div>
            </div>
          </div>

          {/* Battle Log */}
          <div className="bg-black/50 rounded-xl p-4 h-32 overflow-hidden">
            <div className="text-center text-gray-400 mb-2 text-sm">Battle Log</div>
            <div className="space-y-1 text-sm">
              {logs.slice(0, currentLog + 1).slice(-3).map((log, index) => (
                <div 
                  key={index} 
                  className={`text-gray-300 animate-fade-in ${
                    index === logs.slice(0, currentLog + 1).slice(-3).length - 1 ? 'text-white font-medium' : ''
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>

          {/* Results */}
          {battlePhase === 'finished' && (
            <div className="mt-6 text-center animate-fade-in">
              <div className={`text-2xl font-bold mb-4 ${
                battle.result.winner === 'player' ? 'text-green-400' :
                battle.result.winner === 'monster' ? 'text-red-400' : 'text-yellow-400'
              }`}>
                {battle.result.winner === 'player' && '🏆 Victory!'}
                {battle.result.winner === 'monster' && '💀 Defeat!'}
                {battle.result.winner === 'draw' && '🤝 Draw!'}
              </div>
              
              {battle.result.rewards.length > 0 && (
                <div className="bg-black/30 rounded-xl p-4 max-w-md mx-auto">
                  <div className="text-lg font-semibold text-white mb-2">Rewards</div>
                  {battle.result.rewards.map((reward, index) => (
                    <div key={index} className="text-sm text-gray-300">
                      <div>+{reward.experience} XP</div>
                      {reward.currency && <div>+{reward.currency} Gold</div>}
                      {reward.items.length > 0 && (
                        <div>+{reward.items.length} Item{reward.items.length > 1 ? 's' : ''}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              <div className="text-sm text-gray-500 mt-4">
                Closing automatically in 5 seconds...
              </div>
            </div>
          )}

          {/* Close Button */}
          {battlePhase === 'finished' && (
            <div className="text-center mt-4">
              <button
                onClick={() => {
                  onBattleComplete(battle.result)
                  onClose()
                }}
                className="button-primary px-6 py-3 rounded-xl font-medium"
              >
                Continue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}