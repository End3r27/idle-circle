import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { 
  getPlayerLoadout, 
  updatePlayerLoadout, 
  updatePlayerRole, 
  getPlayerInventory,
  getRoleDescription,
  getRoleColor,
  generateStarterGear
} from '../services/loadouts'
import { Player, Item, Loadout } from '../types'

interface LoadoutManagerProps {
  circleId: string
  isOpen: boolean
  onClose: () => void
}

export default function LoadoutManager({ circleId, isOpen, onClose }: LoadoutManagerProps) {
  const { user } = useAuth()
  const [player, setPlayer] = useState<Player | null>(null)
  const [inventory, setInventory] = useState<Item[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<keyof Loadout | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (isOpen && user) {
      loadData()
    }
  }, [isOpen, user, circleId])

  const loadData = async () => {
    if (!user) return
    
    setLoading(true)
    const [playerData, inventoryData] = await Promise.all([
      getPlayerLoadout(user.id, circleId),
      getPlayerInventory(user.id)
    ])
    
    if (!playerData) {
      // Generate starter gear for new players
      await generateStarterGear(user.id)
      const newInventory = await getPlayerInventory(user.id)
      setInventory(newInventory)
    } else {
      setPlayer(playerData)
      setInventory(inventoryData)
    }
    
    setLoading(false)
  }

  const handleRoleChange = async (role: 'offense' | 'defense' | 'support') => {
    if (!user) return
    
    setMessage('')
    const result = await updatePlayerRole(user.id, circleId, role)
    
    if (result.success) {
      setMessage('Role updated successfully!')
      await loadData()
    } else {
      setMessage(`Error: ${result.error}`)
    }
  }

  const handleEquipItem = async (item: Item) => {
    if (!user || !selectedSlot) return
    
    const currentLoadout = player?.loadout || {}
    const newLoadout = { ...currentLoadout, [selectedSlot]: item }
    
    const result = await updatePlayerLoadout(user.id, circleId, newLoadout)
    
    if (result.success) {
      setMessage('Item equipped successfully!')
      setSelectedSlot(null)
      await loadData()
    } else {
      setMessage(`Error: ${result.error}`)
    }
  }

  const handleUnequipItem = async (slot: keyof Loadout) => {
    if (!user) return
    
    const currentLoadout = player?.loadout || {}
    const newLoadout = { ...currentLoadout, [slot]: undefined }
    
    const result = await updatePlayerLoadout(user.id, circleId, newLoadout)
    
    if (result.success) {
      setMessage('Item unequipped successfully!')
      await loadData()
    } else {
      setMessage(`Error: ${result.error}`)
    }
  }

  const getItemsByType = (type: Item['type']) => {
    return inventory.filter(item => item.type === type)
  }

  const getRarityColor = (rarity: Item['rarity']) => {
    switch (rarity) {
      case 'common': return 'text-gray-300'
      case 'rare': return 'text-blue-400'
      case 'epic': return 'text-purple-400'
      case 'legendary': return 'text-yellow-400'
      default: return 'text-gray-300'
    }
  }

  const getStatColor = (value: number) => {
    if (value > 0) return 'text-green-400'
    if (value < 0) return 'text-red-400'
    return 'text-gray-300'
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Loadout Manager</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading loadout...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Side - Role and Equipment */}
            <div className="space-y-6">
              {/* Role Selection */}
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Role</h3>
                <div className="space-y-3">
                  {(['offense', 'defense', 'support'] as const).map((role) => (
                    <div
                      key={role}
                      onClick={() => handleRoleChange(role)}
                      className={`p-3 rounded cursor-pointer transition-colors ${
                        player?.role === role
                          ? 'bg-blue-600 border-2 border-blue-400'
                          : 'bg-gray-600 hover:bg-gray-500'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className={`font-medium ${getRoleColor(role)}`}>
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </span>
                        {player?.role === role && <span>✓</span>}
                      </div>
                      <div className="text-sm text-gray-300 mt-1">
                        {getRoleDescription(role)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Equipment Slots */}
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Equipment</h3>
                <div className="grid grid-cols-2 gap-4">
                  {(['weapon', 'armor', 'accessory', 'consumable'] as const).map((slot) => (
                    <div
                      key={slot}
                      className="bg-gray-600 p-4 rounded-lg cursor-pointer hover:bg-gray-500"
                      onClick={() => setSelectedSlot(slot)}
                    >
                      <div className="text-sm font-medium mb-2 capitalize">{slot}</div>
                      {player?.loadout?.[slot] ? (
                        <div className="space-y-1">
                          <div className={`text-sm ${getRarityColor(player.loadout[slot]!.rarity)}`}>
                            {player.loadout[slot]!.name}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleUnequipItem(slot)
                            }}
                            className="text-xs text-red-400 hover:text-red-300"
                          >
                            Unequip
                          </button>
                        </div>
                      ) : (
                        <div className="text-gray-400 text-sm">Empty</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Player Stats */}
              {player && (
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Stats</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>Attack: <span className="text-red-400">{player.stats.attack}</span></div>
                    <div>Defense: <span className="text-blue-400">{player.stats.defense}</span></div>
                    <div>Health: <span className="text-green-400">{player.stats.health}</span></div>
                    <div>Speed: <span className="text-yellow-400">{player.stats.speed}</span></div>
                    <div>Crit Rate: <span className="text-purple-400">{(player.stats.critRate * 100).toFixed(1)}%</span></div>
                    <div>Crit Damage: <span className="text-pink-400">{(player.stats.critDamage * 100).toFixed(0)}%</span></div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Side - Inventory */}
            <div className="space-y-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">
                  Inventory {selectedSlot && `- Select ${selectedSlot}`}
                </h3>
                
                {selectedSlot ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {getItemsByType(selectedSlot === 'weapon' ? 'weapon' : 
                                   selectedSlot === 'armor' ? 'armor' : 
                                   selectedSlot === 'accessory' ? 'accessory' : 'consumable').map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleEquipItem(item)}
                        className="bg-gray-600 p-3 rounded cursor-pointer hover:bg-gray-500"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className={`font-medium ${getRarityColor(item.rarity)}`}>
                              {item.name}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              {item.description}
                            </div>
                          </div>
                          <div className="text-xs space-y-1">
                            {item.stats.attack !== 0 && (
                              <div className={getStatColor(item.stats.attack!)}>
                                ATK: {item.stats.attack > 0 ? '+' : ''}{item.stats.attack}
                              </div>
                            )}
                            {item.stats.defense !== 0 && (
                              <div className={getStatColor(item.stats.defense!)}>
                                DEF: {item.stats.defense > 0 ? '+' : ''}{item.stats.defense}
                              </div>
                            )}
                            {item.stats.health !== 0 && (
                              <div className={getStatColor(item.stats.health!)}>
                                HP: {item.stats.health > 0 ? '+' : ''}{item.stats.health}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {inventory.map((item) => (
                      <div
                        key={item.id}
                        className="bg-gray-600 p-3 rounded"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className={`font-medium ${getRarityColor(item.rarity)}`}>
                              {item.name}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              {item.description}
                            </div>
                          </div>
                          <div className="text-xs text-gray-400 capitalize">
                            {item.type}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {message && (
          <div className={`mt-4 p-3 rounded ${
            message.includes('Error') ? 'bg-red-900 text-red-200' : 'bg-green-900 text-green-200'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  )
}