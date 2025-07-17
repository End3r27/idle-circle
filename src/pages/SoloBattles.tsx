import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { getSoloBattleHistory, createSoloBattle, scheduleSoloBattle } from '../services/soloBattles'
import { Battle } from '../types'
import AutoBattleScreen from '../components/AutoBattleScreen'
import { getMonsterRarityColor, getMonsterRarityName } from '../services/monsters'

export default function SoloBattles() {
  const { user } = useAuth()
  const [battles, setBattles] = useState<Battle[]>([])
  const [loading, setLoading] = useState(true)
  const [nextBattleTime, setNextBattleTime] = useState<string>('Ready!')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeBattle, setActiveBattle] = useState<Battle | null>(null)
  const [showBattleScreen, setShowBattleScreen] = useState(false)
  const [manualBattleLoading, setManualBattleLoading] = useState(false)

  useEffect(() => {
    if (user) {
      loadBattles()
      // Update timer every second
      const timerInterval = setInterval(() => {
        setCurrentTime(new Date())
        updateNextBattleTime()
      }, 1000)
      // Check for auto battles every 30 seconds
      const battleInterval = setInterval(checkForAutoBattles, 30000)
      // Initial check
      checkForAutoBattles()
      return () => {
        clearInterval(timerInterval)
        clearInterval(battleInterval)
      }
    }
  }, [user])

  const loadBattles = async () => {
    if (!user) return
    
    setLoading(true)
    const battleHistory = await getSoloBattleHistory(user.id, 20)
    setBattles(battleHistory)
    setLoading(false)
  }

  const checkForAutoBattles = async () => {
    if (!user) return
    
    try {
      await scheduleSoloBattle(user.id)
      // Reload battles to see if new one was created
      loadBattles()
    } catch (error) {
      console.error('Error checking for auto battles:', error)
    }
  }

  const updateNextBattleTime = () => {
    if (!user?.lastSoloBattleAt) {
      setNextBattleTime('Ready!')
      return
    }
    
    try {
      const lastBattle = new Date(user.lastSoloBattleAt)
      if (isNaN(lastBattle.getTime())) {
        setNextBattleTime('Ready!')
        return
      }
      
      const nextBattle = new Date(lastBattle.getTime() + (10 * 60 * 1000)) // 10 minutes
      const now = currentTime
      
      if (nextBattle <= now) {
        setNextBattleTime('Ready!')
        return
      }
      
      const timeLeft = nextBattle.getTime() - now.getTime()
      if (timeLeft <= 0) {
        setNextBattleTime('Ready!')
        return
      }
      
      const minutes = Math.floor(timeLeft / 60000)
      const seconds = Math.floor((timeLeft % 60000) / 1000)
      
      if (isNaN(minutes) || isNaN(seconds)) {
        setNextBattleTime('Ready!')
        return
      }
      
      setNextBattleTime(`${minutes}m ${seconds}s`)
    } catch (error) {
      setNextBattleTime('Ready!')
    }
  }

  const handleManualBattle = async () => {
    if (!user || manualBattleLoading) return
    
    setManualBattleLoading(true)
    try {
      const result = await createSoloBattle(user.id)
      if (result.success && result.battleId) {
        // Find the new battle and show it
        await loadBattles()
        const newBattle = battles.find(b => b.id === result.battleId)
        if (newBattle) {
          setActiveBattle(newBattle)
          setShowBattleScreen(true)
        }
      }
    } catch (error) {
      console.error('Error creating manual battle:', error)
    }
    setManualBattleLoading(false)
  }

  const handleBattleComplete = () => {
    loadBattles() // Refresh battle history
  }

  const canStartManualBattle = nextBattleTime === 'Ready!' || (user?.level || 1) >= 5

  return (
    <div className="container mx-auto p-4 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-2">Solo Battles</h1>
        <p className="text-gray-400">Challenge monsters and earn rewards every 10 minutes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Battle Timer Card */}
        <div className="glass-effect p-6 rounded-2xl card-hover">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
              <span className="text-lg">⏰</span>
            </div>
            <h2 className="text-xl font-semibold">Next Battle</h2>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-mono font-bold text-orange-400 mb-2">
              {nextBattleTime}
            </div>
            <div className="text-sm text-gray-400 mb-4">
              Auto battles occur every 10 minutes
            </div>
            
            <button
              onClick={handleManualBattle}
              disabled={!canStartManualBattle || manualBattleLoading}
              className={`w-full py-3 rounded-xl font-medium transition-all duration-300 ${
                canStartManualBattle && !manualBattleLoading
                  ? 'button-primary hover:scale-105'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              {manualBattleLoading ? 'Starting Battle...' : '⚔️ Fight Now'}
            </button>
            
            {!canStartManualBattle && (user?.level || 1) < 5 && (
              <div className="text-xs text-gray-500 mt-2">
                Manual battles unlock at level 5
              </div>
            )}
          </div>
        </div>

        {/* Stats Card */}
        <div className="glass-effect p-6 rounded-2xl card-hover">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-lg">📊</span>
            </div>
            <h2 className="text-xl font-semibold">Battle Stats</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Battles</span>
              <span className="text-white font-semibold">{battles.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Victories</span>
              <span className="text-green-400 font-semibold">
                {battles.filter(b => b.result.winner === 'player').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Defeats</span>
              <span className="text-red-400 font-semibold">
                {battles.filter(b => b.result.winner === 'monster').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Win Rate</span>
              <span className="text-blue-400 font-semibold">
                {battles.length > 0 
                  ? Math.round((battles.filter(b => b.result.winner === 'player').length / battles.length) * 100)
                  : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Player Info Card */}
        <div className="glass-effect p-6 rounded-2xl card-hover">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
              <span className="text-lg">👤</span>
            </div>
            <h2 className="text-xl font-semibold">Fighter Info</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Level</span>
              <span className="text-white font-semibold">{user?.level || 1}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Experience</span>
              <span className="text-blue-400 font-semibold">{user?.experience || 0} XP</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Next Level</span>
              <span className="text-purple-400 font-semibold">
                {((user?.level || 1) + 1) * 100 - (user?.experience || 0)} XP
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Battle History */}
      <div className="glass-effect p-6 rounded-2xl">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
            <span className="text-lg">📜</span>
          </div>
          <h2 className="text-xl font-semibold">Battle History</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : battles.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">No battles yet</div>
            <p className="text-sm text-gray-500">Your first battle will start automatically!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {battles.map((battle, index) => (
              <div
                key={battle.id}
                className="bg-black/20 p-4 rounded-xl border border-gray-700/50 hover:border-blue-500/30 animate-slide-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">{battle.monster?.icon}</span>
                      <div>
                        <div className="font-semibold text-white">{battle.monster?.name}</div>
                        <div className={`text-sm ${getMonsterRarityColor(battle.monster?.level || 1)}`}>
                          Level {battle.monster?.level} • {getMonsterRarityName(battle.monster?.level || 1)}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(battle.startedAt).toLocaleDateString()} at {new Date(battle.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-sm px-3 py-1 rounded-full ${
                      battle.result.winner === 'player' ? 'bg-green-600/20 text-green-400' :
                      battle.result.winner === 'monster' ? 'bg-red-600/20 text-red-400' :
                      'bg-yellow-600/20 text-yellow-400'
                    }`}>
                      {battle.result.winner === 'player' ? '🏆 Victory' :
                       battle.result.winner === 'monster' ? '💀 Defeat' : '🤝 Draw'}
                    </div>
                    {battle.result.rewards.length > 0 && (
                      <div className="text-xs text-gray-400 mt-1">
                        +{battle.result.rewards[0].experience} XP
                        {battle.result.rewards[0].items.length > 0 && ` • ${battle.result.rewards[0].items.length} items`}
                      </div>
                    )}
                    
                    <button
                      onClick={() => {
                        setActiveBattle(battle)
                        setShowBattleScreen(true)
                      }}
                      className="text-xs text-blue-400 hover:text-blue-300 mt-2"
                    >
                      View Replay
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Auto Battle Screen */}
      {activeBattle && user && (
        <AutoBattleScreen
          battle={activeBattle}
          user={user}
          isOpen={showBattleScreen}
          onClose={() => setShowBattleScreen(false)}
          onBattleComplete={handleBattleComplete}
        />
      )}
    </div>
  )
}