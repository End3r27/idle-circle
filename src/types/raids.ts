import { Monster, PlayerStats, User } from './index'

export interface BossRaid {
  id: string
  name: string
  description: string
  boss: RaidBoss
  difficulty: 'normal' | 'hard' | 'nightmare' | 'hell'
  requiredPlayers: number
  maxPlayers: number
  duration: number // in minutes
  cooldown: number // in hours
  rewards: RaidReward[]
  status: 'upcoming' | 'active' | 'completed' | 'failed'
  startTime: Date
  endTime: Date
  expirationTime: Date // Raid expires after 30 minutes regardless of status
  participants: RaidParticipant[]
  totalDamageDealt: number
  createdAt: Date
  updatedAt: Date
}

export interface RaidBoss extends Monster {
  phases: BossPhase[]
  currentPhase: number
  totalHealth: number
  currentHealth: number
  enrageTimer: number // minutes until enrage
  enraged: boolean
  specialMechanics: BossMechanic[]
  resistances: { [element: string]: number }
  vulnerabilities: { [element: string]: number }
}

export interface BossPhase {
  id: string
  name: string
  healthThreshold: number // percentage of health when this phase starts
  description: string
  newAbilities: string[]
  removedAbilities: string[]
  statChanges: Partial<PlayerStats>
  specialEffects: string[]
}

export interface BossMechanic {
  id: string
  name: string
  description: string
  triggerCondition: string
  effect: string
  damageType: 'physical' | 'magical' | 'true'
  cooldown: number
  aoeRadius?: number
  duration?: number
}

export interface RaidParticipant {
  userId: string
  userName: string
  level: number
  class: string
  damageDealt: number
  healingDone: number
  damageReceived: number
  deathCount: number
  joinedAt: Date
  status: 'alive' | 'dead' | 'disconnected'
  contributions: RaidContribution[]
}

export interface RaidContribution {
  type: 'damage' | 'healing' | 'tanking' | 'support'
  amount: number
  timestamp: Date
  details: string
}

export interface RaidReward {
  type: 'experience' | 'currency' | 'item' | 'title' | 'achievement'
  value: number
  itemId?: string
  titleId?: string
  achievementId?: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic'
  contributionRequired: number // minimum contribution to earn this reward
}

export interface WeeklyRaidSchedule {
  id: string
  weekStart: Date
  weekEnd: Date
  availableRaids: string[] // raid template IDs
  completedRaids: string[] // completed raid IDs
  bonusMultiplier: number
  specialEvent?: string
}

export interface RaidTemplate {
  id: string
  name: string
  description: string
  minLevel: number
  maxLevel: number
  bossTemplate: Omit<RaidBoss, 'currentHealth' | 'currentPhase' | 'enraged'>
  baseRewards: RaidReward[]
  difficultyMultipliers: {
    normal: number
    hard: number
    nightmare: number
    hell: number
  }
  unlockRequirements: {
    level?: number
    completedRaids?: string[]
    achievements?: string[]
  }
}

export interface RaidStats {
  totalRaidsAttempted: number
  totalRaidsCompleted: number
  totalDamageDealt: number
  totalHealingDone: number
  favoriteRaid: string
  bestTime: number
  highestDamageInSingleRaid: number
  totalRewardsEarned: number
  raidRanking: number
}