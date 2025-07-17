import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  updateDoc
} from 'firebase/firestore'
import { db } from './firebase'
import { Battle, User, BattleReward, Item } from '../types'
import { generateMonster } from './monsters'
import { getPlayerLoadout } from './loadouts'

export const createSoloBattle = async (
  userId: string
): Promise<{ success: boolean; battleId?: string; error?: string }> => {
  try {
    // Get user data
    const userDoc = await getDoc(doc(db, 'users', userId))
    if (!userDoc.exists()) {
      return { success: false, error: 'User not found' }
    }
    
    const user = userDoc.data() as User
    
    // Generate monster based on user level
    const monster = generateMonster(user.level, 1)
    
    const battleData: Omit<Battle, 'id'> = {
      type: 'solo',
      participants: [userId],
      monster,
      result: {
        winner: 'draw',
        rewards: [],
        logs: []
      },
      startedAt: new Date(),
      status: 'pending'
    }
    
    const docRef = await addDoc(collection(db, 'battles'), battleData)
    
    // Start battle simulation
    await simulateSoloBattle(docRef.id, user, monster)
    
    return { success: true, battleId: docRef.id }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export const simulateSoloBattle = async (
  battleId: string,
  user: User,
  monster: any
): Promise<void> => {
  try {
    const battleRef = doc(db, 'battles', battleId)
    
    // Calculate player stats
    const baseStats = {
      attack: 10 + user.level * 2,
      defense: 10 + user.level * 1.5,
      health: 100 + user.level * 20,
      speed: 10 + user.level,
      critRate: 0.05 + user.level * 0.002,
      critDamage: 1.5
    }
    
    // Try to get equipment stats from localStorage (for solo battles)
    let playerStats = { ...baseStats }
    try {
      // Check if running in browser environment
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedLoadout = localStorage.getItem(`loadout_${user.id}`)
        if (savedLoadout) {
          const loadout = JSON.parse(savedLoadout)
          
          interface EquipmentStats {
            attack: number
            defense: number
            health: number
            speed: number
            critRate: number
            critDamage: number
          }
          
          const equipmentStats = Object.values(loadout).reduce((total: EquipmentStats, item: unknown) => {
            if (!item || typeof item !== 'object') return total
            const itemStats = (item as any).stats || {}
            return {
              attack: total.attack + (itemStats.attack || 0),
              defense: total.defense + (itemStats.defense || 0),
              health: total.health + (itemStats.health || 0),
              speed: total.speed + (itemStats.speed || 0),
              critRate: total.critRate + (itemStats.critRate || 0),
              critDamage: total.critDamage + (itemStats.critDamage || 0)
            }
          }, { attack: 0, defense: 0, health: 0, speed: 0, critRate: 0, critDamage: 0 } as EquipmentStats)
          
          playerStats = {
            attack: baseStats.attack + equipmentStats.attack,
            defense: baseStats.defense + equipmentStats.defense,
            health: baseStats.health + equipmentStats.health,
            speed: baseStats.speed + equipmentStats.speed,
            critRate: Math.min(0.5, baseStats.critRate + equipmentStats.critRate),
            critDamage: baseStats.critDamage + equipmentStats.critDamage
          }
        }
      }
    } catch (error) {
      console.log('No equipment loadout found, using base stats')
    }
    
    // Fallback: Try to get loadout from any circle the user is in
    if (playerStats.attack === baseStats.attack && user.circles.length > 0) {
      try {
        const playerLoadout = await getPlayerLoadout(user.id, user.circles[0])
        if (playerLoadout) {
          const loadoutStats = playerLoadout.stats
          playerStats = {
            attack: baseStats.attack + (loadoutStats.attack || 0),
            defense: baseStats.defense + (loadoutStats.defense || 0),
            health: baseStats.health + (loadoutStats.health || 0),
            speed: baseStats.speed + (loadoutStats.speed || 0),
            critRate: Math.min(0.5, baseStats.critRate + (loadoutStats.critRate || 0)),
            critDamage: baseStats.critDamage + (loadoutStats.critDamage || 0)
          }
        }
      } catch (error) {
        console.log('No circle loadout found, using base stats')
      }
    }
    
    // Simulate battle rounds
    const logs: string[] = []
    let playerHealth = playerStats.health
    let monsterHealth = monster.stats.health
    
    logs.push(`🔥 ${user.displayName} encounters a ${monster.name}!`)
    logs.push(`⚔️ Battle begins! Player (${playerHealth} HP) vs ${monster.name} (${monsterHealth} HP)`)
    
    let round = 1
    while (playerHealth > 0 && monsterHealth > 0 && round <= 15) {
      // Determine who goes first based on speed
      const playerFirst = playerStats.speed >= monster.stats.speed
      
      if (playerFirst) {
        // Player attacks first
        const isCrit = Math.random() < playerStats.critRate
        const baseDamage = Math.floor(playerStats.attack * (0.8 + Math.random() * 0.4))
        const damage = isCrit ? Math.floor(baseDamage * playerStats.critDamage) : baseDamage
        
        monsterHealth = Math.max(0, monsterHealth - damage)
        logs.push(`⚔️ Round ${round}: Player ${isCrit ? 'critically ' : ''}deals ${damage} damage to ${monster.name}${isCrit ? ' (CRITICAL!)' : ''}`)
        
        if (monsterHealth <= 0) break
        
        // Monster attacks back
        const monsterDamage = Math.floor(monster.stats.attack * (0.8 + Math.random() * 0.4))
        playerHealth = Math.max(0, playerHealth - monsterDamage)
        logs.push(`🩸 Round ${round}: ${monster.name} deals ${monsterDamage} damage to Player`)
      } else {
        // Monster attacks first
        const monsterDamage = Math.floor(monster.stats.attack * (0.8 + Math.random() * 0.4))
        playerHealth = Math.max(0, playerHealth - monsterDamage)
        logs.push(`🩸 Round ${round}: ${monster.name} deals ${monsterDamage} damage to Player`)
        
        if (playerHealth <= 0) break
        
        // Player attacks back
        const isCrit = Math.random() < playerStats.critRate
        const baseDamage = Math.floor(playerStats.attack * (0.8 + Math.random() * 0.4))
        const damage = isCrit ? Math.floor(baseDamage * playerStats.critDamage) : baseDamage
        
        monsterHealth = Math.max(0, monsterHealth - damage)
        logs.push(`⚔️ Round ${round}: Player ${isCrit ? 'critically ' : ''}deals ${damage} damage to ${monster.name}${isCrit ? ' (CRITICAL!)' : ''}`)
      }
      
      round++
    }
    
    // Determine winner
    let winner: 'player' | 'monster' | 'draw' = 'draw'
    if (playerHealth > 0 && monsterHealth <= 0) {
      winner = 'player'
      logs.push(`🏆 Victory! ${user.displayName} defeats the ${monster.name}!`)
    } else if (monsterHealth > 0 && playerHealth <= 0) {
      winner = 'monster'
      logs.push(`💀 Defeat! The ${monster.name} overpowers ${user.displayName}!`)
    } else {
      logs.push(`🤝 The battle ends in a draw!`)
    }
    
    // Generate rewards
    const rewards = generateSoloBattleRewards(user.id, winner, monster)
    
    // Update battle with results
    await updateDoc(battleRef, {
      result: {
        winner,
        rewards,
        logs
      },
      completedAt: new Date(),
      status: 'completed'
    })
    
    // Update user last solo battle time
    await updateDoc(doc(db, 'users', user.id), {
      lastSoloBattleAt: new Date().toISOString()
    })
    
    // Award rewards to player
    await awardSoloRewards(user.id, rewards[0])
    
  } catch (error) {
    console.error('Error simulating solo battle:', error)
  }
}

const generateSoloBattleRewards = (
  userId: string,
  winner: 'player' | 'monster' | 'draw',
  monster: any
): BattleReward[] => {
  const reward: BattleReward = {
    userId,
    experience: 0,
    items: [],
    currency: 0
  }
  
  if (winner === 'player') {
    // Full rewards for victory
    reward.experience = Math.floor(
      monster.rewards.experienceRange[0] + 
      Math.random() * (monster.rewards.experienceRange[1] - monster.rewards.experienceRange[0])
    )
    reward.currency = Math.floor(
      monster.rewards.currencyRange[0] + 
      Math.random() * (monster.rewards.currencyRange[1] - monster.rewards.currencyRange[0])
    )
    
    // Item drop chance
    if (Math.random() < monster.rewards.itemDropChance) {
      reward.items.push(generateRandomBattleItem(monster.level, monster.name))
    }
  } else if (winner === 'draw') {
    // Reduced rewards for draw
    reward.experience = Math.floor(monster.rewards.experienceRange[0] * 0.5)
    reward.currency = Math.floor(monster.rewards.currencyRange[0] * 0.3)
  } else {
    // Minimal rewards for defeat
    reward.experience = Math.floor(monster.rewards.experienceRange[0] * 0.2)
    reward.currency = 5
  }
  
  return [reward]
}

const generateRandomBattleItem = (monsterLevel: number, monsterName: string): Item => {
  const types: Item['type'][] = ['weapon', 'armor', 'accessory', 'consumable']
  const rarities: Item['rarity'][] = ['common', 'rare', 'epic', 'legendary']
  
  // Higher level monsters have better drop rates for rare items
  let rarityWeights = [70, 20, 8, 2] // common, rare, epic, legendary
  if (monsterLevel >= 25) rarityWeights = [50, 30, 15, 5]
  if (monsterLevel >= 50) rarityWeights = [30, 40, 20, 10]
  if (monsterLevel >= 75) rarityWeights = [20, 30, 30, 20]
  
  const randomRarity = () => {
    const rand = Math.random() * 100
    let cumulative = 0
    for (let i = 0; i < rarityWeights.length; i++) {
      cumulative += rarityWeights[i]
      if (rand <= cumulative) return rarities[i]
    }
    return 'common'
  }
  
  const type = types[Math.floor(Math.random() * types.length)]
  const rarity = randomRarity()
  
  const rarityMultiplier = {
    common: 1,
    rare: 1.5,
    epic: 2.2,
    legendary: 3.5
  }[rarity]
  
  const levelMultiplier = 1 + (monsterLevel - 1) * 0.1
  
  const baseStats = {
    attack: Math.floor((Math.random() * 8 + 4) * rarityMultiplier * levelMultiplier),
    defense: Math.floor((Math.random() * 8 + 4) * rarityMultiplier * levelMultiplier),
    health: Math.floor((Math.random() * 40 + 20) * rarityMultiplier * levelMultiplier)
  }
  
  return {
    id: `battle_item_${Date.now()}_${Math.random()}`,
    name: `${rarity} ${type} of the ${monsterName}`,
    type,
    rarity,
    stats: baseStats,
    description: `A ${rarity} ${type} obtained from defeating a ${monsterName}`,
    icon: `icon_${type}`,
    tradeable: rarity !== 'legendary',
    forgeable: true
  }
}

const awardSoloRewards = async (userId: string, reward: BattleReward): Promise<void> => {
  try {
    // Update user experience
    const userRef = doc(db, 'users', userId)
    const userDoc = await getDoc(userRef)
    
    if (userDoc.exists()) {
      const userData = userDoc.data() as User
      const newExperience = userData.experience + reward.experience
      const newLevel = Math.floor(newExperience / 100) + 1 // Simple leveling formula
      
      await updateDoc(userRef, {
        experience: newExperience,
        level: newLevel
      })
    }
    
    // Add items to inventory
    for (const item of reward.items) {
      await addDoc(collection(db, 'inventory'), {
        userId,
        ...item,
        quantity: 1,
        acquiredAt: new Date()
      })
    }
  } catch (error) {
    console.error('Error awarding solo rewards:', error)
  }
}

export const getSoloBattleHistory = async (
  userId: string,
  limitCount: number = 10
): Promise<Battle[]> => {
  try {
    const battlesQuery = query(
      collection(db, 'battles'),
      where('type', '==', 'solo'),
      where('participants', 'array-contains', userId),
      orderBy('startedAt', 'desc'),
      limit(limitCount)
    )
    
    const snapshot = await getDocs(battlesQuery)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Battle[]
  } catch (error) {
    console.error('Error fetching solo battle history:', error)
    return []
  }
}

export const scheduleSoloBattle = async (userId: string): Promise<void> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId))
    if (!userDoc.exists()) return
    
    const user = userDoc.data() as User
    const now = new Date()
    let lastBattle = new Date(0) // Default to epoch
    
    if (user.lastSoloBattleAt) {
      try {
        lastBattle = new Date(user.lastSoloBattleAt)
        if (isNaN(lastBattle.getTime())) {
          lastBattle = new Date(0)
        }
      } catch (error) {
        console.error('Error parsing lastSoloBattleAt:', error)
        lastBattle = new Date(0)
      }
    }
    
    const timeSinceLastBattle = now.getTime() - lastBattle.getTime()
    const battleInterval = 10 * 60 * 1000 // 10 minutes in milliseconds
    
    if (timeSinceLastBattle >= battleInterval) {
      await createSoloBattle(userId)
    }
  } catch (error) {
    console.error('Error scheduling solo battle:', error)
  }
}