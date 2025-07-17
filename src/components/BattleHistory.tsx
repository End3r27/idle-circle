import { useState, useEffect } from 'react'
import { getBattleHistory } from '../services/battles'
import { Battle } from '../types'
import { formatFullDateTime } from '../utils/dateUtils'

interface BattleHistoryProps {
  circleId: string
}

export default function BattleHistory({ circleId }: BattleHistoryProps) {
  const [battles, setBattles] = useState<Battle[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBattle, setSelectedBattle] = useState<Battle | null>(null)

  useEffect(() => {
    loadBattles()
    
    // Auto-refresh every 10 seconds to catch new battles
    const interval = setInterval(loadBattles, 10000)
    return () => clearInterval(interval)
  }, [circleId])

  const loadBattles = async () => {
    setLoading(true)
    try {
      console.log('Loading battle history for circle:', circleId)
      const history = await getBattleHistory(circleId)
      console.log('Battle history loaded:', history)
      setBattles(history)
    } catch (error) {
      console.error('Error loading battle history:', error)
    }
    setLoading(false)
  }

  // Remove this function since we're using the utility function now

  const getBattleStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400'
      case 'active': return 'text-yellow-400'
      case 'pending': return 'text-blue-400'
      default: return 'text-gray-400'
    }
  }

  const getWinnerIcon = (winner: string) => {
    switch (winner) {
      case 'team1': return '🏆'
      case 'team2': return '🏆'
      case 'draw': return '🤝'
      default: return '⚔️'
    }
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Battle History</h2>
        <button
          onClick={loadBattles}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <p className="text-gray-300">Loading battles...</p>
      ) : battles.length === 0 ? (
        <p className="text-gray-300">No battles yet. Battles occur every 30 minutes automatically!</p>
      ) : (
        <div className="space-y-3">
          {battles.map((battle) => (
            <div
              key={battle.id}
              onClick={() => setSelectedBattle(battle)}
              className="bg-gray-700 p-4 rounded cursor-pointer hover:bg-gray-600 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getWinnerIcon(battle.result.winner)}</span>
                  <span className="font-medium">
                    {battle.type === 'auto' ? 'Auto Battle' : 'Event Battle'}
                  </span>
                </div>
                <span className={`text-sm ${getBattleStatusColor(battle.status)}`}>
                  {battle.status}
                </span>
              </div>
              
              <div className="text-sm text-gray-400 mb-2">
                {formatFullDateTime(battle.startedAt)}
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Team 1: {battle.teams?.team1?.length || 0} players</span>
                <span>Team 2: {battle.teams?.team2?.length || 0} players</span>
              </div>
              
              {battle.result.winner !== 'draw' && (
                <div className="text-sm text-green-400 mt-1">
                  Winner: {battle.result.winner === 'team1' ? 'Team 1' : 'Team 2'}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Battle Details Modal */}
      {selectedBattle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Battle Details</h3>
              <button
                onClick={() => setSelectedBattle(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Type:</strong> {selectedBattle.type}
                </div>
                <div>
                  <strong>Status:</strong> {selectedBattle.status}
                </div>
                <div>
                  <strong>Started:</strong> {formatFullDateTime(selectedBattle.startedAt)}
                </div>
                <div>
                  <strong>Winner:</strong> {selectedBattle.result.winner}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Battle Log</h4>
                <div className="bg-gray-900 p-3 rounded max-h-64 overflow-y-auto">
                  {selectedBattle.result.logs.length === 0 ? (
                    <p className="text-gray-400">No battle log available</p>
                  ) : (
                    <div className="space-y-1">
                      {selectedBattle.result.logs.map((log, index) => (
                        <div key={index} className="text-sm font-mono">
                          {log}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Rewards</h4>
                <div className="space-y-2">
                  {selectedBattle.result.rewards.map((reward, index) => (
                    <div key={index} className="bg-gray-700 p-2 rounded text-sm">
                      <div>Player: {reward.userId}</div>
                      <div>Experience: +{reward.experience}</div>
                      {reward.items.length > 0 && (
                        <div>Items: {reward.items.map(item => item.name).join(', ')}</div>
                      )}
                      {reward.currency && (
                        <div>Currency: +{reward.currency}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}