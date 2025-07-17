export interface User {
  id: string
  email: string
  displayName: string
  avatar?: string
  level: number
  experience: number
  createdAt: Date
  lastActive: Date
  lastSoloBattleAt?: Date
  circles: string[]
}

export interface Circle {
  id: string
  name: string
  description: string
  ownerId: string
  members: string[]
  maxMembers: number
  inviteCode: string
  isPrivate: boolean
  createdAt: Date
  lastBattleAt?: Date
  settings: {
    battleInterval: number // minutes
    allowForging: boolean
    allowTrades: boolean
  }
}

export interface Player {
  userId: string
  circleId: string
  role: 'offense' | 'defense' | 'support'
  level: number
  experience: number
  loadout: Loadout
  stats: PlayerStats
  joinedAt: Date
  lastBattleAt?: Date
  isOnline: boolean
}

export interface PlayerStats {
  attack: number
  defense: number
  health: number
  speed: number
  critRate: number
  critDamage: number
}

export interface Loadout {
  weapon?: Item
  armor?: Item
  accessory?: Item
  consumable?: Item
}

export interface Item {
  id: string
  name: string
  type: 'weapon' | 'armor' | 'accessory' | 'consumable'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  stats: Partial<PlayerStats>
  description: string
  icon: string
  tradeable: boolean
  forgeable: boolean
}

export interface Monster {
  id: string
  name: string
  level: number
  stats: PlayerStats
  icon: string
  description: string
  rewards: {
    experienceRange: [number, number]
    itemDropChance: number
    currencyRange: [number, number]
  }
}

export interface Battle {
  id: string
  circleId?: string // Optional for solo battles
  type: 'auto' | 'event' | 'challenge' | 'solo'
  participants: string[]
  teams?: {
    team1: string[]
    team2: string[]
  }
  monster?: Monster // For solo battles
  result: {
    winner: 'team1' | 'team2' | 'player' | 'monster' | 'draw'
    rewards: BattleReward[]
    logs: string[]
  }
  startedAt: Date
  completedAt?: Date
  status: 'pending' | 'active' | 'completed'
}

export interface BattleReward {
  userId: string
  experience: number
  items: Item[]
  currency?: number
}

export interface Activity {
  id: string
  circleId: string
  userId: string
  type: 'level_up' | 'item_found' | 'battle_won' | 'joined_circle' | 'forge_complete'
  message: string
  data: any
  timestamp: Date
  reactions: {
    userId: string
    emoji: string
  }[]
  comments: Comment[]
}

export interface Comment {
  id: string
  userId: string
  message: string
  timestamp: Date
}

export interface ForgeRequest {
  id: string
  circleId: string
  initiatorId: string
  targetId: string
  items: {
    initiator: Item[]
    target: Item[]
  }
  status: 'pending' | 'accepted' | 'rejected' | 'completed'
  result?: Item[]
  createdAt: Date
  completedAt?: Date
}

export interface WeeklyEvent {
  id: string
  name: string
  description: string
  type: 'boss' | 'challenge' | 'hidden'
  requirements: {
    minLevel?: number
    minMembers?: number
    allOnline?: boolean
  }
  rewards: Item[]
  startDate: Date
  endDate: Date
  participatingCircles: string[]
  isActive: boolean
}

export interface Synergy {
  id: string
  name: string
  description: string
  requirements: {
    roles: ('offense' | 'defense' | 'support')[]
    minLevel?: number
  }
  bonus: {
    statsMultiplier: number
    ultimateSkill?: string
  }
  isActive: boolean
}