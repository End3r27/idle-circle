import { useState, useEffect } from 'react'
import { BossRaid, RaidParticipant } from '../types/raids'
import { useAuth } from '../hooks/useAuth'
import { 
  joinRaid, 
  startRaid, 
  dealDamageToRaidBoss, 
  subscribeToRaid 
} from '../services/raids'

interface BossRaidScreenProps {
  raid: BossRaid
  onClose: () => void
}

export default function BossRaidScreen({ raid, onClose }: BossRaidScreenProps) {
  const { user } = useAuth()
  const [currentRaid, setCurrentRaid] = useState<BossRaid>(raid)
  const [isJoined, setIsJoined] = useState(false)
  const [isAttacking, setIsAttacking] = useState(false)
  const [damageNumbers, setDamageNumbers] = useState<{ id: string; damage: number; x: number; y: number }[]>([])

  useEffect(() => {
    if (!user) return
    
    const unsubscribe = subscribeToRaid(raid.id, (updatedRaid) => {
      if (updatedRaid) {
        setCurrentRaid(updatedRaid)
        setIsJoined(updatedRaid.participants.some(p => p.userId === user.id))
      }
    })

    return unsubscribe
  }, [raid.id, user])

  const handleJoinRaid = async () => {
    if (!user) return
    
    const result = await joinRaid(raid.id, user.id)
    if (result.success) {
      setIsJoined(true)
    } else {
      alert(result.error)
    }
  }

  const handleStartRaid = async () => {
    const result = await startRaid(raid.id)
    if (!result.success) {
      alert(result.error)
    }
  }

  const handleAttackBoss = async () => {
    if (!user || !isJoined || currentRaid.status !== 'active') return
    
    setIsAttacking(true)
    
    // Calculate damage based on user level and class
    const baseDamage = 50 + user.level * 10
    const randomMultiplier = 0.8 + Math.random() * 0.4
    const damage = Math.floor(baseDamage * randomMultiplier)
    
    // Show damage number
    const damageId = `damage_${Date.now()}`
    setDamageNumbers(prev => [...prev, {
      id: damageId,
      damage,
      x: 400 + Math.random() * 100,
      y: 300 + Math.random() * 100
    }])
    
    // Remove damage number after animation
    setTimeout(() => {
      setDamageNumbers(prev => prev.filter(d => d.id !== damageId))
    }, 2000)
    
    const result = await dealDamageToRaidBoss(raid.id, user.id, damage)
    if (result.bossDefeated) {
      alert('Boss defeated! Congratulations!')
    }
    
    setIsAttacking(false)
  }

  const getBossHealthPercentage = () => {
    return (currentRaid.boss.currentHealth / currentRaid.boss.totalHealth) * 100
  }

  const getCurrentPhase = () => {
    return currentRaid.boss.phases[currentRaid.boss.currentPhase]
  }

  const getTimeRemaining = () => {
    const now = new Date()
    const endTime = new Date(currentRaid.endTime)
    const remaining = endTime.getTime() - now.getTime()
    
    if (remaining <= 0) return '00:00'
    
    const minutes = Math.floor(remaining / (1000 * 60))
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000)
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const getParticipantRanking = () => {
    return [...currentRaid.participants].sort((a, b) => b.damageDealt - a.damageDealt)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">{currentRaid.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Boss Display */}
          <div className="lg:col-span-2">
            <div className="relative">
              {/* Boss Arena */}
              <div className="bg-gradient-to-br from-red-900 to-purple-900 rounded-xl p-8 min-h-[400px] flex items-center justify-center relative overflow-hidden">
                {/* Background effects */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-red-500 to-purple-500 animate-pulse"></div>
                </div>
                
                {/* Boss */}
                <div className="text-center relative z-10">
                  <div className={`text-8xl mb-4 ${currentRaid.boss.enraged ? 'animate-bounce' : ''}`}>
                    {currentRaid.boss.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{currentRaid.boss.name}</h3>
                  <div className="text-lg text-purple-300 mb-4">
                    Phase {currentRaid.boss.currentPhase + 1}: {getCurrentPhase()?.name}
                  </div>
                  
                  {/* Boss Health Bar */}
                  <div className="w-full max-w-md mx-auto">
                    <div className="flex justify-between text-sm text-gray-300 mb-1">
                      <span>HP</span>
                      <span>{currentRaid.boss.currentHealth.toLocaleString()} / {currentRaid.boss.totalHealth.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          getBossHealthPercentage() > 60 ? 'bg-green-500' :
                          getBossHealthPercentage() > 30 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${getBossHealthPercentage()}%` }}
                      />
                    </div>
                    <div className="text-center text-sm text-gray-400 mt-1">
                      {getBossHealthPercentage().toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Damage Numbers */}
                {damageNumbers.map((dmg) => (
                  <div
                    key={dmg.id}
                    className="absolute text-2xl font-bold text-yellow-400 pointer-events-none animate-bounce"
                    style={{
                      left: dmg.x,
                      top: dmg.y,
                      animation: 'bounce 1s ease-out, fade-out 2s ease-out'
                    }}
                  >
                    -{dmg.damage}
                  </div>
                ))}
              </div>

              {/* Boss Abilities */}
              <div className="mt-4 bg-gray-800 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-2">Current Phase Abilities</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {getCurrentPhase()?.newAbilities.map((ability, index) => (
                    <div key={index} className="bg-gray-700 rounded-lg p-2">
                      <div className="text-sm text-purple-300">{ability}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Raid Info Panel */}
          <div className="space-y-4">
            {/* Raid Status */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-white mb-2">Raid Status</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className={`font-semibold ${
                    currentRaid.status === 'active' ? 'text-green-400' :
                    currentRaid.status === 'upcoming' ? 'text-yellow-400' :
                    currentRaid.status === 'completed' ? 'text-blue-400' :
                    'text-red-400'
                  }`}>
                    {currentRaid.status.charAt(0).toUpperCase() + currentRaid.status.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Difficulty</span>
                  <span className={`font-semibold ${
                    currentRaid.difficulty === 'normal' ? 'text-green-400' :
                    currentRaid.difficulty === 'hard' ? 'text-yellow-400' :
                    currentRaid.difficulty === 'nightmare' ? 'text-orange-400' :
                    'text-red-400'
                  }`}>
                    {currentRaid.difficulty.charAt(0).toUpperCase() + currentRaid.difficulty.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Players</span>
                  <span className="text-white">{currentRaid.participants.length} / {currentRaid.maxPlayers}</span>
                </div>
                {currentRaid.status === 'active' && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Time Left</span>
                    <span className="text-red-400 font-mono">{getTimeRemaining()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              {!isJoined && currentRaid.status === 'upcoming' && (
                <button
                  onClick={handleJoinRaid}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Join Raid
                </button>
              )}
              
              {isJoined && currentRaid.status === 'upcoming' && (
                <button
                  onClick={handleStartRaid}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Start Raid
                </button>
              )}
              
              {isJoined && currentRaid.status === 'active' && (
                <button
                  onClick={handleAttackBoss}
                  disabled={isAttacking}
                  className={`w-full font-semibold py-2 px-4 rounded-lg transition-colors ${
                    isAttacking 
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {isAttacking ? 'Attacking...' : 'Attack Boss'}
                </button>
              )}
            </div>

            {/* Participants Ranking */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-white mb-2">Damage Ranking</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {getParticipantRanking().map((participant, index) => (
                  <div 
                    key={participant.userId}
                    className={`flex justify-between items-center p-2 rounded ${
                      participant.userId === user?.id ? 'bg-blue-900/30' : 'bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-bold ${
                        index === 0 ? 'text-yellow-400' :
                        index === 1 ? 'text-gray-300' :
                        index === 2 ? 'text-orange-400' :
                        'text-gray-400'
                      }`}>
                        #{index + 1}
                      </span>
                      <span className="text-white text-sm">{participant.userName}</span>
                      <span className="text-xs text-gray-400">Lv.{participant.level}</span>
                    </div>
                    <span className="text-sm font-semibold text-red-400">
                      {participant.damageDealt.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes fade-out {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-50px); }
        }
      `}</style>
    </div>
  )
}