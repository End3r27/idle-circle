import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { BossRaid, RaidTemplate } from '../types/raids'
import { getActiveRaids, createRaid, getRaidHistory } from '../services/raids'
import { RAID_TEMPLATES } from '../data/raidTemplates'
import BossRaidScreen from '../components/BossRaidScreen'

export default function Raids() {
  const { user } = useAuth()
  const [activeRaids, setActiveRaids] = useState<BossRaid[]>([])
  const [raidHistory, setRaidHistory] = useState<BossRaid[]>([])
  const [selectedRaid, setSelectedRaid] = useState<BossRaid | null>(null)
  const [showCreateRaid, setShowCreateRaid] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<RaidTemplate | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState<'normal' | 'hard' | 'nightmare' | 'hell'>('normal')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRaids()
  }, [user])

  const loadRaids = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const [active, history] = await Promise.all([
        getActiveRaids(),
        getRaidHistory(user.id)
      ])
      
      setActiveRaids(active)
      setRaidHistory(history)
    } catch (error) {
      console.error('Error loading raids:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateRaid = async () => {
    if (!selectedTemplate || !user) return
    
    const result = await createRaid(selectedTemplate.id, selectedDifficulty, user.id)
    if (result.success) {
      setShowCreateRaid(false)
      setSelectedTemplate(null)
      loadRaids()
    } else {
      alert(result.error)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'normal': return 'text-green-400'
      case 'hard': return 'text-yellow-400'
      case 'nightmare': return 'text-orange-400'
      case 'hell': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'text-yellow-400'
      case 'active': return 'text-green-400'
      case 'completed': return 'text-blue-400'
      case 'failed': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const canJoinRaid = (raid: BossRaid) => {
    if (!user) return false
    const template = RAID_TEMPLATES.find(t => t.name === raid.name)
    return template && user.level >= template.minLevel
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading raids...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Boss Raids</h1>
            <p className="text-gray-400">Challenge mighty bosses with your friends for epic rewards</p>
          </div>
          <button
            onClick={() => setShowCreateRaid(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Create Raid
          </button>
        </div>

        {/* Active Raids */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Active Raids</h2>
          {activeRaids.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <div className="text-gray-400 mb-4">No active raids at the moment</div>
              <button
                onClick={() => setShowCreateRaid(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Create the First Raid
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeRaids.map((raid) => (
                <div
                  key={raid.id}
                  className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors cursor-pointer"
                  onClick={() => setSelectedRaid(raid)}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="text-4xl">{raid.boss.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{raid.name}</h3>
                      <div className={`text-sm ${getDifficultyColor(raid.difficulty)}`}>
                        {raid.difficulty.charAt(0).toUpperCase() + raid.difficulty.slice(1)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status</span>
                      <span className={getStatusColor(raid.status)}>
                        {raid.status.charAt(0).toUpperCase() + raid.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Players</span>
                      <span className="text-white">{raid.participants.length}/{raid.maxPlayers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Boss HP</span>
                      <span className="text-red-400">
                        {((raid.boss.currentHealth / raid.boss.totalHealth) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(raid.boss.currentHealth / raid.boss.totalHealth) * 100}%` }}
                    />
                  </div>
                  
                  {!canJoinRaid(raid) && (
                    <div className="mt-2 text-xs text-red-400">
                      Requires level {RAID_TEMPLATES.find(t => t.name === raid.name)?.minLevel}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Raid History */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Your Raid History</h2>
          {raidHistory.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <div className="text-gray-400">No completed raids yet</div>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="text-left py-3 px-4 text-gray-300">Boss</th>
                      <th className="text-left py-3 px-4 text-gray-300">Difficulty</th>
                      <th className="text-left py-3 px-4 text-gray-300">Result</th>
                      <th className="text-left py-3 px-4 text-gray-300">Your Damage</th>
                      <th className="text-left py-3 px-4 text-gray-300">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {raidHistory.map((raid) => {
                      const userParticipant = raid.participants.find(p => p.userId === user?.id)
                      return (
                        <tr key={raid.id} className="border-t border-gray-700">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{raid.boss.icon}</span>
                              <span className="text-white">{raid.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={getDifficultyColor(raid.difficulty)}>
                              {raid.difficulty.charAt(0).toUpperCase() + raid.difficulty.slice(1)}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={getStatusColor(raid.status)}>
                              {raid.status.charAt(0).toUpperCase() + raid.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-red-400">
                            {userParticipant?.damageDealt.toLocaleString() || 0}
                          </td>
                          <td className="py-3 px-4 text-gray-400">
                            {new Date(raid.endTime).toLocaleDateString()}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Raid Modal */}
      {showCreateRaid && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Create New Raid</h3>
              <button
                onClick={() => setShowCreateRaid(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            {/* Template Selection */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-3">Choose Boss</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {RAID_TEMPLATES.map((template) => (
                  <div
                    key={template.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      selectedTemplate?.id === template.id
                        ? 'border-purple-500 bg-purple-900/20'
                        : 'border-gray-600 bg-gray-700 hover:bg-gray-600'
                    }`}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-3xl">{template.bossTemplate.icon}</span>
                      <div>
                        <h5 className="text-white font-semibold">{template.name}</h5>
                        <div className="text-sm text-gray-400">
                          Level {template.minLevel}-{template.maxLevel}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-300">{template.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Difficulty Selection */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-3">Select Difficulty</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {(['normal', 'hard', 'nightmare', 'hell'] as const).map((difficulty) => (
                  <button
                    key={difficulty}
                    onClick={() => setSelectedDifficulty(difficulty)}
                    className={`py-2 px-4 rounded-lg font-semibold transition-colors ${
                      selectedDifficulty === difficulty
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <div className={getDifficultyColor(difficulty)}>
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </div>
                    {selectedTemplate && (
                      <div className="text-xs mt-1">
                        {(selectedTemplate.difficultyMultipliers[difficulty] * 100).toFixed(0)}% stats
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Create Button */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateRaid(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRaid}
                disabled={!selectedTemplate}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  selectedTemplate
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                Create Raid
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Raid Screen Modal */}
      {selectedRaid && (
        <BossRaidScreen
          raid={selectedRaid}
          onClose={() => setSelectedRaid(null)}
        />
      )}
    </div>
  )
}