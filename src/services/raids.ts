import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc,
  getDoc,
  getDocs, 
  query, 
  where, 
  orderBy,
  limit,
  onSnapshot,
  Timestamp
} from 'firebase/firestore'
import { db } from './firebase'
import { BossRaid, RaidTemplate, RaidParticipant, WeeklyRaidSchedule } from '../types/raids'
import { RAID_TEMPLATES } from '../data/raidTemplates'
import { User } from '../types'

export const createRaid = async (
  templateId: string,
  difficulty: 'normal' | 'hard' | 'nightmare' | 'hell',
  hostUserId: string
): Promise<{ success: boolean; raidId?: string; error?: string }> => {
  try {
    const template = RAID_TEMPLATES.find(t => t.id === templateId)
    if (!template) {
      return { success: false, error: 'Raid template not found' }
    }

    const difficultyMultiplier = template.difficultyMultipliers[difficulty]
    const scaledBoss = {
      ...template.bossTemplate,
      stats: {
        ...template.bossTemplate.stats,
        attack: Math.floor(template.bossTemplate.stats.attack * difficultyMultiplier),
        defense: Math.floor(template.bossTemplate.stats.defense * difficultyMultiplier),
        health: Math.floor(template.bossTemplate.stats.health * difficultyMultiplier),
        speed: Math.floor(template.bossTemplate.stats.speed * difficultyMultiplier),
        critRate: Math.min(0.8, template.bossTemplate.stats.critRate * difficultyMultiplier),
        critDamage: template.bossTemplate.stats.critDamage * difficultyMultiplier
      },
      totalHealth: Math.floor(template.bossTemplate.totalHealth * difficultyMultiplier),
      currentHealth: Math.floor(template.bossTemplate.totalHealth * difficultyMultiplier),
      currentPhase: 0,
      enraged: false
    }

    const now = new Date()
    const raid: Omit<BossRaid, 'id'> = {
      name: template.name,
      description: template.description,
      boss: scaledBoss,
      difficulty,
      requiredPlayers: 3,
      maxPlayers: 10,
      duration: difficulty === 'hell' ? 30 : difficulty === 'nightmare' ? 25 : difficulty === 'hard' ? 20 : 15,
      cooldown: 24, // 24 hours
      rewards: template.baseRewards.map(reward => ({
        ...reward,
        value: Math.floor(reward.value * difficultyMultiplier)
      })),
      status: 'upcoming',
      startTime: new Date(now.getTime() + 5 * 60 * 1000), // Start in 5 minutes
      endTime: new Date(now.getTime() + (difficulty === 'hell' ? 30 : 15) * 60 * 1000 + 5 * 60 * 1000),
      participants: [],
      totalDamageDealt: 0,
      createdAt: now,
      updatedAt: now
    }

    const raidRef = await addDoc(collection(db, 'raids'), raid)
    console.log('Raid created:', raidRef.id)

    return { success: true, raidId: raidRef.id }
  } catch (error) {
    console.error('Error creating raid:', error)
    return { success: false, error: 'Failed to create raid' }
  }
}

export const joinRaid = async (raidId: string, userId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const raidRef = doc(db, 'raids', raidId)
    const raidDoc = await getDoc(raidRef)
    
    if (!raidDoc.exists()) {
      return { success: false, error: 'Raid not found' }
    }

    const raid = raidDoc.data() as BossRaid
    
    if (raid.status !== 'upcoming') {
      return { success: false, error: 'Raid has already started or ended' }
    }

    if (raid.participants.length >= raid.maxPlayers) {
      return { success: false, error: 'Raid is full' }
    }

    if (raid.participants.some(p => p.userId === userId)) {
      return { success: false, error: 'Already joined this raid' }
    }

    // Get user data
    const userDoc = await getDoc(doc(db, 'users', userId))
    if (!userDoc.exists()) {
      return { success: false, error: 'User not found' }
    }

    const user = userDoc.data() as User
    
    // Check level requirements
    const template = RAID_TEMPLATES.find(t => t.name === raid.name)
    if (template && user.level < template.minLevel) {
      return { success: false, error: `Minimum level ${template.minLevel} required` }
    }

    const newParticipant: RaidParticipant = {
      userId,
      userName: user.displayName || 'Player',
      level: user.level,
      class: user.playerClass || 'warrior',
      damageDealt: 0,
      healingDone: 0,
      damageReceived: 0,
      deathCount: 0,
      joinedAt: new Date(),
      status: 'alive',
      contributions: []
    }

    await updateDoc(raidRef, {
      participants: [...raid.participants, newParticipant],
      updatedAt: new Date()
    })

    return { success: true }
  } catch (error) {
    console.error('Error joining raid:', error)
    return { success: false, error: 'Failed to join raid' }
  }
}

