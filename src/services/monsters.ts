import { Monster, PlayerStats } from '../types'

interface MonsterAbility {
  id: string
  name: string
  description: string
  type: 'passive' | 'active' | 'trigger'
  effect: {
    type: 'damage_boost' | 'defense_boost' | 'heal' | 'status_effect' | 'special'
    value: number
    condition?: 'on_attack' | 'on_defend' | 'on_low_health' | 'on_crit' | 'always' | 'battle_start'
  }
}

interface MonsterTemplate {
  names: string[]
  baseStats: PlayerStats
  icon: string
  description: string
  levelRange: [number, number]
  abilities: MonsterAbility[]
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic'
  element?: 'fire' | 'water' | 'earth' | 'air' | 'dark' | 'light' | 'poison' | 'ice' | 'lightning'
}

const MONSTER_TEMPLATES: MonsterTemplate[] = [
  // COMMON MONSTERS (Levels 1-15)
  {
    names: ['Goblin Scout', 'Goblin Warrior', 'Goblin Shaman'],
    baseStats: { attack: 8, defense: 6, health: 80, speed: 12, critRate: 0.03, critDamage: 1.3 },
    icon: '👹',
    description: 'A cunning goblin seeking treasure',
    levelRange: [1, 15],
    rarity: 'common',
    element: 'earth',
    abilities: [
      {
        id: 'goblin_cunning',
        name: 'Goblin Cunning',
        description: 'Increases critical hit chance by 5%',
        type: 'passive',
        effect: { type: 'damage_boost', value: 0.05, condition: 'always' }
      }
    ]
  },
  {
    names: ['Forest Wolf', 'Dire Wolf', 'Alpha Wolf'],
    baseStats: { attack: 12, defense: 8, health: 100, speed: 15, critRate: 0.08, critDamage: 1.4 },
    icon: '🐺',
    description: 'A fierce predator of the wild',
    levelRange: [5, 25],
    rarity: 'common',
    abilities: [
      {
        id: 'pack_hunter',
        name: 'Pack Hunter',
        description: 'Deals 20% more damage when below 50% health',
        type: 'passive',
        effect: { type: 'damage_boost', value: 0.2, condition: 'on_low_health' }
      }
    ]
  },
  {
    names: ['Cave Spider', 'Giant Spider', 'Venomous Spider'],
    baseStats: { attack: 10, defense: 5, health: 70, speed: 18, critRate: 0.12, critDamage: 1.6 },
    icon: '🕷️',
    description: 'A deadly arachnid with venomous fangs',
    levelRange: [8, 30],
    rarity: 'common',
    element: 'poison',
    abilities: [
      {
        id: 'venom_strike',
        name: 'Venom Strike',
        description: 'Critical hits reduce enemy defense by 10%',
        type: 'trigger',
        effect: { type: 'status_effect', value: 0.1, condition: 'on_crit' }
      }
    ]
  },
  {
    names: ['Slime Blob', 'Acid Slime', 'Slime King'],
    baseStats: { attack: 6, defense: 12, health: 120, speed: 5, critRate: 0.02, critDamage: 1.2 },
    icon: '🟢',
    description: 'A gelatinous creature that absorbs damage',
    levelRange: [1, 20],
    rarity: 'common',
    abilities: [
      {
        id: 'absorption',
        name: 'Absorption',
        description: 'Reduces all incoming damage by 15%',
        type: 'passive',
        effect: { type: 'defense_boost', value: 0.15, condition: 'always' }
      }
    ]
  },
  {
    names: ['Rat Swarm', 'Giant Rat', 'Plague Rat'],
    baseStats: { attack: 7, defense: 4, health: 60, speed: 20, critRate: 0.1, critDamage: 1.3 },
    icon: '🐀',
    description: 'A disease-carrying rodent',
    levelRange: [1, 12],
    rarity: 'common',
    element: 'poison',
    abilities: [
      {
        id: 'disease_carrier',
        name: 'Disease Carrier',
        description: 'Attacks have 25% chance to reduce enemy attack by 5%',
        type: 'trigger',
        effect: { type: 'status_effect', value: 0.05, condition: 'on_attack' }
      }
    ]
  },
  {
    names: ['Mushroom Sprite', 'Toxic Mushroom', 'Spore Lord'],
    baseStats: { attack: 9, defense: 8, health: 85, speed: 8, critRate: 0.05, critDamage: 1.4 },
    icon: '🍄',
    description: 'A fungal creature that spreads spores',
    levelRange: [3, 18],
    rarity: 'common',
    element: 'poison',
    abilities: [
      {
        id: 'spore_cloud',
        name: 'Spore Cloud',
        description: 'When defeated, deals 50% of attack as damage',
        type: 'trigger',
        effect: { type: 'damage_boost', value: 0.5, condition: 'on_defend' }
      }
    ]
  },
  {
    names: ['Rock Beetle', 'Armored Beetle', 'Boulder Beetle'],
    baseStats: { attack: 8, defense: 15, health: 110, speed: 6, critRate: 0.03, critDamage: 1.2 },
    icon: '🪲',
    description: 'A heavily armored insect',
    levelRange: [5, 22],
    rarity: 'common',
    element: 'earth',
    abilities: [
      {
        id: 'shell_armor',
        name: 'Shell Armor',
        description: 'First 3 attacks deal 50% less damage',
        type: 'passive',
        effect: { type: 'defense_boost', value: 0.5, condition: 'battle_start' }
      }
    ]
  },
  {
    names: ['Wild Boar', 'Tusked Boar', 'Razorback Boar'],
    baseStats: { attack: 14, defense: 10, health: 95, speed: 12, critRate: 0.06, critDamage: 1.5 },
    icon: '🐗',
    description: 'An aggressive wild pig with sharp tusks',
    levelRange: [6, 25],
    rarity: 'common',
    abilities: [
      {
        id: 'charge_attack',
        name: 'Charge Attack',
        description: 'First attack deals 100% more damage',
        type: 'passive',
        effect: { type: 'damage_boost', value: 1.0, condition: 'battle_start' }
      }
    ]
  },
  {
    names: ['Bat Swarm', 'Vampire Bat', 'Blood Bat'],
    baseStats: { attack: 9, defense: 5, health: 65, speed: 22, critRate: 0.15, critDamage: 1.4 },
    icon: '🦇',
    description: 'A blood-sucking flying creature',
    levelRange: [4, 20],
    rarity: 'common',
    element: 'dark',
    abilities: [
      {
        id: 'life_drain',
        name: 'Life Drain',
        description: 'Heals for 25% of damage dealt',
        type: 'passive',
        effect: { type: 'heal', value: 0.25, condition: 'on_attack' }
      }
    ]
  },
  {
    names: ['Thorn Vine', 'Strangling Vine', 'Bloodthorn'],
    baseStats: { attack: 11, defense: 7, health: 90, speed: 4, critRate: 0.08, critDamage: 1.6 },
    icon: '🌿',
    description: 'A carnivorous plant with thorny vines',
    levelRange: [7, 28],
    rarity: 'common',
    element: 'earth',
    abilities: [
      {
        id: 'entangle',
        name: 'Entangle',
        description: 'Reduces enemy speed by 20% each attack',
        type: 'trigger',
        effect: { type: 'status_effect', value: 0.2, condition: 'on_attack' }
      }
    ]
  },

  // RARE MONSTERS (Levels 10-40)
  {
    names: ['Skeleton Warrior', 'Undead Knight', 'Bone Lord'],
    baseStats: { attack: 14, defense: 12, health: 120, speed: 8, critRate: 0.05, critDamage: 1.5 },
    icon: '💀',
    description: 'An undead warrior risen from the grave',
    levelRange: [10, 35],
    rarity: 'rare',
    element: 'dark',
    abilities: [
      {
        id: 'undead_resilience',
        name: 'Undead Resilience',
        description: 'Immune to critical hits, gains 10% damage when hit',
        type: 'passive',
        effect: { type: 'damage_boost', value: 0.1, condition: 'on_defend' }
      }
    ]
  },
  {
    names: ['Crystal Golem', 'Gem Guardian', 'Diamond Colossus'],
    baseStats: { attack: 12, defense: 20, health: 180, speed: 5, critRate: 0.02, critDamage: 1.3 },
    icon: '💎',
    description: 'A construct made of precious crystals',
    levelRange: [15, 45],
    rarity: 'rare',
    element: 'earth',
    abilities: [
      {
        id: 'crystal_reflection',
        name: 'Crystal Reflection',
        description: 'Reflects 30% of received damage back to attacker',
        type: 'passive',
        effect: { type: 'special', value: 0.3, condition: 'on_defend' }
      }
    ]
  },
  {
    names: ['Lightning Hawk', 'Storm Eagle', 'Thunder Phoenix'],
    baseStats: { attack: 18, defense: 8, health: 100, speed: 25, critRate: 0.2, critDamage: 1.8 },
    icon: '🦅',
    description: 'A majestic bird crackling with electricity',
    levelRange: [12, 38],
    rarity: 'rare',
    element: 'lightning',
    abilities: [
      {
        id: 'lightning_strike',
        name: 'Lightning Strike',
        description: 'Critical hits have 50% chance to attack again',
        type: 'trigger',
        effect: { type: 'special', value: 0.5, condition: 'on_crit' }
      }
    ]
  },
  {
    names: ['Frost Sprite', 'Ice Wraith', 'Blizzard Spirit'],
    baseStats: { attack: 15, defense: 10, health: 110, speed: 16, critRate: 0.12, critDamage: 1.6 },
    icon: '❄️',
    description: 'A being of pure winter magic',
    levelRange: [14, 40],
    rarity: 'rare',
    element: 'ice',
    abilities: [
      {
        id: 'freeze',
        name: 'Freeze',
        description: 'Attacks reduce enemy speed by 15% and have 20% chance to skip enemy turn',
        type: 'trigger',
        effect: { type: 'status_effect', value: 0.15, condition: 'on_attack' }
      }
    ]
  },
  {
    names: ['Flame Salamander', 'Lava Lizard', 'Inferno Drake'],
    baseStats: { attack: 20, defense: 12, health: 130, speed: 14, critRate: 0.15, critDamage: 1.7 },
    icon: '🦎',
    description: 'A reptile that breathes fire',
    levelRange: [16, 42],
    rarity: 'rare',
    element: 'fire',
    abilities: [
      {
        id: 'burning_aura',
        name: 'Burning Aura',
        description: 'Deals 10% of attack as damage each turn to enemy',
        type: 'passive',
        effect: { type: 'damage_boost', value: 0.1, condition: 'always' }
      }
    ]
  },
  {
    names: ['Shadow Cat', 'Void Panther', 'Nightmare Stalker'],
    baseStats: { attack: 22, defense: 9, health: 105, speed: 24, critRate: 0.25, critDamage: 2.0 },
    icon: '🐱',
    description: 'A feline predator from the shadow realm',
    levelRange: [18, 44],
    rarity: 'rare',
    element: 'dark',
    abilities: [
      {
        id: 'shadow_step',
        name: 'Shadow Step',
        description: '30% chance to dodge attacks and counter for 150% damage',
        type: 'trigger',
        effect: { type: 'special', value: 1.5, condition: 'on_defend' }
      }
    ]
  },
  {
    names: ['Coral Guardian', 'Tide Warrior', 'Ocean Sentinel'],
    baseStats: { attack: 16, defense: 16, health: 150, speed: 10, critRate: 0.08, critDamage: 1.4 },
    icon: '🪸',
    description: 'A protector of the ocean depths',
    levelRange: [20, 46],
    rarity: 'rare',
    element: 'water',
    abilities: [
      {
        id: 'tidal_regeneration',
        name: 'Tidal Regeneration',
        description: 'Heals 15% of max health every 3 turns',
        type: 'passive',
        effect: { type: 'heal', value: 0.15, condition: 'always' }
      }
    ]
  },
  {
    names: ['Wind Dancer', 'Gale Spirit', 'Hurricane Elemental'],
    baseStats: { attack: 17, defense: 7, health: 95, speed: 28, critRate: 0.18, critDamage: 1.6 },
    icon: '💨',
    description: 'An elemental being of pure wind',
    levelRange: [15, 41],
    rarity: 'rare',
    element: 'air',
    abilities: [
      {
        id: 'whirlwind',
        name: 'Whirlwind',
        description: 'Each attack increases speed by 10% and has 25% chance for bonus attack',
        type: 'trigger',
        effect: { type: 'special', value: 0.25, condition: 'on_attack' }
      }
    ]
  },
  {
    names: ['Toxic Ooze', 'Plague Slime', 'Corruption Beast'],
    baseStats: { attack: 13, defense: 11, health: 140, speed: 8, critRate: 0.06, critDamage: 1.4 },
    icon: '🟣',
    description: 'A creature born from toxic waste',
    levelRange: [17, 43],
    rarity: 'rare',
    element: 'poison',
    abilities: [
      {
        id: 'toxic_aura',
        name: 'Toxic Aura',
        description: 'Enemy loses 5% of max health each turn',
        type: 'passive',
        effect: { type: 'status_effect', value: 0.05, condition: 'always' }
      }
    ]
  },
  {
    names: ['Radiant Wisp', 'Light Spirit', 'Solar Fairy'],
    baseStats: { attack: 19, defense: 8, health: 85, speed: 20, critRate: 0.22, critDamage: 1.9 },
    icon: '✨',
    description: 'A being of pure light energy',
    levelRange: [19, 45],
    rarity: 'rare',
    element: 'light',
    abilities: [
      {
        id: 'blinding_light',
        name: 'Blinding Light',
        description: 'Critical hits reduce enemy accuracy by 20% for 3 turns',
        type: 'trigger',
        effect: { type: 'status_effect', value: 0.2, condition: 'on_crit' }
      }
    ]
  },

  // EPIC MONSTERS (Levels 25-60)
  {
    names: ['Orc Berserker', 'Orc Chieftain', 'Orc Warlord'],
    baseStats: { attack: 18, defense: 15, health: 160, speed: 10, critRate: 0.06, critDamage: 1.7 },
    icon: '👹',
    description: 'A brutal orc warrior hungry for battle',
    levelRange: [15, 45],
    rarity: 'epic',
    abilities: [
      {
        id: 'bloodthirst',
        name: 'Bloodthirst',
        description: 'Gains 25% attack and speed for each enemy killed',
        type: 'trigger',
        effect: { type: 'damage_boost', value: 0.25, condition: 'on_attack' }
      }
    ]
  },
  {
    names: ['Fire Elemental', 'Inferno Spirit', 'Flame Lord'],
    baseStats: { attack: 22, defense: 10, health: 140, speed: 14, critRate: 0.15, critDamage: 2.0 },
    icon: '🔥',
    description: 'A being of pure fire and destruction',
    levelRange: [20, 50],
    rarity: 'epic',
    element: 'fire',
    abilities: [
      {
        id: 'immolation',
        name: 'Immolation',
        description: 'When below 25% health, explodes for 200% attack damage',
        type: 'trigger',
        effect: { type: 'special', value: 2.0, condition: 'on_low_health' }
      }
    ]
  },
  {
    names: ['Ice Golem', 'Frost Giant', 'Glacial Titan'],
    baseStats: { attack: 16, defense: 25, health: 220, speed: 6, critRate: 0.02, critDamage: 1.2 },
    icon: '🧊',
    description: 'A massive creature of ice and stone',
    levelRange: [25, 60],
    rarity: 'epic',
    element: 'ice',
    abilities: [
      {
        id: 'absolute_zero',
        name: 'Absolute Zero',
        description: 'Every 4th attack freezes enemy for 2 turns and deals 300% damage',
        type: 'trigger',
        effect: { type: 'special', value: 3.0, condition: 'on_attack' }
      }
    ]
  },
  {
    names: ['Void Reaper', 'Death Knight', 'Soul Harvester'],
    baseStats: { attack: 26, defense: 14, health: 180, speed: 12, critRate: 0.18, critDamage: 2.2 },
    icon: '☠️',
    description: 'A harbinger of death from the void',
    levelRange: [28, 58],
    rarity: 'epic',
    element: 'dark',
    abilities: [
      {
        id: 'soul_steal',
        name: 'Soul Steal',
        description: 'Critical hits steal 20% of enemy max health permanently',
        type: 'trigger',
        effect: { type: 'special', value: 0.2, condition: 'on_crit' }
      }
    ]
  },
  {
    names: ['Storm Titan', 'Thunder Lord', 'Lightning Emperor'],
    baseStats: { attack: 24, defense: 12, health: 170, speed: 18, critRate: 0.20, critDamage: 1.8 },
    icon: '⚡',
    description: 'A colossal being that commands storms',
    levelRange: [30, 62],
    rarity: 'epic',
    element: 'lightning',
    abilities: [
      {
        id: 'chain_lightning',
        name: 'Chain Lightning',
        description: 'Each attack has 40% chance to strike again for 75% damage',
        type: 'trigger',
        effect: { type: 'special', value: 0.75, condition: 'on_attack' }
      }
    ]
  },
  {
    names: ['Earth Shaker', 'Mountain King', 'Continental Titan'],
    baseStats: { attack: 20, defense: 28, health: 280, speed: 4, critRate: 0.05, critDamage: 1.5 },
    icon: '🏔️',
    description: 'A massive being that can move mountains',
    levelRange: [32, 64],
    rarity: 'epic',
    element: 'earth',
    abilities: [
      {
        id: 'earthquake',
        name: 'Earthquake',
        description: 'Every 5 turns, deals 150% attack to enemy and stuns for 1 turn',
        type: 'trigger',
        effect: { type: 'special', value: 1.5, condition: 'always' }
      }
    ]
  },
  {
    names: ['Leviathan', 'Kraken', 'Abyssal Terror'],
    baseStats: { attack: 23, defense: 18, health: 240, speed: 8, critRate: 0.12, critDamage: 1.9 },
    icon: '🐙',
    description: 'A massive sea monster from the depths',
    levelRange: [35, 65],
    rarity: 'epic',
    element: 'water',
    abilities: [
      {
        id: 'tentacle_slam',
        name: 'Tentacle Slam',
        description: 'Attacks hit 3 times, each for 60% damage',
        type: 'passive',
        effect: { type: 'special', value: 0.6, condition: 'on_attack' }
      }
    ]
  },
  {
    names: ['Celestial Guardian', 'Seraph', 'Divine Avatar'],
    baseStats: { attack: 25, defense: 20, health: 200, speed: 15, critRate: 0.25, critDamage: 2.0 },
    icon: '👼',
    description: 'A divine being sent from the heavens',
    levelRange: [38, 68],
    rarity: 'epic',
    element: 'light',
    abilities: [
      {
        id: 'divine_judgment',
        name: 'Divine Judgment',
        description: 'When below 50% health, next attack deals 400% damage and heals to full',
        type: 'trigger',
        effect: { type: 'special', value: 4.0, condition: 'on_low_health' }
      }
    ]
  },
  {
    names: ['Plague Doctor', 'Epidemic Spreader', 'Pandemic Lord'],
    baseStats: { attack: 21, defense: 16, health: 190, speed: 11, critRate: 0.14, critDamage: 1.7 },
    icon: '🦠',
    description: 'A being that spreads disease and decay',
    levelRange: [33, 63],
    rarity: 'epic',
    element: 'poison',
    abilities: [
      {
        id: 'viral_outbreak',
        name: 'Viral Outbreak',
        description: 'Each attack spreads plague, reducing enemy stats by 5% permanently',
        type: 'trigger',
        effect: { type: 'status_effect', value: 0.05, condition: 'on_attack' }
      }
    ]
  },
  {
    names: ['Tornado Demon', 'Hurricane Fiend', 'Cyclone Destroyer'],
    baseStats: { attack: 27, defense: 9, health: 150, speed: 30, critRate: 0.22, critDamage: 1.8 },
    icon: '🌪️',
    description: 'A chaotic wind demon of destruction',
    levelRange: [36, 66],
    rarity: 'epic',
    element: 'air',
    abilities: [
      {
        id: 'wind_fury',
        name: 'Wind Fury',
        description: 'Speed increases by 20% each turn, attacks twice when speed > 40',
        type: 'passive',
        effect: { type: 'special', value: 0.2, condition: 'always' }
      }
    ]
  },

  // LEGENDARY MONSTERS (Levels 40-80)
  {
    names: ['Shadow Assassin', 'Dark Wraith', 'Void Stalker'],
    baseStats: { attack: 25, defense: 8, health: 110, speed: 22, critRate: 0.25, critDamage: 2.5 },
    icon: '👤',
    description: 'A creature that lurks in the shadows',
    levelRange: [30, 70],
    rarity: 'legendary',
    element: 'dark',
    abilities: [
      {
        id: 'assassination',
        name: 'Assassination',
        description: 'First attack always crits for 500% damage if enemy is above 75% health',
        type: 'trigger',
        effect: { type: 'special', value: 5.0, condition: 'battle_start' }
      }
    ]
  },
  {
    names: ['Phoenix', 'Eternal Flame', 'Rebirth Fire'],
    baseStats: { attack: 28, defense: 15, health: 200, speed: 20, critRate: 0.18, critDamage: 2.2 },
    icon: '🔥',
    description: 'A legendary bird that rises from ashes',
    levelRange: [42, 72],
    rarity: 'legendary',
    element: 'fire',
    abilities: [
      {
        id: 'rebirth',
        name: 'Rebirth',
        description: 'When killed, revives with 50% health and +100% damage (once per battle)',
        type: 'trigger',
        effect: { type: 'special', value: 1.0, condition: 'on_defend' }
      }
    ]
  },
  {
    names: ['Lich King', 'Undead Emperor', 'Death Incarnate'],
    baseStats: { attack: 30, defense: 22, health: 250, speed: 8, critRate: 0.15, critDamage: 2.0 },
    icon: '👑',
    description: 'An undead ruler of immense power',
    levelRange: [45, 75],
    rarity: 'legendary',
    element: 'dark',
    abilities: [
      {
        id: 'necromancy',
        name: 'Necromancy',
        description: 'Summons skeleton minions that attack for 50% damage each turn',
        type: 'passive',
        effect: { type: 'special', value: 0.5, condition: 'always' }
      }
    ]
  },
  {
    names: ['World Tree', 'Gaia\'s Avatar', 'Nature\'s Wrath'],
    baseStats: { attack: 24, defense: 30, health: 350, speed: 5, critRate: 0.08, critDamage: 1.6 },
    icon: '🌳',
    description: 'The embodiment of nature\'s power',
    levelRange: [48, 78],
    rarity: 'legendary',
    element: 'earth',
    abilities: [
      {
        id: 'natures_blessing',
        name: 'Nature\'s Blessing',
        description: 'Heals 10% max health each turn and grows stronger (+5% all stats per turn)',
        type: 'passive',
        effect: { type: 'special', value: 0.05, condition: 'always' }
      }
    ]
  },
  {
    names: ['Cosmic Horror', 'Eldritch Abomination', 'Void Entity'],
    baseStats: { attack: 32, defense: 18, health: 220, speed: 12, critRate: 0.20, critDamage: 2.5 },
    icon: '👁️',
    description: 'An incomprehensible being from beyond reality',
    levelRange: [50, 80],
    rarity: 'legendary',
    element: 'dark',
    abilities: [
      {
        id: 'madness_aura',
        name: 'Madness Aura',
        description: 'Enemy has 30% chance to attack themselves each turn',
        type: 'passive',
        effect: { type: 'status_effect', value: 0.3, condition: 'always' }
      }
    ]
  },
  {
    names: ['Time Weaver', 'Chronos Guardian', 'Temporal Lord'],
    baseStats: { attack: 26, defense: 20, health: 180, speed: 25, critRate: 0.22, critDamage: 2.0 },
    icon: '⏰',
    description: 'A being that manipulates time itself',
    levelRange: [52, 82],
    rarity: 'legendary',
    abilities: [
      {
        id: 'time_manipulation',
        name: 'Time Manipulation',
        description: 'Can rewind damage taken (50% chance) and attack twice per turn',
        type: 'passive',
        effect: { type: 'special', value: 0.5, condition: 'always' }
      }
    ]
  },
  {
    names: ['Star Devourer', 'Galactic Destroyer', 'Universe Ender'],
    baseStats: { attack: 35, defense: 25, health: 300, speed: 15, critRate: 0.16, critDamage: 2.3 },
    icon: '🌌',
    description: 'A cosmic entity that consumes stars',
    levelRange: [55, 85],
    rarity: 'legendary',
    abilities: [
      {
        id: 'stellar_consumption',
        name: 'Stellar Consumption',
        description: 'Absorbs 25% of damage dealt as permanent stat increases',
        type: 'passive',
        effect: { type: 'special', value: 0.25, condition: 'on_attack' }
      }
    ]
  },
  {
    names: ['Reality Shaper', 'Dimension Walker', 'Multiverse Guardian'],
    baseStats: { attack: 29, defense: 24, health: 260, speed: 18, critRate: 0.24, critDamage: 2.1 },
    icon: '🔮',
    description: 'A being that can alter reality itself',
    levelRange: [58, 88],
    rarity: 'legendary',
    abilities: [
      {
        id: 'reality_warp',
        name: 'Reality Warp',
        description: 'Can change battle rules: swap stats, reverse damage, or duplicate attacks',
        type: 'trigger',
        effect: { type: 'special', value: 1.0, condition: 'always' }
      }
    ]
  },

  // MYTHIC MONSTERS (Levels 60-100)
  {
    names: ['Ancient Dragon', 'Elder Wyrm', 'Primordial Beast'],
    baseStats: { attack: 35, defense: 30, health: 350, speed: 16, critRate: 0.18, critDamage: 2.2 },
    icon: '🐉',
    description: 'A legendary beast of immense power',
    levelRange: [50, 100],
    rarity: 'mythic',
    element: 'fire',
    abilities: [
      {
        id: 'dragon_breath',
        name: 'Dragon Breath',
        description: 'Every 3 turns, breathes fire for 300% attack damage and burns for 5 turns',
        type: 'trigger',
        effect: { type: 'special', value: 3.0, condition: 'always' }
      }
    ]
  },
  {
    names: ['Omega Destroyer', 'Final Boss', 'Ultimate Evil'],
    baseStats: { attack: 40, defense: 35, health: 500, speed: 20, critRate: 0.25, critDamage: 3.0 },
    icon: '💀',
    description: 'The ultimate challenge for any warrior',
    levelRange: [70, 100],
    rarity: 'mythic',
    element: 'dark',
    abilities: [
      {
        id: 'omega_strike',
        name: 'Omega Strike',
        description: 'Charges for 3 turns, then unleashes attack that deals 1000% damage',
        type: 'trigger',
        effect: { type: 'special', value: 10.0, condition: 'always' }
      }
    ]
  },
  {
    names: ['Genesis Creator', 'Life Bringer', 'World Maker'],
    baseStats: { attack: 32, defense: 40, health: 600, speed: 12, critRate: 0.15, critDamage: 2.0 },
    icon: '🌍',
    description: 'A being capable of creating worlds',
    levelRange: [75, 100],
    rarity: 'mythic',
    element: 'light',
    abilities: [
      {
        id: 'creation_force',
        name: 'Creation Force',
        description: 'Creates beneficial effects: healing, stat boosts, and protective barriers',
        type: 'passive',
        effect: { type: 'special', value: 0.2, condition: 'always' }
      }
    ]
  },
  {
    names: ['Infinity Warden', 'Eternal Guardian', 'Timeless Sentinel'],
    baseStats: { attack: 38, defense: 38, health: 450, speed: 25, critRate: 0.20, critDamage: 2.5 },
    icon: '♾️',
    description: 'A guardian that exists beyond time and space',
    levelRange: [80, 100],
    rarity: 'mythic',
    abilities: [
      {
        id: 'infinite_power',
        name: 'Infinite Power',
        description: 'All stats increase by 10% each turn, cannot be reduced below 1 HP',
        type: 'passive',
        effect: { type: 'special', value: 0.1, condition: 'always' }
      }
    ]
  },
  {
    names: ['Chaos Incarnate', 'Entropy Lord', 'Disorder Entity'],
    baseStats: { attack: 45, defense: 20, health: 300, speed: 30, critRate: 0.30, critDamage: 2.8 },
    icon: '🌀',
    description: 'The embodiment of pure chaos and randomness',
    levelRange: [85, 100],
    rarity: 'mythic',
    abilities: [
      {
        id: 'chaos_storm',
        name: 'Chaos Storm',
        description: 'Random effects each turn: massive damage, healing, stat changes, or special attacks',
        type: 'passive',
        effect: { type: 'special', value: 1.0, condition: 'always' }
      }
    ]
  },

  // Additional unique monsters to reach 100
  {
    names: ['Mimic Chest', 'Treasure Trap', 'Golden Deceiver'],
    baseStats: { attack: 16, defense: 25, health: 140, speed: 2, critRate: 0.05, critDamage: 3.0 },
    icon: '📦',
    description: 'A chest that\'s actually a monster',
    levelRange: [10, 40],
    rarity: 'rare',
    abilities: [
      {
        id: 'surprise_attack',
        name: 'Surprise Attack',
        description: 'First attack always crits and deals 400% damage',
        type: 'trigger',
        effect: { type: 'special', value: 4.0, condition: 'battle_start' }
      }
    ]
  },
  {
    names: ['Ghost Pirate', 'Spectral Buccaneer', 'Phantom Captain'],
    baseStats: { attack: 19, defense: 8, health: 120, speed: 16, critRate: 0.18, critDamage: 1.9 },
    icon: '🏴‍☠️',
    description: 'An undead pirate seeking treasure',
    levelRange: [20, 50],
    rarity: 'epic',
    element: 'dark',
    abilities: [
      {
        id: 'ghostly_form',
        name: 'Ghostly Form',
        description: '50% chance to phase through attacks, taking no damage',
        type: 'passive',
        effect: { type: 'defense_boost', value: 0.5, condition: 'on_defend' }
      }
    ]
  },
  {
    names: ['Mechanical Spider', 'Steam Arachnid', 'Clockwork Destroyer'],
    baseStats: { attack: 21, defense: 18, health: 160, speed: 14, critRate: 0.12, critDamage: 1.8 },
    icon: '🕸️',
    description: 'A mechanical spider powered by steam',
    levelRange: [25, 55],
    rarity: 'epic',
    abilities: [
      {
        id: 'self_repair',
        name: 'Self Repair',
        description: 'Heals 20% max health when below 25% health',
        type: 'trigger',
        effect: { type: 'heal', value: 0.2, condition: 'on_low_health' }
      }
    ]
  },
  {
    names: ['Void Worm', 'Space Parasite', 'Dimensional Borer'],
    baseStats: { attack: 23, defense: 12, health: 180, speed: 8, critRate: 0.15, critDamage: 2.1 },
    icon: '🪱',
    description: 'A worm that tunnels through dimensions',
    levelRange: [30, 60],
    rarity: 'epic',
    element: 'dark',
    abilities: [
      {
        id: 'dimensional_tunnel',
        name: 'Dimensional Tunnel',
        description: 'Can attack from any dimension, ignoring 50% of enemy defense',
        type: 'passive',
        effect: { type: 'special', value: 0.5, condition: 'on_attack' }
      }
    ]
  },
  {
    names: ['Blood Moon Wolf', 'Crimson Howler', 'Lunar Predator'],
    baseStats: { attack: 26, defense: 14, health: 170, speed: 22, critRate: 0.20, critDamage: 2.0 },
    icon: '🌙',
    description: 'A wolf empowered by the blood moon',
    levelRange: [35, 65],
    rarity: 'legendary',
    element: 'dark',
    abilities: [
      {
        id: 'blood_moon_rage',
        name: 'Blood Moon Rage',
        description: 'Gains 15% attack and speed for each 10% health lost',
        type: 'passive',
        effect: { type: 'damage_boost', value: 0.15, condition: 'on_low_health' }
      }
    ]
  },
  // Continue with more unique monsters...
  {
    names: ['Crystal Butterfly', 'Prism Wing', 'Rainbow Moth'],
    baseStats: { attack: 15, defense: 6, health: 90, speed: 28, critRate: 0.25, critDamage: 1.7 },
    icon: '🦋',
    description: 'A beautiful but deadly crystalline insect',
    levelRange: [15, 45],
    rarity: 'rare',
    element: 'light',
    abilities: [
      {
        id: 'dazzling_wings',
        name: 'Dazzling Wings',
        description: 'Blinds enemy on critical hits, reducing their accuracy by 30%',
        type: 'trigger',
        effect: { type: 'status_effect', value: 0.3, condition: 'on_crit' }
      }
    ]
  },
  {
    names: ['Magma Turtle', 'Lava Shell', 'Volcanic Guardian'],
    baseStats: { attack: 14, defense: 28, health: 220, speed: 4, critRate: 0.03, critDamage: 1.4 },
    icon: '🐢',
    description: 'A turtle with a shell of molten rock',
    levelRange: [20, 50],
    rarity: 'epic',
    element: 'fire',
    abilities: [
      {
        id: 'molten_shell',
        name: 'Molten Shell',
        description: 'Attackers take 25% of their damage as fire damage',
        type: 'passive',
        effect: { type: 'special', value: 0.25, condition: 'on_defend' }
      }
    ]
  },
  {
    names: ['Nightmare Horse', 'Shadow Stallion', 'Phantom Steed'],
    baseStats: { attack: 24, defense: 12, health: 150, speed: 26, critRate: 0.16, critDamage: 1.9 },
    icon: '🐴',
    description: 'A spectral horse from the realm of nightmares',
    levelRange: [25, 55],
    rarity: 'epic',
    element: 'dark',
    abilities: [
      {
        id: 'nightmare_charge',
        name: 'Nightmare Charge',
        description: 'Charges deal double damage and cause fear (reduces enemy damage by 20%)',
        type: 'trigger',
        effect: { type: 'special', value: 2.0, condition: 'on_attack' }
      }
    ]
  },
  {
    names: ['Singing Siren', 'Melody Enchantress', 'Harmony Destroyer'],
    baseStats: { attack: 18, defense: 10, health: 130, speed: 18, critRate: 0.14, critDamage: 1.8 },
    icon: '🧜‍♀️',
    description: 'A beautiful but deadly sea creature',
    levelRange: [22, 52],
    rarity: 'rare',
    element: 'water',
    abilities: [
      {
        id: 'enchanting_song',
        name: 'Enchanting Song',
        description: 'Song charms enemy, causing them to skip turns (25% chance)',
        type: 'trigger',
        effect: { type: 'status_effect', value: 0.25, condition: 'on_attack' }
      }
    ]
  },
  {
    names: ['Starlight Unicorn', 'Celestial Horn', 'Divine Steed'],
    baseStats: { attack: 22, defense: 16, health: 180, speed: 20, critRate: 0.18, critDamage: 2.0 },
    icon: '🦄',
    description: 'A majestic unicorn blessed by starlight',
    levelRange: [30, 60],
    rarity: 'legendary',
    element: 'light',
    abilities: [
      {
        id: 'starlight_heal',
        name: 'Starlight Heal',
        description: 'Heals 25% max health each turn and purifies negative effects',
        type: 'passive',
        effect: { type: 'heal', value: 0.25, condition: 'always' }
      }
    ]
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
  
  // Generate monster level (1-5 levels above player for more challenge)
  const monsterLevel = Math.max(1, playerLevel + Math.floor(Math.random() * 5) + 1)
  
  // Scale stats based on level and player count
  const levelMultiplier = 1 + (monsterLevel - 1) * 0.25
  const groupMultiplier = Math.sqrt(playerCount) * 0.9
  
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
    abilities: template.abilities,
    rarity: template.rarity,
    element: template.element,
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

export const getMonsterRarityColor = (rarity: string): string => {
  switch (rarity) {
    case 'common': return 'text-green-400'
    case 'rare': return 'text-blue-400'
    case 'epic': return 'text-purple-400'
    case 'legendary': return 'text-orange-400'
    case 'mythic': return 'text-red-400'
    default: return 'text-gray-400'
  }
}

export const getMonsterRarityName = (level: number): string => {
  if (level <= 10) return 'Common'
  if (level <= 25) return 'Rare'
  if (level <= 45) return 'Epic'
  if (level <= 70) return 'Legendary'
  return 'Mythic'
}

export const getElementColor = (element?: string): string => {
  switch (element) {
    case 'fire': return 'text-red-500'
    case 'water': return 'text-blue-500'
    case 'earth': return 'text-green-500'
    case 'air': return 'text-cyan-500'
    case 'dark': return 'text-purple-500'
    case 'light': return 'text-yellow-500'
    case 'poison': return 'text-green-600'
    case 'ice': return 'text-blue-300'
    case 'lightning': return 'text-yellow-400'
    default: return 'text-gray-400'
  }
}

export const getElementIcon = (element?: string): string => {
  switch (element) {
    case 'fire': return '🔥'
    case 'water': return '💧'
    case 'earth': return '🌍'
    case 'air': return '💨'
    case 'dark': return '🌑'
    case 'light': return '☀️'
    case 'poison': return '☠️'
    case 'ice': return '❄️'
    case 'lightning': return '⚡'
    default: return ''
  }
}