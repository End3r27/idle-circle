import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getUserCircles } from '../services/circles'
import { getBattleHistory } from '../services/battles'
import { scheduleSoloBattle, getSoloBattleHistory } from '../services/soloBattles'
import { Circle, Battle } from '../types'
import CreateCircleModal from '../components/CreateCircleModal'
import JoinCircleModal from '../components/JoinCircleModal'
import LoadoutManager from '../components/LoadoutManager'
import AutoBattleScreen from '../components/AutoBattleScreen'
import ClassDisplay from '../components/ClassDisplay'
import { getTimestamp, formatDateTime } from '../utils/dateUtils'

export default function Dashboard() {
  const [circles, setCircles] = useState<Circle[]>([])
  const [recentBattles, setRecentBattles] = useState<Battle[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [showLoadoutManager, setShowLoadoutManager] = useState(false)
  const [selectedCircleId, setSelectedCircleId] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeBattle, setActiveBattle] = useState<Battle | null>(null)
  const [showBattleScreen, setShowBattleScreen] = useState(false)
  const [nextSoloBattleTime, setNextSoloBattleTime] = useState<string>('Ready!')
  
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      loadCircles()
      // Update timer every second
      const timerInterval = setInterval(() => {
        setCurrentTime(new Date())
        updateNextSoloBattleTime()
      }, 1000)
      // Check for solo battles every 30 seconds
      const soloBattleInterval = setInterval(checkForSoloBattles, 30000)
      // Initial solo battle check
      checkForSoloBattles()
      return () => {
        clearInterval(timerInterval)
        clearInterval(soloBattleInterval)
      }
    }
  }, [user])

  const loadCircles = async () => {
    if (!user) return
    
    setLoading(true)
    const userCircles = await getUserCircles(user.id)
    setCircles(userCircles)
    
    // Load recent battles from all user circles
    const allBattles: Battle[] = []
    for (const circle of userCircles) {
      const battles = await getBattleHistory(circle.id, 3)
      allBattles.push(...battles)
    }
    
    // Sort by date and take the 5 most recent
    const sortedBattles = allBattles.sort((a, b) => {
      return getTimestamp(b.startedAt) - getTimestamp(a.startedAt)
    }).slice(0, 5)
    
    setRecentBattles(sortedBattles)
    setLoading(false)
  }

  const handleCreateSuccess = (circleId: string) => {
    loadCircles()
    navigate(`/circle/${circleId}`)
  }

  const handleJoinSuccess = (circleId: string) => {
    loadCircles()
    navigate(`/circle/${circleId}`)
  }


  const getNextBattleTime = (circle: Circle) => {
    if (!circle.lastBattleAt) return 'Ready!'
    
    try {
      const lastBattle = new Date(circle.lastBattleAt)
      if (isNaN(lastBattle.getTime())) return 'Ready!'
      
      const nextBattle = new Date(lastBattle.getTime() + (circle.settings.battleInterval * 60 * 1000))
      const now = currentTime
      
      if (nextBattle <= now) return 'Ready!'
      
      const timeLeft = nextBattle.getTime() - now.getTime()
      if (timeLeft <= 0) return 'Ready!'
      
      const minutes = Math.floor(timeLeft / 60000)
      const seconds = Math.floor((timeLeft % 60000) / 1000)
      
      if (isNaN(minutes) || isNaN(seconds)) return 'Ready!'
      
      return `${minutes}m ${seconds}s`
    } catch (error) {
      return 'Ready!'
    }
  }

  const handleOpenLoadout = (circleId: string) => {
    setSelectedCircleId(circleId)
    setShowLoadoutManager(true)
  }

  const checkForSoloBattles = async () => {
    if (!user) return
    
    try {
      // Check if solo battle should trigger
      await scheduleSoloBattle(user.id)
      
      // Get recent solo battles to check for new ones
      const soloBattles = await getSoloBattleHistory(user.id, 1)
      if (soloBattles.length > 0) {
        const latestBattle = soloBattles[0]
        const battleTime = new Date(latestBattle.startedAt).getTime()
        const now = new Date().getTime()
        
        // If battle was created in the last 30 seconds, show it
        if (now - battleTime < 30000 && latestBattle.status === 'completed') {
          setActiveBattle(latestBattle)
          setShowBattleScreen(true)
        }
      }
      
      // Update next solo battle timer
      updateNextSoloBattleTime()
    } catch (error) {
      console.error('Error checking for solo battles:', error)
    }
  }

  const updateNextSoloBattleTime = () => {
    if (!user?.lastSoloBattleAt) {
      setNextSoloBattleTime('Ready!')
      return
    }
    
    try {
      const lastBattle = new Date(user.lastSoloBattleAt)
      if (isNaN(lastBattle.getTime())) {
        setNextSoloBattleTime('Ready!')
        return
      }
      
      const nextBattle = new Date(lastBattle.getTime() + (10 * 60 * 1000)) // 10 minutes
      const now = currentTime
      
      if (nextBattle <= now) {
        setNextSoloBattleTime('Ready!')
        return
      }
      
      const timeLeft = nextBattle.getTime() - now.getTime()
      if (timeLeft <= 0) {
        setNextSoloBattleTime('Ready!')
        return
      }
      
      const minutes = Math.floor(timeLeft / 60000)
      const seconds = Math.floor((timeLeft % 60000) / 1000)
      
      if (isNaN(minutes) || isNaN(seconds)) {
        setNextSoloBattleTime('Ready!')
        return
      }
      
      setNextSoloBattleTime(`${minutes}m ${seconds}s`)
    } catch (error) {
      setNextSoloBattleTime('Ready!')
    }
  }

  const handleBattleComplete = () => {
    // Reload circles to update any changes
    loadCircles()
    // You could show a notification here about the battle results
  }

  return (
    <div className="container mx-auto p-4 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div className="animate-slide-in">
          <h1 className="text-4xl font-bold gradient-text mb-2">Idle Circle</h1>
          <p className="text-gray-400">Your idle adventure awaits</p>
        </div>
        <div className="animate-slide-in" style={{ animationDelay: '0.2s' }}>
          <div className="text-right">
            <div className="text-white font-medium">Welcome back,</div>
            <div className="text-blue-400">{user?.displayName}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass-effect p-6 rounded-2xl card-hover animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-lg">🏰</span>
              </div>
              <h2 className="text-xl font-semibold">Your Circles</h2>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowCreateModal(true)}
                className="button-primary px-3 py-1 rounded-lg text-sm font-medium"
              >
                Create
              </button>
              <button
                onClick={() => setShowJoinModal(true)}
                className="bg-green-600/80 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
              >
                Join
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : circles.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">No circles yet</div>
              <p className="text-sm text-gray-500">Create or join a circle to start your adventure!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {circles.map((circle, index) => (
                <div
                  key={circle.id}
                  className="bg-black/20 p-4 rounded-xl border border-gray-700/50 hover:border-blue-500/30 animate-slide-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="font-semibold text-white">{circle.name}</div>
                      <div className="text-sm text-gray-400">
                        {circle.members.length}/{circle.maxMembers} members
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Next Battle</div>
                      <div className="text-sm font-mono text-blue-400">{getNextBattleTime(circle)}</div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/circle/${circle.id}`)}
                      className="flex-1 bg-blue-600/80 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm transition-all duration-300 hover:scale-105"
                    >
                      View Circle
                    </button>
                    <button
                      onClick={() => handleOpenLoadout(circle.id)}
                      className="bg-purple-600/80 hover:bg-purple-600 text-white px-3 py-2 rounded-lg text-sm transition-all duration-300 hover:scale-105"
                    >
                      ⚔️ Loadout
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-effect p-6 rounded-2xl card-hover animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center">
              <span className="text-lg">⚔️</span>
            </div>
            <h2 className="text-xl font-semibold">Recent Battles</h2>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : recentBattles.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">No battles yet</div>
              <p className="text-sm text-gray-500">Join a circle to start battling!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentBattles.map((battle, index) => {
                const circle = circles.find(c => c.id === battle.circleId)
                return (
                  <div
                    key={battle.id}
                    className="bg-black/20 p-3 rounded-xl border border-gray-700/50 animate-slide-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium text-white text-sm">
                          {circle?.name || 'Unknown Circle'}
                        </div>
                        <div className="text-xs text-gray-400">
                          {formatDateTime(battle.startedAt)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xs px-2 py-1 rounded ${
                          battle.result.winner === 'draw' ? 'bg-yellow-600/20 text-yellow-400' :
                          'bg-green-600/20 text-green-400'
                        }`}>
                          {battle.result.winner === 'draw' ? 'Draw' : 'Battle Won'}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="glass-effect p-6 rounded-2xl card-hover animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
              <span className="text-lg">👤</span>
            </div>
            <h2 className="text-xl font-semibold">Profile</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Level</span>
              <span className="text-white font-semibold">{user?.level || 1}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Experience</span>
              <span className="text-blue-400 font-semibold">{user?.experience || 0} XP</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Circles</span>
              <span className="text-purple-400 font-semibold">{circles.length}</span>
            </div>
            
            {/* Class Display */}
            <div className="pt-2 border-t border-gray-700">
              <div className="text-gray-400 text-sm mb-2">Class</div>
              {user?.playerClass ? (
                <ClassDisplay classId={user.playerClass} />
              ) : (
                <span className="text-gray-500">No class selected</span>
              )}
            </div>
          </div>
          
          {/* Solo Battle Timer */}
          <div className="mt-4 p-3 bg-black/20 rounded-xl border border-gray-700/50">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Next Solo Battle</span>
              <span className="text-orange-400 font-mono text-sm">{nextSoloBattleTime}</span>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              onClick={() => navigate('/inventory')}
              className="button-primary w-full py-3 rounded-xl font-medium flex items-center justify-center space-x-2"
            >
              <span>📦</span>
              <span>View Inventory</span>
            </button>
          </div>
        </div>
      </div>

      <CreateCircleModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />

      <JoinCircleModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onSuccess={handleJoinSuccess}
      />

      {selectedCircleId && (
        <LoadoutManager
          circleId={selectedCircleId}
          isOpen={showLoadoutManager}
          onClose={() => setShowLoadoutManager(false)}
        />
      )}

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