import { Monster, PlayerStats } from '../types'

interface MonsterTemplate {
  names: string[]
  baseStats: PlayerStats
  icon: string
  description: string
  levelRange: [number, number]
}

const MONSTER_TEMPLATES: MonsterTemplate[] = [
  {
    names: ['Goblin Scout', 'Goblin Warrior', 'Goblin Shaman'],
    baseStats: { attack: 8, defense: 6, health: 80, speed: 12, critRate: 0.03, critDamage: 1.3 },
    icon: '👹',
    description: 'A cunning goblin seeking treasure',
    levelRange: [1, 15]
  },
  {
    names: ['Forest Wolf', 'Dire Wolf', 'Alpha Wolf'],
    baseStats: { attack: 12, defense: 8, health: 100, speed: 15, critRate: 0.08, critDamage: 1.4 },
    icon: '🐺',
    description: 'A fierce predator of the wild',
    levelRange: [5, 25]
  },
  {
    names: ['Cave Spider', 'Giant Spider', 'Venomous Spider'],
    baseStats: { attack: 10, defense: 5, health: 70, speed: 18, critRate: 0.12, critDamage: 1.6 },
    icon: '🕷️',
    description: 'A deadly arachnid with venomous fangs',
    levelRange: [8, 30]
  },
  {
    names: ['Skeleton Warrior', 'Undead Knight', 'Bone Lord'],
    baseStats: { attack: 14, defense: 12, health: 120, speed: 8, critRate: 0.05, critDamage: 1.5 },
    icon: '💀',
    description: 'An undead warrior risen from the grave',
    levelRange: [10, 35]
  },
  {
    names: ['Orc Berserker', 'Orc Chieftain', 'Orc Warlord'],
    baseStats: { attack: 18, defense: 15, health: 160, speed: 10, critRate: 0.06, critDamage: 1.7 },
    icon: '👹',
    description: 'A brutal orc warrior hungry for battle',
    levelRange: [15, 45]
  },
  {
    names: ['Fire Elemental', 'Inferno Spirit', 'Flame Lord'],
    baseStats: { attack: 22, defense: 10, health: 140, speed: 14, critRate: 0.15, critDamage: 2.0 },
    icon: '🔥',
    description: 'A being of pure fire and destruction',
    levelRange: [20, 50]
  },
  {
    names: ['Ice Golem', 'Frost Giant', 'Glacial Titan'],
    baseStats: { attack: 16, defense: 25, health: 220, speed: 6, critRate: 0.02, critDamage: 1.2 },
    icon: '🧊',
    description: 'A massive creature of ice and stone',
    levelRange: [25, 60]
  },
  {
    names: ['Shadow Assassin', 'Dark Wraith', 'Void Stalker'],
    baseStats: { attack: 25, defense: 8, health: 110, speed: 22, critRate: 0.25, critDamage: 2.5 },
    icon: '👤',
    description: 'A creature that lurks in the shadows',
    levelRange: [30, 70]
  },
  {
    names: ['Ancient Dragon', 'Elder Wyrm', 'Primordial Beast'],
    baseStats: { attack: 35, defense: 30, health: 350, speed: 16, critRate: 0.18, critDamage: 2.2 },
    icon: '🐉',
    description: 'A legendary beast of immense power',
    levelRange: [50, 100]
  }
]

export const generateMonster = (playerLevel: number, playerCount: number = 1): Monster => {
  // Filter monsters suitable for player level (±5 levels)
  const suitableTemplates = MONSTER_TEMPLATES.filter(template => 
    playerLevel >= template.levelRange[0] - 5 && 
    playerLevel <= template.levelRange[1] + 5
  )
  
  // Fallback to first template if none suitable
  const template = suitableTemplates.length > 0 
    ? suitableTemplates[Math.floor(Math.random() * suitableTemplates.length)]
    : MONSTER_TEMPLATES[0]
  
  // Generate monster level (±3 levels from player for more variety)
  const monsterLevel = Math.max(1, playerLevel + Math.floor(Math.random() * 7) - 3)
  
  // Scale stats based on level and player count
  const levelMultiplier = 1 + (monsterLevel - 1) * 0.12
  const groupMultiplier = Math.sqrt(playerCount) * 0.8 // Slightly reduce group scaling for more decisive battles
  
  const scaledStats: PlayerStats = {
    attack: Math.floor(template.baseStats.attack * levelMultiplier * groupMultiplier),
    defense: Math.floor(template.baseStats.defense * levelMultiplier * groupMultiplier),
    health: Math.floor(template.baseStats.health * levelMultiplier * groupMultiplier),
    speed: Math.floor(template.baseStats.speed * levelMultiplier),
    critRate: Math.min(0.3, template.baseStats.critRate * levelMultiplier),
    critDamage: template.baseStats.critDamage
  }
  
  // Select appropriate name based on level
  const nameIndex = Math.min(
    template.names.length - 1,
    Math.floor((monsterLevel - template.levelRange[0]) / ((template.levelRange[1] - template.levelRange[0]) / template.names.length))
  )
  
  const monster: Monster = {
    id: `monster_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: template.names[nameIndex],
    level: monsterLevel,
    stats: scaledStats,
    icon: template.icon,
    description: template.description,
    rewards: {
      experienceRange: [
        Math.floor(40 + monsterLevel * 8),
        Math.floor(60 + monsterLevel * 12)
      ],
      itemDropChance: Math.min(0.4, 0.15 + monsterLevel * 0.005),
      currencyRange: [
        Math.floor(10 + monsterLevel * 2),
        Math.floor(25 + monsterLevel * 4)
      ]
    }
  }
  
  return monster
}

export const getMonsterRarityColor = (level: number): string => {
  if (level <= 10) return 'text-green-400'
  if (level <= 25) return 'text-blue-400'
  if (level <= 45) return 'text-purple-400'
  if (level <= 70) return 'text-orange-400'
  return 'text-red-400'
}

export const getMonsterRarityName = (level: number): string => {
  if (level <= 10) return 'Common'
  if (level <= 25) return 'Rare'
  if (level <= 45) return 'Epic'
  if (level <= 70) return 'Legendary'
  return 'Mythic'
}