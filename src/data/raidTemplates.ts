import { RaidTemplate } from '../types/raids'

export const RAID_TEMPLATES: RaidTemplate[] = [
  {
    id: 'shadow_dragon',
    name: 'Shadow Dragon Malvoreth',
    description: 'An ancient dragon corrupted by dark magic. Its shadow breath can instantly kill unprepared adventurers.',
    minLevel: 20,
    maxLevel: 50,
    bossTemplate: {
      id: 'malvoreth',
      name: 'Malvoreth the Shadow Dragon',
      description: 'An ancient dragon corrupted by dark magic',
      icon: '🐉',
      level: 35,
      stats: {
        attack: 1500,
        defense: 800,
        health: 50000,
        speed: 120,
        critRate: 0.25,
        critDamage: 2.5
      },
      abilities: [
        {
          id: 'shadow_breath',
          name: 'Shadow Breath',
          description: 'Deals massive dark damage to all players',
          type: 'active',
          effect: { type: 'damage_boost', value: 2.0, condition: 'on_attack' }
        },
        {
          id: 'wing_buffet',
          name: 'Wing Buffet',
          description: 'Knocks back players and reduces accuracy',
          type: 'active',
          effect: { type: 'status_effect', value: -0.3, condition: 'on_attack' }
        },
        {
          id: 'tail_sweep',
          name: 'Tail Sweep',
          description: 'Area damage behind the dragon',
          type: 'active',
          effect: { type: 'damage_boost', value: 1.5, condition: 'on_attack' }
        },
        {
          id: 'dark_corruption',
          name: 'Dark Corruption',
          description: 'Reduces healing effectiveness',
          type: 'passive',
          effect: { type: 'status_effect', value: -0.5, condition: 'always' }
        }
      ],
      rarity: 'legendary',
      element: 'dark',
      rewards: {
        experienceRange: [1000, 1500],
        itemDropChance: 0.8,
        currencyRange: [500, 800]
      },
      totalHealth: 50000,
      enrageTimer: 15,
      phases: [
        {
          id: 'phase1',
          name: 'Awakening',
          healthThreshold: 100,
          description: 'The dragon awakens from its slumber, using basic attacks.',
          newAbilities: ['Claw Strike', 'Bite'],
          removedAbilities: [],
          statChanges: {},
          specialEffects: ['Dragon scales provide 20% damage reduction']
        },
        {
          id: 'phase2',
          name: 'Airborne Assault',
          healthThreshold: 70,
          description: 'Takes flight and uses aerial attacks.',
          newAbilities: ['Shadow Breath', 'Wing Buffet'],
          removedAbilities: ['Bite'],
          statChanges: { speed: 150 },
          specialEffects: ['Flying: Immune to ground-based attacks']
        },
        {
          id: 'phase3',
          name: 'Corrupted Fury',
          healthThreshold: 40,
          description: 'Dark magic corrupts the battlefield.',
          newAbilities: ['Dark Corruption', 'Shadow Minions'],
          removedAbilities: [],
          statChanges: { attack: 1800, critRate: 0.35 },
          specialEffects: ['Battlefield corruption: All healing reduced by 50%']
        },
        {
          id: 'phase4',
          name: 'Death Throes',
          healthThreshold: 15,
          description: 'Desperate final assault with maximum power.',
          newAbilities: ['Apocalypse Breath', 'Reality Tear'],
          removedAbilities: ['Claw Strike'],
          statChanges: { attack: 2200, speed: 80 },
          specialEffects: ['Enraged: +100% damage, -50% accuracy']
        }
      ],
      specialMechanics: [
        {
          id: 'shadow_breath',
          name: 'Shadow Breath',
          description: 'Charges for 3 seconds, then unleashes devastating breath attack',
          triggerCondition: 'Every 45 seconds',
          effect: 'Deals 2000 damage to all players in front arc',
          damageType: 'magical',
          cooldown: 45,
          aoeRadius: 180,
          duration: 3
        },
        {
          id: 'enrage',
          name: 'Temporal Enrage',
          description: 'If fight lasts longer than 15 minutes, dragon becomes enraged',
          triggerCondition: 'Time > 15 minutes',
          effect: 'All damage doubled, new abilities unlocked',
          damageType: 'true',
          cooldown: 0,
          duration: 999
        }
      ],
      resistances: {
        'dark': 0.8,
        'physical': 0.3
      },
      vulnerabilities: {
        'light': 1.5,
        'ice': 1.2
      }
    },
    baseRewards: [
      {
        type: 'experience',
        value: 1000,
        rarity: 'common',
        contributionRequired: 100
      },
      {
        type: 'currency',
        value: 500,
        rarity: 'common',
        contributionRequired: 100
      },
      {
        type: 'item',
        value: 1,
        itemId: 'dragon_scale_armor',
        rarity: 'legendary',
        contributionRequired: 5000
      },
      {
        type: 'title',
        value: 1,
        titleId: 'dragonslayer',
        rarity: 'epic',
        contributionRequired: 10000
      }
    ],
    difficultyMultipliers: {
      normal: 1.0,
      hard: 1.5,
      nightmare: 2.0,
      hell: 3.0
    },
    unlockRequirements: {
      level: 20
    }
  },
  {
    id: 'frost_giant',
    name: 'Bjorn the Frost Giant',
    description: 'A massive frost giant who commands the power of eternal winter.',
    minLevel: 15,
    maxLevel: 40,
    bossTemplate: {
      id: 'bjorn',
      name: 'Bjorn the Frost Giant',
      description: 'A massive frost giant who commands eternal winter',
      icon: '🧊',
      level: 28,
      stats: {
        attack: 1200,
        defense: 1000,
        health: 35000,
        speed: 80,
        critRate: 0.15,
        critDamage: 2.0
      },
      abilities: [
        {
          id: 'glacial_slam',
          name: 'Glacial Slam',
          description: 'Massive area damage with freeze chance',
          type: 'active',
          effect: { type: 'damage_boost', value: 1.8, condition: 'on_attack' }
        },
        {
          id: 'blizzard',
          name: 'Blizzard',
          description: 'Reduces visibility and movement speed',
          type: 'active',
          effect: { type: 'status_effect', value: -0.4, condition: 'on_attack' }
        },
        {
          id: 'ice_spear',
          name: 'Ice Spear',
          description: 'Long-range piercing attack',
          type: 'active',
          effect: { type: 'damage_boost', value: 1.4, condition: 'on_attack' }
        },
        {
          id: 'frozen_armor',
          name: 'Frozen Armor',
          description: 'Temporary damage immunity',
          type: 'passive',
          effect: { type: 'defense_boost', value: 0.8, condition: 'on_defend' }
        }
      ],
      rarity: 'epic',
      element: 'ice',
      rewards: {
        experienceRange: [800, 1200],
        itemDropChance: 0.7,
        currencyRange: [400, 600]
      },
      totalHealth: 35000,
      enrageTimer: 20,
      phases: [
        {
          id: 'phase1',
          name: 'Awakening Frost',
          healthThreshold: 100,
          description: 'The giant awakens, bringing winter with him.',
          newAbilities: ['Glacial Slam', 'Ice Spear'],
          removedAbilities: [],
          statChanges: {},
          specialEffects: ['Frost Aura: Slows all enemies by 25%']
        },
        {
          id: 'phase2',
          name: 'Eternal Winter',
          healthThreshold: 50,
          description: 'Summons a devastating blizzard.',
          newAbilities: ['Blizzard', 'Frozen Armor'],
          removedAbilities: [],
          statChanges: { defense: 1200 },
          specialEffects: ['Blizzard: Reduces accuracy by 30%']
        },
        {
          id: 'phase3',
          name: 'Glacial Apocalypse',
          healthThreshold: 25,
          description: 'Final desperate assault with ice magic.',
          newAbilities: ['Avalanche', 'Ice Prison'],
          removedAbilities: ['Ice Spear'],
          statChanges: { attack: 1500, speed: 120 },
          specialEffects: ['Frozen ground: Movement speed reduced by 75%']
        }
      ],
      specialMechanics: [
        {
          id: 'glacial_slam',
          name: 'Glacial Slam',
          description: 'Slams the ground, creating ice shards',
          triggerCondition: 'Every 30 seconds',
          effect: 'Deals 1500 damage in large radius, 20% freeze chance',
          damageType: 'physical',
          cooldown: 30,
          aoeRadius: 360,
          duration: 1
        }
      ],
      resistances: {
        'ice': 0.9,
        'physical': 0.4
      },
      vulnerabilities: {
        'fire': 1.8,
        'lightning': 1.3
      }
    },
    baseRewards: [
      {
        type: 'experience',
        value: 800,
        rarity: 'common',
        contributionRequired: 80
      },
      {
        type: 'item',
        value: 1,
        itemId: 'frost_giant_axe',
        rarity: 'epic',
        contributionRequired: 3000
      }
    ],
    difficultyMultipliers: {
      normal: 1.0,
      hard: 1.4,
      nightmare: 1.8,
      hell: 2.5
    },
    unlockRequirements: {
      level: 15
    }
  },
  {
    id: 'void_lord',
    name: 'Nethys the Void Lord',
    description: 'A being from the void between dimensions, wielding reality-warping powers.',
    minLevel: 40,
    maxLevel: 80,
    bossTemplate: {
      id: 'nethys',
      name: 'Nethys the Void Lord',
      description: 'A being from the void between dimensions',
      icon: '🌌',
      level: 60,
      stats: {
        attack: 2500,
        defense: 1200,
        health: 100000,
        speed: 200,
        critRate: 0.4,
        critDamage: 3.0
      },
      abilities: [
        {
          id: 'void_rip',
          name: 'Void Rip',
          description: 'Tears reality, dealing true damage',
          type: 'active',
          effect: { type: 'damage_boost', value: 3.0, condition: 'on_attack' }
        },
        {
          id: 'dimensional_shift',
          name: 'Dimensional Shift',
          description: 'Teleports and confuses players',
          type: 'active',
          effect: { type: 'status_effect', value: -0.6, condition: 'on_attack' }
        },
        {
          id: 'null_zone',
          name: 'Null Zone',
          description: 'Creates areas of no magic',
          type: 'active',
          effect: { type: 'status_effect', value: -0.8, condition: 'on_attack' }
        },
        {
          id: 'reality_storm',
          name: 'Reality Storm',
          description: 'Chaotic damage to all players',
          type: 'active',
          effect: { type: 'damage_boost', value: 2.5, condition: 'on_attack' }
        }
      ],
      rarity: 'mythic',
      element: 'dark',
      rewards: {
        experienceRange: [2000, 3000],
        itemDropChance: 0.9,
        currencyRange: [1000, 1500]
      },
      totalHealth: 100000,
      enrageTimer: 10,
      phases: [
        {
          id: 'phase1',
          name: 'Dimensional Intrusion',
          healthThreshold: 100,
          description: 'The Void Lord manifests in our reality.',
          newAbilities: ['Void Rip', 'Dimensional Shift'],
          removedAbilities: [],
          statChanges: {},
          specialEffects: ['Reality distortion: Random stat changes every 10 seconds']
        },
        {
          id: 'phase2',
          name: 'Null Magic',
          healthThreshold: 60,
          description: 'Creates zones where magic cannot function.',
          newAbilities: ['Null Zone', 'Magic Drain'],
          removedAbilities: [],
          statChanges: { speed: 250 },
          specialEffects: ['Anti-magic fields: Spell damage reduced by 80%']
        },
        {
          id: 'phase3',
          name: 'Reality Collapse',
          healthThreshold: 20,
          description: 'Begins tearing apart reality itself.',
          newAbilities: ['Reality Storm', 'Void Implosion'],
          removedAbilities: ['Dimensional Shift'],
          statChanges: { attack: 3500, critRate: 0.6 },
          specialEffects: ['Reality collapse: Random teleportation every 5 seconds']
        }
      ],
      specialMechanics: [
        {
          id: 'void_rip',
          name: 'Void Rip',
          description: 'Tears a hole in reality dealing true damage',
          triggerCondition: 'Every 25 seconds',
          effect: 'Deals 3000 true damage, ignores all defenses',
          damageType: 'true',
          cooldown: 25,
          aoeRadius: 90,
          duration: 2
        },
        {
          id: 'reality_storm',
          name: 'Reality Storm',
          description: 'Chaotic energy affects all players randomly',
          triggerCondition: 'Phase 3 only, every 20 seconds',
          effect: 'Random effects: heal, damage, buff, debuff',
          damageType: 'magical',
          cooldown: 20,
          aoeRadius: 999,
          duration: 5
        }
      ],
      resistances: {
        'void': 1.0,
        'magical': 0.5
      },
      vulnerabilities: {
        'holy': 2.0,
        'nature': 1.4
      }
    },
    baseRewards: [
      {
        type: 'experience',
        value: 2500,
        rarity: 'rare',
        contributionRequired: 500
      },
      {
        type: 'item',
        value: 1,
        itemId: 'void_shard_weapon',
        rarity: 'mythic',
        contributionRequired: 15000
      },
      {
        type: 'title',
        value: 1,
        titleId: 'void_walker',
        rarity: 'legendary',
        contributionRequired: 20000
      }
    ],
    difficultyMultipliers: {
      normal: 1.0,
      hard: 1.6,
      nightmare: 2.2,
      hell: 3.5
    },
    unlockRequirements: {
      level: 40,
      completedRaids: ['shadow_dragon', 'frost_giant']
    }
  }
]