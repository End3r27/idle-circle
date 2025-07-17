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
import { Battle, Circle, Player, BattleReward, Item } from '../types'

export const createCircleBattle = async (
  circleId: string,
  type: 'auto' | 'event' | 'challenge' = 'auto'
): Promise<{ success: boolean; battleId?: string; error?: string }> => {
  try {
    // Get circle data
    const circleDoc = await getDoc(doc(db, 'circles', circleId))
    if (!circleDoc.exists()) {
      return { success: false, error: 'Circle not found' }
    }
    
    // Get all players in the circle
    const playersQuery = query(
      collection(db, 'players'),
      where('circleId', '==', circleId)
    )
    const playersSnapshot = await getDocs(playersQuery)
    const players = playersSnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    })) as (Player & { id: string })[]
    
    if (players.length < 2) {
      return { success: false, error: 'Need at least 2 players for battle' }
    }
    
    // Split players into two teams randomly
    const shuffled = [...players].sort(() => 0.5 - Math.random())
    const mid = Math.ceil(shuffled.length / 2)
    const team1 = shuffled.slice(0, mid).map(p => p.userId)
    const team2 = shuffled.slice(mid).map(p => p.userId)
    
    const battleData: Omit<Battle, 'id'> = {
      circleId,
      type,
      participants: players.map(p => p.userId),
      teams: { team1, team2 },
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
    await simulateBattle(docRef.id, players)
    
    return { success: true, battleId: docRef.id }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export const simulateBattle = async (
  battleId: string,
  players: (Player & { id: string })[]
): Promise<void> => {
  try {
    const battleRef = doc(db, 'battles', battleId)
    const battleDoc = await getDoc(battleRef)
    
    if (!battleDoc.exists()) return
    
    const battle = battleDoc.data() as Battle
    
    // Get players for each team
    const team1Players = players.filter(p => battle.teams.team1.includes(p.userId))
    const team2Players = players.filter(p => battle.teams.team2.includes(p.userId))
    
    // Calculate team stats
    const team1Stats = calculateTeamStats(team1Players)
    const team2Stats = calculateTeamStats(team2Players)
    
    // Simulate battle rounds
    const logs: string[] = []
    let team1Health = team1Stats.health
    let team2Health = team2Stats.health
    
    logs.push(`🔥 Battle begins! Team 1 (${team1Stats.health} HP) vs Team 2 (${team2Stats.health} HP)`)
    
    let round = 1
    while (team1Health > 0 && team2Health > 0 && round <= 10) {
      // Team 1 attacks Team 2
      const damage1 = Math.floor(team1Stats.attack * (0.8 + Math.random() * 0.4))
      team2Health -= damage1
      logs.push(`⚔️ Round ${round}: Team 1 deals ${damage1} damage to Team 2`)
      
      if (team2Health <= 0) break
      
      // Team 2 attacks Team 1
      const damage2 = Math.floor(team2Stats.attack * (0.8 + Math.random() * 0.4))
      team1Health -= damage2
      logs.push(`⚔️ Round ${round}: Team 2 deals ${damage2} damage to Team 1`)
      
      round++
    }
    
    // Determine winner
    let winner: 'team1' | 'team2' | 'draw' = 'draw'
    if (team1Health > team2Health) {
      winner = 'team1'
      logs.push(`🏆 Team 1 wins with ${team1Health} HP remaining!`)
    } else if (team2Health > team1Health) {
      winner = 'team2'
      logs.push(`🏆 Team 2 wins with ${team2Health} HP remaining!`)
    } else {
      logs.push(`🤝 Battle ends in a draw!`)
    }
    
    // Generate rewards
    const rewards = generateBattleRewards(battle.participants, winner, battle.teams)
    
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
    
    // Update circle last battle time
    await updateDoc(doc(db, 'circles', battle.circleId), {
      lastBattleAt: new Date().toISOString()
    })
    
    // Award rewards to players
    await awardRewards(rewards)
    
  } catch (error) {
    console.error('Error simulating battle:', error)
  }
}

const calculateTeamStats = (players: (Player & { id: string })[]): {
  attack: number;
  defense: number;
  health: number;
} => {
  return players.reduce((total, player) => ({
    attack: total.attack + player.stats.attack,
    defense: total.defense + player.stats.defense,
    health: total.health + player.stats.health
  }), { attack: 0, defense: 0, health: 0 })
}

const generateBattleRewards = (
  participants: string[],
  winner: 'team1' | 'team2' | 'draw',
  teams: { team1: string[]; team2: string[] }
): BattleReward[] => {
  const rewards: BattleReward[] = []
  
  participants.forEach(userId => {
    const isWinner = (winner === 'team1' && teams.team1.includes(userId)) ||
                    (winner === 'team2' && teams.team2.includes(userId))
    
    const baseExp = 50
    const winBonus = isWinner ? 25 : 0
    const experience = baseExp + winBonus
    
    rewards.push({
      userId,
      experience,
      items: Math.random() > 0.7 ? [generateRandomItem()] : [],
      currency: Math.floor(Math.random() * 20) + 10
    })
  })
  
  return rewards
}

const generateRandomItem = (): Item => {
  const types: Item['type'][] = ['weapon', 'armor', 'accessory', 'consumable']
  const rarities: Item['rarity'][] = ['common', 'rare', 'epic', 'legendary']
  
  const type = types[Math.floor(Math.random() * types.length)]
  const rarity = rarities[Math.floor(Math.random() * rarities.length)]
  
  const rarityMultiplier = {
    common: 1,
    rare: 1.5,
    epic: 2,
    legendary: 3
  }[rarity]
  
  const baseStats = {
    attack: Math.floor(Math.random() * 10 + 5) * rarityMultiplier,
    defense: Math.floor(Math.random() * 10 + 5) * rarityMultiplier,
    health: Math.floor(Math.random() * 50 + 25) * rarityMultiplier
  }
  
  return {
    id: `item_${Date.now()}_${Math.random()}`,
    name: `${rarity} ${type}`,
    type,
    rarity,
    stats: baseStats,
    description: `A ${rarity} ${type} found in battle`,
    icon: `icon_${type}`,
    tradeable: rarity !== 'legendary',
    forgeable: true
  }
}

const awardRewards = async (rewards: BattleReward[]): Promise<void> => {
  try {
    for (const reward of rewards) {
      // Update player experience and items
      const playersQuery = query(
        collection(db, 'players'),
        where('userId', '==', reward.userId)
      )
      const playersSnapshot = await getDocs(playersQuery)
      
      if (!playersSnapshot.empty) {
        const playerDoc = playersSnapshot.docs[0]
        const player = playerDoc.data() as Player
        
        await updateDoc(playerDoc.ref, {
          experience: player.experience + reward.experience,
          lastBattleAt: new Date()
        })
      }
    }
  } catch (error) {
    console.error('Error awarding rewards:', error)
  }
}

export const getBattleHistory = async (
  circleId: string,
  limitCount: number = 10
): Promise<Battle[]> => {
  try {
    const battlesQuery = query(
      collection(db, 'battles'),
      where('circleId', '==', circleId),
      orderBy('startedAt', 'desc'),
      limit(limitCount)
    )
    
    const snapshot = await getDocs(battlesQuery)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Battle[]
  } catch (error) {
    console.error('Error fetching battle history:', error)
    return []
  }
}

export const scheduleAutoBattle = async (circleId: string): Promise<void> => {
  try {
    const circleDoc = await getDoc(doc(db, 'circles', circleId))
    if (!circleDoc.exists()) return
    
    const circle = circleDoc.data() as Circle
    const now = new Date()
    let lastBattle = new Date(0) // Default to epoch
    
    if (circle.lastBattleAt) {
      try {
        lastBattle = new Date(circle.lastBattleAt)
        // Validate the date
        if (isNaN(lastBattle.getTime())) {
          lastBattle = new Date(0)
        }
      } catch (error) {
        console.error('Error parsing lastBattleAt:', error)
        lastBattle = new Date(0)
      }
    }
    
    const timeSinceLastBattle = now.getTime() - lastBattle.getTime()
    const battleInterval = circle.settings.battleInterval * 60 * 1000 // Convert to milliseconds
    
    if (timeSinceLastBattle >= battleInterval) {
      await createCircleBattle(circleId, 'auto')
    }
  } catch (error) {
    console.error('Error scheduling auto battle:', error)
  }
}