export const startRaid = async (raidId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const raidRef = doc(db, 'raids', raidId)
    const raidDoc = await getDoc(raidRef)
    
    if (!raidDoc.exists()) {
      return { success: false, error: 'Raid not found' }
    }

    const raid = raidDoc.data() as BossRaid
    
    if (raid.status !== 'upcoming') {
      return { success: false, error: 'Raid cannot be started' }
    }

    if (raid.participants.length < raid.requiredPlayers) {
      return { success: false, error: `Need at least ${raid.requiredPlayers} players` }
    }

    await updateDoc(raidRef, {
      status: 'active',
      startTime: new Date(),
      updatedAt: new Date()
    })

    // Start raid timer
    setTimeout(async () => {
      const updatedRaidDoc = await getDoc(raidRef)
      if (updatedRaidDoc.exists()) {
        const updatedRaid = updatedRaidDoc.data() as BossRaid
        if (updatedRaid.status === 'active') {
          await updateDoc(raidRef, {
            status: 'failed',
            endTime: new Date(),
            updatedAt: new Date()
          })
        }
      }
    }, raid.duration * 60 * 1000)

    return { success: true }
  } catch (error) {
    console.error('Error starting raid:', error)
    return { success: false, error: 'Failed to start raid' }
  }
}

export const dealDamageToRaidBoss = async (
  raidId: string,
  userId: string,
  damage: number
): Promise<{ success: boolean; bossDefeated?: boolean; error?: string }> => {
  try {
    const raidRef = doc(db, 'raids', raidId)
    const raidDoc = await getDoc(raidRef)
    
    if (!raidDoc.exists()) {
      return { success: false, error: 'Raid not found' }
    }

    const raid = raidDoc.data() as BossRaid
    
    if (raid.status !== 'active') {
      return { success: false, error: 'Raid is not active' }
    }

    // Update participant damage
    const participantIndex = raid.participants.findIndex(p => p.userId === userId)
    if (participantIndex === -1) {
      return { success: false, error: 'Player not in raid' }
    }

    const updatedParticipants = [...raid.participants]
    updatedParticipants[participantIndex].damageDealt += damage
    updatedParticipants[participantIndex].contributions.push({
      type: 'damage',
      amount: damage,
      timestamp: new Date(),
      details: `Dealt ${damage} damage to ${raid.boss.name}`
    })

    // Update boss health
    const newBossHealth = Math.max(0, raid.boss.currentHealth - damage)
    const bossDefeated = newBossHealth <= 0

    // Check for phase transitions
    let newPhase = raid.boss.currentPhase
    if (!bossDefeated) {
      const healthPercentage = (newBossHealth / raid.boss.totalHealth) * 100
      const nextPhase = raid.boss.phases.find(phase => 
        phase.healthThreshold <= healthPercentage && 
        raid.boss.phases.indexOf(phase) > raid.boss.currentPhase
      )
      if (nextPhase) {
        newPhase = raid.boss.phases.indexOf(nextPhase)
      }
    }

    const updateData: any = {
      'boss.currentHealth': newBossHealth,
      'boss.currentPhase': newPhase,
      participants: updatedParticipants,
      totalDamageDealt: raid.totalDamageDealt + damage,
      updatedAt: new Date()
    }

    if (bossDefeated) {
      updateData.status = 'completed'
      updateData.endTime = new Date()
    }

    await updateDoc(raidRef, updateData)

    return { success: true, bossDefeated }
  } catch (error) {
    console.error('Error dealing damage to raid boss:', error)
    return { success: false, error: 'Failed to deal damage' }
  }
}

export const getActiveRaids = async (): Promise<BossRaid[]> => {
  try {
    const raidsQuery = query(
      collection(db, 'raids'),
      where('status', 'in', ['upcoming', 'active']),
      orderBy('startTime', 'asc'),
      limit(10)
    )
    
    const raidsSnapshot = await getDocs(raidsQuery)
    return raidsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as BossRaid))
  } catch (error) {
    console.error('Error getting active raids:', error)
    return []
  }
}

export const getRaidHistory = async (userId: string): Promise<BossRaid[]> => {
  try {
    const raidsQuery = query(
      collection(db, 'raids'),
      where('participants', 'array-contains', { userId }),
      orderBy('endTime', 'desc'),
      limit(20)
    )
    
    const raidsSnapshot = await getDocs(raidsQuery)
    return raidsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as BossRaid))
  } catch (error) {
    console.error('Error getting raid history:', error)
    return []
  }
}

export const generateWeeklyRaidSchedule = async (): Promise<WeeklyRaidSchedule> => {
  const now = new Date()
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
  const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)

  // Select 3-5 random raids for the week
  const availableRaids = RAID_TEMPLATES
    .sort(() => 0.5 - Math.random())
    .slice(0, 3 + Math.floor(Math.random() * 3))
    .map(template => template.id)

  const schedule: WeeklyRaidSchedule = {
    id: `week_${weekStart.getTime()}`,
    weekStart,
    weekEnd,
    availableRaids,
    completedRaids: [],
    bonusMultiplier: 1.0 + Math.random() * 0.5, // 1.0x to 1.5x bonus
    specialEvent: Math.random() > 0.7 ? 'Double XP Weekend' : undefined
  }

  return schedule
}

export const subscribeToRaid = (raidId: string, callback: (raid: BossRaid | null) => void) => {
  const raidRef = doc(db, 'raids', raidId)
  return onSnapshot(raidRef, (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() } as BossRaid)
    } else {
      callback(null)
    }
  })
}