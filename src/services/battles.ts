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
    console.log('Creating circle battle for:', circleId, 'type:', type)
    
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
    
    console.log('Found players for battle:', players.length, players)
    
    if (players.length < 2) {
      return { success: false, error: `Need at least 2 players for battle. Found ${players.length} players. Make sure all circle members have joined as players.` }
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
    console.log('Starting battle simulation for:', battleId, 'with players:', players.length)
    const battleRef = doc(db, 'battles', battleId)
    const battleDoc = await getDoc(battleRef)
    
    if (!battleDoc.exists()) {
      console.error('Battle document not found:', battleId)
      return
    }
    
    const battle = battleDoc.data() as Battle
    console.log('Battle data loaded:', battle)
    
    // Get players for each team
    const team1Players = players.filter(p => battle.teams?.team1.includes(p.userId))
    const team2Players = players.filter(p => battle.teams?.team2.includes(p.userId))
    
    console.log('Team 1 players:', team1Players.length, team1Players)
    console.log('Team 2 players:', team2Players.length, team2Players)
    
    // Calculate team stats
    const team1Stats = calculateTeamStats(team1Players)
    const team2Stats = calculateTeamStats(team2Players)
    
    console.log('Team 1 stats:', team1Stats)
    console.log('Team 2 stats:', team2Stats)
    
    // Simulate battle rounds with individual player targeting
    const logs: string[] = []
    
    // Create individual player health tracking
    const team1PlayerHealth = team1Players.map(p => ({
      player: p,
      health: p.stats.health,
      maxHealth: p.stats.health
    }))
    
    const team2PlayerHealth = team2Players.map(p => ({
      player: p,
      health: p.stats.health,
      maxHealth: p.stats.health
    }))
    
    logs.push(`🔥 Battle begins! Team 1 (${team1Players.length} players) vs Team 2 (${team2Players.length} players)`)
    logs.push(`👥 Team 1: ${team1Players.map(p => p.userId).join(', ')}`)
    logs.push(`👥 Team 2: ${team2Players.map(p => p.userId).join(', ')}`)
    
    let round = 1
    while (team1PlayerHealth.some(p => p.health > 0) && team2PlayerHealth.some(p => p.health > 0) && round <= 15) {
      
      // Team 1 attacks Team 2 (all team 1 players attack same target)
      const aliveTeam1 = team1PlayerHealth.filter(p => p.health > 0)
      const aliveTeam2 = team2PlayerHealth.filter(p => p.health > 0)
      
      if (aliveTeam1.length > 0 && aliveTeam2.length > 0) {
        // Pick random target from Team 2
        const target = aliveTeam2[Math.floor(Math.random() * aliveTeam2.length)]
        let totalDamage = 0
        
        // Each alive Team 1 player attacks the same target
        for (const attacker of aliveTeam1) {
          const isCrit = Math.random() < 0.1
          const baseDamage = Math.floor(attacker.player.stats.attack * (0.8 + Math.random() * 0.3))
          const damage = isCrit ? Math.floor(baseDamage * 1.5) : baseDamage
          totalDamage += damage
        }
        
        target.health = Math.max(0, target.health - totalDamage)
        logs.push(`⚔️ Round ${round}: Team 1 focuses fire on ${target.player.userId}, dealing ${totalDamage} total damage`)
        
        if (target.health <= 0) {
          logs.push(`💀 ${target.player.userId} from Team 2 is defeated!`)
        }
      }
      
      // Check if Team 2 is eliminated
      if (!team2PlayerHealth.some(p => p.health > 0)) break
      
      // Team 2 attacks Team 1 (all team 2 players attack same target)
      const stillAliveTeam1 = team1PlayerHealth.filter(p => p.health > 0)
      const stillAliveTeam2 = team2PlayerHealth.filter(p => p.health > 0)
      
      if (stillAliveTeam2.length > 0 && stillAliveTeam1.length > 0) {
        // Pick random target from Team 1
        const target = stillAliveTeam1[Math.floor(Math.random() * stillAliveTeam1.length)]
        let totalDamage = 0
        
        // Each alive Team 2 player attacks the same target
        for (const attacker of stillAliveTeam2) {
          const isCrit = Math.random() < 0.1
          const baseDamage = Math.floor(attacker.player.stats.attack * (0.8 + Math.random() * 0.3))
          const damage = isCrit ? Math.floor(baseDamage * 1.5) : baseDamage
          totalDamage += damage
        }
        
        target.health = Math.max(0, target.health - totalDamage)
        logs.push(`🩸 Round ${round}: Team 2 focuses fire on ${target.player.userId}, dealing ${totalDamage} total damage`)
        
        if (target.health <= 0) {
          logs.push(`💀 ${target.player.userId} from Team 1 is defeated!`)
        }
      }
      
      // Add battle status every 3 rounds
      if (round % 3 === 0) {
        const team1Alive = team1PlayerHealth.filter(p => p.health > 0).length
        const team2Alive = team2PlayerHealth.filter(p => p.health > 0).length
        logs.push(`📊 Round ${round}: Team 1 (${team1Alive} alive) vs Team 2 (${team2Alive} alive)`)
      }
      
      round++
    }
    
    // Determine winner based on surviving players
    let winner: 'team1' | 'team2' | 'draw' = 'draw'
    const team1Survivors = team1PlayerHealth.filter(p => p.health > 0)
    const team2Survivors = team2PlayerHealth.filter(p => p.health > 0)
    
    if (team1Survivors.length > 0 && team2Survivors.length === 0) {
      winner = 'team1'
      logs.push(`🏆 Team 1 wins with ${team1Survivors.length} survivor(s)!`)
      logs.push(`🎉 Survivors: ${team1Survivors.map(p => p.player.userId).join(', ')}`)
    } else if (team2Survivors.length > 0 && team1Survivors.length === 0) {
      winner = 'team2'
      logs.push(`🏆 Team 2 wins with ${team2Survivors.length} survivor(s)!`)
      logs.push(`🎉 Survivors: ${team2Survivors.map(p => p.player.userId).join(', ')}`)
    } else if (team1Survivors.length > team2Survivors.length) {
      winner = 'team1'
      logs.push(`🏆 Team 1 wins by elimination! (${team1Survivors.length} vs ${team2Survivors.length} survivors)`)
    } else if (team2Survivors.length > team1Survivors.length) {
      winner = 'team2'
      logs.push(`🏆 Team 2 wins by elimination! (${team2Survivors.length} vs ${team1Survivors.length} survivors)`)
    } else {
      logs.push(`🤝 Battle ends in a draw! Both teams have ${team1Survivors.length} survivors.`)
    }
    
    // Generate rewards
    const rewards = generateBattleRewards(battle.participants, winner, battle.teams || { team1: [], team2: [] })
    
    // Update battle with results
    console.log('Updating battle with results:', { winner, rewards, logs })
    await updateDoc(battleRef, {
      result: {
        winner,
        rewards,
        logs
      },
      completedAt: new Date(),
      status: 'completed'
    })
    console.log('Battle updated successfully')
    
    // Update circle last battle time
    if (battle.circleId) {
      console.log('Updating circle last battle time for:', battle.circleId)
      await updateDoc(doc(db, 'circles', battle.circleId), {
        lastBattleAt: new Date().toISOString()
      })
    }
    
    // Award rewards to players
    console.log('Awarding rewards to players')
    await awardRewards(rewards)
    console.log('Battle simulation completed successfully')
    
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
    console.log('Fetching battle history for circle:', circleId)
    const battlesQuery = query(
      collection(db, 'battles'),
      where('circleId', '==', circleId),
      orderBy('startedAt', 'desc'),
      limit(limitCount)
    )
    
    const snapshot = await getDocs(battlesQuery)
    const battles = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Battle[]
    
    console.log('Found battles:', battles.length, battles)
    return battles
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