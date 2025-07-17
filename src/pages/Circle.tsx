import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCircleMembers } from '../services/circles'
import { scheduleAutoBattle } from '../services/battles'
import { getPlayerLoadout, getRoleColor } from '../services/loadouts'
import { User, Player } from '../types'
import type { Circle } from '../types'
import { useAuth } from '../hooks/useAuth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../services/firebase'
import BattleHistory from '../components/BattleHistory'
import ManualBattle from '../components/ManualBattle'
import LoadoutManager from '../components/LoadoutManager'

export default function Circle() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [circle, setCircle] = useState<Circle | null>(null)
  const [members, setMembers] = useState<User[]>([])
  const [players, setPlayers] = useState<(Player & { user: User })[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [showLoadoutManager, setShowLoadoutManager] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    if (id && user) {
      loadCircleData()
      // Check for auto battles every 30 seconds
      const battleInterval = setInterval(checkForAutoBattles, 30000)
      // Update timer every second
      const timerInterval = setInterval(() => setCurrentTime(new Date()), 1000)
      return () => {
        clearInterval(battleInterval)
        clearInterval(timerInterval)
      }
    }
  }, [id, user])

  const loadCircleData = async () => {
    if (!id) return
    
    setLoading(true)
    
    try {
      // Get circle data
      const circleDoc = await getDoc(doc(db, 'circles', id))
      if (!circleDoc.exists()) {
        navigate('/')
        return
      }
      
      const circleData = { id: circleDoc.id, ...circleDoc.data() } as Circle
      setCircle(circleData)
      
      // Get members
      const circleMembers = await getCircleMembers(id)
      setMembers(circleMembers)
      
      // Get player loadout data
      const playerData = await Promise.all(
        circleMembers.map(async (member) => {
          const playerLoadout = await getPlayerLoadout(member.id, id)
          return playerLoadout ? { ...playerLoadout, user: member } : null
        })
      )
      
      setPlayers(playerData.filter(Boolean) as (Player & { user: User })[])
      
    } catch (error) {
      console.error('Error loading circle data:', error)
    }
    
    setLoading(false)
  }

  const checkForAutoBattles = async () => {
    if (id) {
      await scheduleAutoBattle(id)
    }
  }

  const handleBattleCreated = () => {
    setRefreshKey(prev => prev + 1)
  }

  const getNextBattleTime = () => {
    if (!circle?.lastBattleAt) return 'Ready!'
    
    try {
      const lastBattle = new Date(circle.lastBattleAt)
      
      // Check if the date is valid
      if (isNaN(lastBattle.getTime())) {
        return 'Ready!'
      }
      
      const nextBattle = new Date(lastBattle.getTime() + (circle.settings.battleInterval * 60 * 1000))
      const now = currentTime
      
      if (nextBattle <= now) return 'Ready!'
      
      const timeLeft = nextBattle.getTime() - now.getTime()
      
      // Ensure timeLeft is positive
      if (timeLeft <= 0) return 'Ready!'
      
      const minutes = Math.floor(timeLeft / 60000)
      const seconds = Math.floor((timeLeft % 60000) / 1000)
      
      // Ensure values are valid numbers
      if (isNaN(minutes) || isNaN(seconds)) return 'Ready!'
      
      return `${minutes}m ${seconds}s`
    } catch (error) {
      console.error('Error calculating next battle time:', error)
      return 'Ready!'
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-white">Loading circle...</div>
      </div>
    )
  }

  if (!circle) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-white">Circle not found</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{circle.name}</h1>
        <button
          onClick={() => navigate('/')}
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Members ({members.length}/{circle.maxMembers})</h2>
            <button
              onClick={() => setShowLoadoutManager(true)}
              className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
            >
              ⚔️ My Loadout
            </button>
          </div>
          {members.length === 0 ? (
            <p className="text-gray-300">No members yet</p>
          ) : (
            <div className="space-y-2">
              {members.map((member) => {
                const playerData = players.find(p => p.user.id === member.id)
                return (
                  <div key={member.id} className="bg-gray-700 p-3 rounded">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold">{member.displayName}</div>
                        <div className="text-sm text-gray-400">Level {member.level}</div>
                        {playerData && (
                          <div className="mt-1">
                            <span className={`text-xs px-2 py-1 rounded ${getRoleColor(playerData.role)} bg-gray-600`}>
                              {playerData.role.charAt(0).toUpperCase() + playerData.role.slice(1)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        {member.id === circle.ownerId && (
                          <span className="text-yellow-400 text-sm">👑 Owner</span>
                        )}
                        {playerData && (
                          <div className="text-xs text-gray-400 mt-1">
                            <div>ATK: {playerData.stats.attack}</div>
                            <div>DEF: {playerData.stats.defense}</div>
                            <div>HP: {playerData.stats.health}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Battle Timer</h2>
          <div className="space-y-4">
            <div className="bg-gray-700 p-4 rounded">
              <div className="text-sm text-gray-400">Next Auto Battle</div>
              <div className="text-2xl font-bold text-blue-400">{getNextBattleTime()}</div>
            </div>
            
            <div className="text-sm text-gray-400">
              <div>Battle Interval: {circle.settings.battleInterval} minutes</div>
              <div>Last Battle: {circle.lastBattleAt ? (() => {
                try {
                  const date = new Date(circle.lastBattleAt)
                  return isNaN(date.getTime()) ? 'Never' : date.toLocaleString()
                } catch {
                  return 'Never'
                }
              })() : 'Never'}</div>
            </div>
            
            <div className="text-xs text-gray-500">
              💡 Battles happen automatically every {circle.settings.battleInterval} minutes when there are 2+ members
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Circle Info</h2>
          <div className="space-y-2 text-sm">
            <div><strong>Invite Code:</strong> <span className="font-mono bg-gray-700 px-2 py-1 rounded">{circle.inviteCode}</span></div>
            <div><strong>Description:</strong> {circle.description || 'No description'}</div>
            <div><strong>Created:</strong> {new Date(circle.createdAt).toLocaleDateString()}</div>
            <div><strong>Settings:</strong></div>
            <div className="ml-4 space-y-1">
              <div>• Forging: {circle.settings.allowForging ? 'Enabled' : 'Disabled'}</div>
              <div>• Trading: {circle.settings.allowTrades ? 'Enabled' : 'Disabled'}</div>
            </div>
          </div>
        </div>

        <ManualBattle 
          circleId={id!} 
          onBattleCreated={handleBattleCreated}
        />
      </div>

      <div className="mt-6">
        <BattleHistory 
          key={refreshKey}
          circleId={id!} 
        />
      </div>

      <LoadoutManager
        circleId={id!}
        isOpen={showLoadoutManager}
        onClose={() => setShowLoadoutManager(false)}
      />
    </div>
  )
}