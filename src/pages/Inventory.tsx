import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import Inventory from '../components/Inventory'
import { getPlayerInventory } from '../services/loadouts'
import { Item, Loadout } from '../types'

export default function InventoryPage() {
  const { user } = useAuth()
  const [inventory, setInventory] = useState<Item[]>([])
  const [loadout, setLoadout] = useState<Loadout>({})
  const [selectedSlot, setSelectedSlot] = useState<keyof Loadout | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  const loadData = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const items = await getPlayerInventory(user.id)
      setInventory(items)
      
      // Load saved loadout from localStorage for solo battles
      const savedLoadout = localStorage.getItem(`loadout_${user.id}`)
      if (savedLoadout) {
        setLoadout(JSON.parse(savedLoadout))
      }
    } catch (error) {
      console.error('Error loading inventory:', error)
    }
    setLoading(false)
  }

  const handleEquipItem = (item: Item) => {
    if (!selectedSlot) return
    
    const newLoadout = { ...loadout, [selectedSlot]: item }
    setLoadout(newLoadout)
    
    // Save to localStorage for solo battles
    localStorage.setItem(`loadout_${user?.id}`, JSON.stringify(newLoadout))
    setSelectedSlot(null)
  }

  const handleUnequipItem = (slot: keyof Loadout) => {
    const newLoadout = { ...loadout, [slot]: undefined }
    setLoadout(newLoadout)
    
    // Save to localStorage
    localStorage.setItem(`loadout_${user?.id}`, JSON.stringify(newLoadout))
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

  if (loading) {
    return (
      <div className="container mx-auto p-4 animate-fade-in">
        <div className="text-center py-8">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-2">Equipment & Items</h1>
        <p className="text-gray-400">Manage your gear and inventory</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Equipment Section */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Equipment</h2>
          <div className="grid grid-cols-2 gap-4">
            {(['weapon', 'armor', 'accessory', 'consumable'] as const).map((slot) => (
              <div
                key={slot}
                className="bg-gray-700 p-4 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
                onClick={() => setSelectedSlot(selectedSlot === slot ? null : slot)}
              >
                <div className="text-sm font-medium mb-2 capitalize">{slot}</div>
                {loadout[slot] ? (
                  <div className="space-y-1">
                    <div className={`text-sm ${getRarityColor(loadout[slot]!.rarity)}`}>
                      {loadout[slot]!.name}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-xs space-y-1">
                        {loadout[slot]!.stats.attack !== 0 && loadout[slot]!.stats.attack !== undefined && (
                          <div className={getStatColor(loadout[slot]!.stats.attack!)}>
                            ATK: {loadout[slot]!.stats.attack! > 0 ? '+' : ''}{loadout[slot]!.stats.attack}
                          </div>
                        )}
                        {loadout[slot]!.stats.defense !== 0 && loadout[slot]!.stats.defense !== undefined && (
                          <div className={getStatColor(loadout[slot]!.stats.defense!)}>
                            DEF: {loadout[slot]!.stats.defense! > 0 ? '+' : ''}{loadout[slot]!.stats.defense}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleUnequipItem(slot)
                        }}
                        className="text-xs text-red-400 hover:text-red-300 bg-red-900/20 px-2 py-1 rounded"
                      >
                        Unequip
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm">Empty</div>
                )}
                {selectedSlot === slot && (
                  <div className="mt-2 text-xs text-blue-400">
                    Click an item below to equip
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-blue-900/20 rounded-lg">
            <div className="text-sm text-blue-300 mb-1">💡 Equipment Tips:</div>
            <div className="text-xs text-gray-400">
              • Equipment affects your solo battle performance<br/>
              • Click a slot above, then click an item to equip it<br/>
              • Higher rarity items provide better stats
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Current Stats</h2>
          <div className="space-y-3">
            {(() => {
              const baseStats = {
                attack: 10 + (user?.level || 1) * 2,
                defense: 10 + (user?.level || 1) * 1.5,
                health: 100 + (user?.level || 1) * 20,
                speed: 10 + (user?.level || 1)
              }
              
              const equipmentStats = Object.values(loadout).reduce((total, item) => {
                if (!item) return total
                return {
                  attack: total.attack + (item.stats.attack || 0),
                  defense: total.defense + (item.stats.defense || 0),
                  health: total.health + (item.stats.health || 0),
                  speed: total.speed + (item.stats.speed || 0)
                }
              }, { attack: 0, defense: 0, health: 0, speed: 0 })
              
              const totalStats = {
                attack: baseStats.attack + equipmentStats.attack,
                defense: Math.floor(baseStats.defense + equipmentStats.defense),
                health: baseStats.health + equipmentStats.health,
                speed: baseStats.speed + equipmentStats.speed
              }
              
              return (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Attack:</span>
                    <span className="text-red-400 font-semibold">
                      {totalStats.attack} 
                      {equipmentStats.attack !== 0 && (
                        <span className="text-xs text-gray-500 ml-1">
                          ({baseStats.attack}{equipmentStats.attack > 0 ? '+' : ''}{equipmentStats.attack})
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Defense:</span>
                    <span className="text-blue-400 font-semibold">
                      {totalStats.defense}
                      {equipmentStats.defense !== 0 && (
                        <span className="text-xs text-gray-500 ml-1">
                          ({Math.floor(baseStats.defense)}{equipmentStats.defense > 0 ? '+' : ''}{equipmentStats.defense})
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Health:</span>
                    <span className="text-green-400 font-semibold">
                      {totalStats.health}
                      {equipmentStats.health !== 0 && (
                        <span className="text-xs text-gray-500 ml-1">
                          ({baseStats.health}{equipmentStats.health > 0 ? '+' : ''}{equipmentStats.health})
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Speed:</span>
                    <span className="text-yellow-400 font-semibold">
                      {totalStats.speed}
                      {equipmentStats.speed !== 0 && (
                        <span className="text-xs text-gray-500 ml-1">
                          ({baseStats.speed}{equipmentStats.speed > 0 ? '+' : ''}{equipmentStats.speed})
                        </span>
                      )}
                    </span>
                  </div>
                </>
              )
            })()}
          </div>
        </div>
      </div>

      {/* Inventory Section */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">
          Inventory {selectedSlot && `- Select ${selectedSlot} to equip`}
        </h2>
        
        {selectedSlot ? (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {getItemsByType(selectedSlot === 'weapon' ? 'weapon' : 
                           selectedSlot === 'armor' ? 'armor' : 
                           selectedSlot === 'accessory' ? 'accessory' : 'consumable').map((item) => (
              <div
                key={item.id}
                onClick={() => handleEquipItem(item)}
                className="bg-gray-700 p-3 rounded cursor-pointer hover:bg-gray-600 transition-colors"
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
                    {item.stats.attack !== 0 && item.stats.attack !== undefined && (
                      <div className={getStatColor(item.stats.attack)}>
                        ATK: {item.stats.attack > 0 ? '+' : ''}{item.stats.attack}
                      </div>
                    )}
                    {item.stats.defense !== 0 && item.stats.defense !== undefined && (
                      <div className={getStatColor(item.stats.defense)}>
                        DEF: {item.stats.defense > 0 ? '+' : ''}{item.stats.defense}
                      </div>
                    )}
                    {item.stats.health !== 0 && item.stats.health !== undefined && (
                      <div className={getStatColor(item.stats.health)}>
                        HP: {item.stats.health > 0 ? '+' : ''}{item.stats.health}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {getItemsByType(selectedSlot === 'weapon' ? 'weapon' : 
                           selectedSlot === 'armor' ? 'armor' : 
                           selectedSlot === 'accessory' ? 'accessory' : 'consumable').length === 0 && (
              <div className="text-center py-4 text-gray-400">
                No {selectedSlot}s available
              </div>
            )}
          </div>
        ) : (
          <Inventory />
        )}
      </div>
    </div>
  )
}