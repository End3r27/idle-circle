import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { getPlayerInventory } from '../services/loadouts'
import { Item } from '../types'

interface InventoryProps {
  onItemSelected?: (item: Item) => void
  filterType?: Item['type']
}

export default function Inventory({ onItemSelected, filterType }: InventoryProps) {
  const { user } = useAuth()
  const [inventory, setInventory] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)

  useEffect(() => {
    if (user) {
      loadInventory()
    }
  }, [user])

  const loadInventory = async () => {
    if (!user) return
    
    setLoading(true)
    const items = await getPlayerInventory(user.id)
    setInventory(items)
    setLoading(false)
  }

  const getRarityColor = (rarity: Item['rarity']) => {
    switch (rarity) {
      case 'common': return 'border-gray-500 bg-gray-600'
      case 'rare': return 'border-blue-500 bg-blue-900'
      case 'epic': return 'border-purple-500 bg-purple-900'
      case 'legendary': return 'border-yellow-500 bg-yellow-900'
      default: return 'border-gray-500 bg-gray-600'
    }
  }

  const getStatColor = (value: number) => {
    if (value > 0) return 'text-green-400'
    if (value < 0) return 'text-red-400'
    return 'text-gray-300'
  }

  const filteredItems = filterType 
    ? inventory.filter(item => item.type === filterType)
    : inventory

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = []
    }
    acc[item.type].push(item)
    return acc
  }, {} as Record<string, Item[]>)

  if (loading) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg">
        <div className="text-center">Loading inventory...</div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Inventory ({inventory.length} items)</h2>
      
      {inventory.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">No items in inventory</p>
          <p className="text-sm text-gray-500 mt-2">Items are earned through battles</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedItems).map(([type, items]) => (
            <div key={type}>
              <h3 className="text-lg font-medium mb-3 capitalize">{type}s ({items.length})</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedItem(item)
                      onItemSelected?.(item)
                    }}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-105 ${getRarityColor(item.rarity)}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium text-white">{item.name}</div>
                      <div className="text-xs text-gray-300 capitalize">{item.rarity}</div>
                    </div>
                    
                    <div className="text-sm text-gray-300 mb-3">
                      {item.description}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
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
                      {item.stats.speed !== 0 && item.stats.speed !== undefined && (
                        <div className={getStatColor(item.stats.speed)}>
                          SPD: {item.stats.speed > 0 ? '+' : ''}{item.stats.speed}
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-3 flex justify-between items-center">
                      <div className="flex space-x-2">
                        {item.tradeable && (
                          <span className="text-xs bg-blue-600 px-2 py-1 rounded">Tradeable</span>
                        )}
                        {item.forgeable && (
                          <span className="text-xs bg-orange-600 px-2 py-1 rounded">Forgeable</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Item Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{selectedItem.name}</h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Type:</span>
                <span className="capitalize">{selectedItem.type}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Rarity:</span>
                <span className={`capitalize ${getRarityColor(selectedItem.rarity).split(' ')[0].replace('border-', 'text-')}`}>
                  {selectedItem.rarity}
                </span>
              </div>
              
              <div>
                <span className="text-gray-400">Description:</span>
                <p className="text-sm mt-1">{selectedItem.description}</p>
              </div>
              
              <div>
                <span className="text-gray-400">Stats:</span>
                <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                  <div className={getStatColor(selectedItem.stats.attack || 0)}>
                    Attack: {(selectedItem.stats.attack || 0) > 0 ? '+' : ''}{selectedItem.stats.attack || 0}
                  </div>
                  <div className={getStatColor(selectedItem.stats.defense || 0)}>
                    Defense: {(selectedItem.stats.defense || 0) > 0 ? '+' : ''}{selectedItem.stats.defense || 0}
                  </div>
                  <div className={getStatColor(selectedItem.stats.health || 0)}>
                    Health: {(selectedItem.stats.health || 0) > 0 ? '+' : ''}{selectedItem.stats.health || 0}
                  </div>
                  <div className={getStatColor(selectedItem.stats.speed || 0)}>
                    Speed: {(selectedItem.stats.speed || 0) > 0 ? '+' : ''}{selectedItem.stats.speed || 0}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Tradeable:</span>
                <span className={selectedItem.tradeable ? 'text-green-400' : 'text-red-400'}>
                  {selectedItem.tradeable ? 'Yes' : 'No'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Forgeable:</span>
                <span className={selectedItem.forgeable ? 'text-green-400' : 'text-red-400'}>
                  {selectedItem.forgeable ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}