import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDocs, 
  query, 
  where,
  deleteDoc
} from 'firebase/firestore'
import { db } from './firebase'
import { Player, Item, Loadout, PlayerStats } from '../types'

export const getPlayerLoadout = async (
  userId: string, 
  circleId: string
): Promise<Player | null> => {
  try {
    const playersQuery = query(
      collection(db, 'players'),
      where('userId', '==', userId),
      where('circleId', '==', circleId)
    )
    
    const snapshot = await getDocs(playersQuery)
    if (snapshot.empty) return null
    
    const playerDoc = snapshot.docs[0]
    return { id: playerDoc.id, ...playerDoc.data() } as Player & { id: string }
  } catch (error) {
    console.error('Error fetching player loadout:', error)
    return null
  }
}

export const updatePlayerLoadout = async (
  userId: string,
  circleId: string,
  loadout: Loadout
): Promise<{ success: boolean; error?: string }> => {
  try {
    const playersQuery = query(
      collection(db, 'players'),
      where('userId', '==', userId),
      where('circleId', '==', circleId)
    )
    
    const snapshot = await getDocs(playersQuery)
    if (snapshot.empty) {
      return { success: false, error: 'Player not found' }
    }
    
    const playerDoc = snapshot.docs[0]
    
    // Calculate new stats based on loadout
    const newStats = calculateStatsFromLoadout(loadout)
    
    await updateDoc(playerDoc.ref, {
      loadout,
      stats: newStats
    })
    
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export const updatePlayerRole = async (
  userId: string,
  circleId: string,
  role: 'offense' | 'defense' | 'support'
): Promise<{ success: boolean; error?: string }> => {
  try {
    const playersQuery = query(
      collection(db, 'players'),
      where('userId', '==', userId),
      where('circleId', '==', circleId)
    )
    
    const snapshot = await getDocs(playersQuery)
    if (snapshot.empty) {
      return { success: false, error: 'Player not found' }
    }
    
    const playerDoc = snapshot.docs[0]
    const player = playerDoc.data() as Player
    
    // Apply role bonuses to base stats
    const roleModifiedStats = applyRoleBonus(player.stats, role)
    
    await updateDoc(playerDoc.ref, {
      role,
      stats: roleModifiedStats
    })
    
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export const getPlayerInventory = async (userId: string): Promise<Item[]> => {
  try {
    const inventoryQuery = query(
      collection(db, 'inventory'),
      where('userId', '==', userId)
    )
    
    const snapshot = await getDocs(inventoryQuery)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Item[]
  } catch (error) {
    console.error('Error fetching inventory:', error)
    return []
  }
}

export const addItemToInventory = async (
  userId: string,
  item: Item
): Promise<{ success: boolean; error?: string }> => {
  try {
    await addDoc(collection(db, 'inventory'), {
      userId,
      ...item
    })
    
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export const removeItemFromInventory = async (
  itemId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    await deleteDoc(doc(db, 'inventory', itemId))
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export const generateStarterGear = async (userId: string): Promise<void> => {
  try {
    const starterItems: Item[] = [
      {
        id: `starter_weapon_${Date.now()}`,
        name: 'Wooden Sword',
        type: 'weapon',
        rarity: 'common',
        stats: { attack: 15, defense: 0, health: 0, speed: 5, critRate: 0.05, critDamage: 1.2 },
        description: 'A basic wooden sword for beginners',
        icon: 'sword_wood',
        tradeable: false,
        forgeable: true
      },
      {
        id: `starter_armor_${Date.now()}`,
        name: 'Leather Armor',
        type: 'armor',
        rarity: 'common',
        stats: { attack: 0, defense: 20, health: 50, speed: -2, critRate: 0, critDamage: 1 },
        description: 'Basic leather protection',
        icon: 'armor_leather',
        tradeable: false,
        forgeable: true
      },
      {
        id: `starter_accessory_${Date.now()}`,
        name: 'Health Potion',
        type: 'consumable',
        rarity: 'common',
        stats: { attack: 0, defense: 0, health: 30, speed: 0, critRate: 0, critDamage: 1 },
        description: 'Restores some health',
        icon: 'potion_health',
        tradeable: true,
        forgeable: false
      }
    ]
    
    for (const item of starterItems) {
      await addItemToInventory(userId, item)
    }
  } catch (error) {
    console.error('Error generating starter gear:', error)
  }
}

const calculateStatsFromLoadout = (loadout: Loadout): PlayerStats => {
  const baseStats: PlayerStats = {
    attack: 10,
    defense: 10,
    health: 100,
    speed: 10,
    critRate: 0.05,
    critDamage: 1.5
  }
  
  const items = [loadout.weapon, loadout.armor, loadout.accessory, loadout.consumable]
  
  return items.reduce((stats, item) => {
    if (!item) return stats
    
    return {
      attack: stats.attack + (item.stats.attack || 0),
      defense: stats.defense + (item.stats.defense || 0),
      health: stats.health + (item.stats.health || 0),
      speed: stats.speed + (item.stats.speed || 0),
      critRate: stats.critRate + (item.stats.critRate || 0),
      critDamage: stats.critDamage + (item.stats.critDamage || 0)
    }
  }, baseStats)
}

const applyRoleBonus = (stats: PlayerStats, role: 'offense' | 'defense' | 'support'): PlayerStats => {
  const bonusMultiplier = 1.2
  
  switch (role) {
    case 'offense':
      return {
        ...stats,
        attack: Math.floor(stats.attack * bonusMultiplier),
        critRate: stats.critRate * bonusMultiplier,
        critDamage: stats.critDamage * 1.1
      }
    case 'defense':
      return {
        ...stats,
        defense: Math.floor(stats.defense * bonusMultiplier),
        health: Math.floor(stats.health * bonusMultiplier)
      }
    case 'support':
      return {
        ...stats,
        speed: Math.floor(stats.speed * bonusMultiplier),
        health: Math.floor(stats.health * 1.1)
      }
    default:
      return stats
  }
}

export const getRoleDescription = (role: 'offense' | 'defense' | 'support'): string => {
  switch (role) {
    case 'offense':
      return '+20% Attack, +20% Crit Rate, +10% Crit Damage'
    case 'defense':
      return '+20% Defense, +20% Health'
    case 'support':
      return '+20% Speed, +10% Health'
    default:
      return ''
  }
}

export const getRoleColor = (role: 'offense' | 'defense' | 'support'): string => {
  switch (role) {
    case 'offense':
      return 'text-red-400'
    case 'defense':
      return 'text-blue-400'
    case 'support':
      return 'text-green-400'
    default:
      return 'text-gray-400'
  }
}