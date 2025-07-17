export interface ClassPassive {
  id: string
  name: string
  description: string
  effect: {
    type: 'stat_bonus' | 'damage_bonus' | 'heal' | 'crit_bonus' | 'speed_bonus' | 'defense_bonus' | 'experience_bonus'
    value: number
    condition?: 'on_attack' | 'on_defend' | 'on_crit' | 'on_kill' | 'always' | 'low_health'
  }
}

export interface ClassBuff {
  id: string
  name: string
  description: string
  statBonuses: {
    attack?: number
    defense?: number
    health?: number
    speed?: number
    critRate?: number
    critDamage?: number
  }
}

export interface PlayerClass {
  id: string
  name: string
  description: string
  icon: string
  color: string
  buffs: ClassBuff[]
  passives: ClassPassive[]
  startingStats: {
    attack: number
    defense: number
    health: number
    speed: number
    critRate: number
    critDamage: number
  }
}

export const PLAYER_CLASSES: PlayerClass[] = [
  {
    id: 'warrior',
    name: 'Warrior',
    description: 'A mighty fighter with high health and defense. Excels in prolonged battles.',
    icon: '⚔️',
    color: 'from-red-500 to-red-700',
    buffs: [
      {
        id: 'warrior_might',
        name: 'Warrior\'s Might',
        description: '+20% Attack and +30% Health',
        statBonuses: {
          attack: 0.2,
          health: 0.3
        }
      }
    ],
    passives: [
      {
        id: 'battle_hardened',
        name: 'Battle Hardened',
        description: 'Gain +5% damage reduction per battle survived',
        effect: {
          type: 'defense_bonus',
          value: 0.05,
          condition: 'always'
        }
      },
      {
        id: 'berserker_rage',
        name: 'Berserker Rage',
        description: 'Deal +50% damage when below 30% health',
        effect: {
          type: 'damage_bonus',
          value: 0.5,
          condition: 'low_health'
        }
      }
    ],
    startingStats: {
      attack: 15,
      defense: 18,
      health: 120,
      speed: 8,
      critRate: 0.05,
      critDamage: 1.4
    }
  },
  {
    id: 'rogue',
    name: 'Rogue',
    description: 'A swift assassin with high critical hit chance and speed. Strikes fast and hard.',
    icon: '🗡️',
    color: 'from-purple-500 to-purple-700',
    buffs: [
      {
        id: 'shadow_mastery',
        name: 'Shadow Mastery',
        description: '+40% Critical Rate and +25% Speed',
        statBonuses: {
          critRate: 0.4,
          speed: 0.25
        }
      }
    ],
    passives: [
      {
        id: 'backstab',
        name: 'Backstab',
        description: 'Critical hits deal +100% damage',
        effect: {
          type: 'crit_bonus',
          value: 1.0,
          condition: 'on_crit'
        }
      },
      {
        id: 'evasion',
        name: 'Evasion',
        description: '15% chance to dodge attacks completely',
        effect: {
          type: 'defense_bonus',
          value: 0.15,
          condition: 'on_defend'
        }
      }
    ],
    startingStats: {
      attack: 14,
      defense: 8,
      health: 80,
      speed: 18,
      critRate: 0.15,
      critDamage: 2.0
    }
  },
  {
    id: 'mage',
    name: 'Mage',
    description: 'A powerful spellcaster with devastating magical attacks. High damage but fragile.',
    icon: '🔮',
    color: 'from-blue-500 to-blue-700',
    buffs: [
      {
        id: 'arcane_power',
        name: 'Arcane Power',
        description: '+50% Attack and +30% Critical Damage',
        statBonuses: {
          attack: 0.5,
          critDamage: 0.3
        }
      }
    ],
    passives: [
      {
        id: 'spell_surge',
        name: 'Spell Surge',
        description: '20% chance to cast a bonus spell dealing 75% damage',
        effect: {
          type: 'damage_bonus',
          value: 0.75,
          condition: 'on_attack'
        }
      },
      {
        id: 'mana_shield',
        name: 'Mana Shield',
        description: 'Reduce damage taken by 10% per spell cast recently',
        effect: {
          type: 'defense_bonus',
          value: 0.1,
          condition: 'on_defend'
        }
      }
    ],
    startingStats: {
      attack: 20,
      defense: 6,
      health: 70,
      speed: 12,
      critRate: 0.12,
      critDamage: 1.8
    }
  },
  {
    id: 'paladin',
    name: 'Paladin',
    description: 'A holy warrior with balanced stats and healing abilities. Protects allies and endures.',
    icon: '🛡️',
    color: 'from-yellow-500 to-yellow-700',
    buffs: [
      {
        id: 'divine_blessing',
        name: 'Divine Blessing',
        description: '+25% Defense and +20% Health',
        statBonuses: {
          defense: 0.25,
          health: 0.2
        }
      }
    ],
    passives: [
      {
        id: 'holy_light',
        name: 'Holy Light',
        description: 'Heal 15% of max health after winning a battle',
        effect: {
          type: 'heal',
          value: 0.15,
          condition: 'on_kill'
        }
      },
      {
        id: 'righteous_fury',
        name: 'Righteous Fury',
        description: 'Deal +25% damage against evil enemies',
        effect: {
          type: 'damage_bonus',
          value: 0.25,
          condition: 'on_attack'
        }
      }
    ],
    startingStats: {
      attack: 12,
      defense: 15,
      health: 100,
      speed: 10,
      critRate: 0.08,
      critDamage: 1.5
    }
  },
  {
    id: 'ranger',
    name: 'Ranger',
    description: 'A skilled archer with balanced stats and nature magic. Excels at sustained damage.',
    icon: '🏹',
    color: 'from-green-500 to-green-700',
    buffs: [
      {
        id: 'nature_bond',
        name: 'Nature\'s Bond',
        description: '+15% to all stats',
        statBonuses: {
          attack: 0.15,
          defense: 0.15,
          health: 0.15,
          speed: 0.15,
          critRate: 0.15
        }
      }
    ],
    passives: [
      {
        id: 'hunters_mark',
        name: 'Hunter\'s Mark',
        description: 'Each attack increases damage by 10% (stacks up to 5 times)',
        effect: {
          type: 'damage_bonus',
          value: 0.1,
          condition: 'on_attack'
        }
      },
      {
        id: 'forest_camouflage',
        name: 'Forest Camouflage',
        description: 'First attack in battle always crits',
        effect: {
          type: 'crit_bonus',
          value: 1.0,
          condition: 'on_attack'
        }
      }
    ],
    startingStats: {
      attack: 13,
      defense: 12,
      health: 90,
      speed: 14,
      critRate: 0.1,
      critDamage: 1.6
    }
  },
  {
    id: 'berserker',
    name: 'Berserker',
    description: 'A wild fighter who grows stronger as battle continues. High risk, high reward.',
    icon: '🪓',
    color: 'from-orange-500 to-red-600',
    buffs: [
      {
        id: 'bloodlust',
        name: 'Bloodlust',
        description: '+35% Attack and +20% Critical Damage',
        statBonuses: {
          attack: 0.35,
          critDamage: 0.2
        }
      }
    ],
    passives: [
      {
        id: 'rampage',
        name: 'Rampage',
        description: 'Gain +20% attack for each enemy defeated',
        effect: {
          type: 'damage_bonus',
          value: 0.2,
          condition: 'on_kill'
        }
      },
      {
        id: 'unstoppable_force',
        name: 'Unstoppable Force',
        description: 'Cannot be reduced below 1 HP in first 3 attacks',
        effect: {
          type: 'defense_bonus',
          value: 0.9,
          condition: 'on_defend'
        }
      }
    ],
    startingStats: {
      attack: 18,
      defense: 6,
      health: 85,
      speed: 16,
      critRate: 0.12,
      critDamage: 1.7
    }
  },
  {
    id: 'monk',
    name: 'Monk',
    description: 'A disciplined fighter who gains experience faster and has unique combat flow.',
    icon: '👊',
    color: 'from-indigo-500 to-purple-600',
    buffs: [
      {
        id: 'inner_peace',
        name: 'Inner Peace',
        description: '+25% Speed and +10% Critical Rate',
        statBonuses: {
          speed: 0.25,
          critRate: 0.1
        }
      }
    ],
    passives: [
      {
        id: 'enlightenment',
        name: 'Enlightenment',
        description: 'Gain +50% experience from all sources',
        effect: {
          type: 'experience_bonus',
          value: 0.5,
          condition: 'always'
        }
      },
      {
        id: 'flow_state',
        name: 'Flow State',
        description: 'Every 3rd attack deals double damage',
        effect: {
          type: 'damage_bonus',
          value: 1.0,
          condition: 'on_attack'
        }
      }
    ],
    startingStats: {
      attack: 11,
      defense: 11,
      health: 85,
      speed: 15,
      critRate: 0.1,
      critDamage: 1.6
    }
  }
]

export const getClassById = (classId: string): PlayerClass | null => {
  return PLAYER_CLASSES.find(cls => cls.id === classId) || null
}

export const getClassColor = (classId: string): string => {
  const playerClass = getClassById(classId)
  return playerClass ? playerClass.color : 'from-gray-500 to-gray-700'
}

export const getClassIcon = (classId: string): string => {
  const playerClass = getClassById(classId)
  return playerClass ? playerClass.icon : '❓'
}