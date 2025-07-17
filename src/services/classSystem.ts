import { PlayerStats } from '../types'
import { getClassById, PlayerClass } from '../types/classes'

export interface ClassBattleState {
  huntersMarkStacks?: number
  rampageStacks?: number
  flowStateCounter?: number
  battlesSurvived?: number
  attacksReceived?: number
  isFirstAttack?: boolean
  isLowHealth?: boolean
}

export const applyClassBuffs = (
  baseStats: PlayerStats,
  classId: string | undefined
): PlayerStats => {
  if (!classId) return baseStats

  const playerClass = getClassById(classId)
  if (!playerClass) return baseStats

  let buffedStats = { ...baseStats }

  // Apply class buffs
  playerClass.buffs.forEach(buff => {
    const bonuses = buff.statBonuses
    
    if (bonuses.attack) {
      buffedStats.attack = Math.floor(buffedStats.attack * (1 + bonuses.attack))
    }
    if (bonuses.defense) {
      buffedStats.defense = Math.floor(buffedStats.defense * (1 + bonuses.defense))
    }
    if (bonuses.health) {
      buffedStats.health = Math.floor(buffedStats.health * (1 + bonuses.health))
    }
    if (bonuses.speed) {
      buffedStats.speed = Math.floor(buffedStats.speed * (1 + bonuses.speed))
    }
    if (bonuses.critRate) {
      buffedStats.critRate = Math.min(1.0, buffedStats.critRate + bonuses.critRate)
    }
    if (bonuses.critDamage) {
      buffedStats.critDamage = buffedStats.critDamage + bonuses.critDamage
    }
  })

  return buffedStats
}

export const getClassStartingStats = (classId: string): PlayerStats => {
  const playerClass = getClassById(classId)
  if (!playerClass) {
    // Default stats if no class found
    return {
      attack: 12,
      defense: 10,
      health: 100,
      speed: 10,
      critRate: 0.05,
      critDamage: 1.5
    }
  }

  return { ...playerClass.startingStats }
}

export const processClassPassives = (
  classId: string | undefined,
  damage: number,
  isCrit: boolean,
  isAttacking: boolean,
  battleState: ClassBattleState
): {
  finalDamage: number
  updatedState: ClassBattleState
  shouldDodge?: boolean
  bonusAttack?: number
} => {
  if (!classId) return { finalDamage: damage, updatedState: battleState }

  const playerClass = getClassById(classId)
  if (!playerClass) return { finalDamage: damage, updatedState: battleState }

  let finalDamage = damage
  let updatedState = { ...battleState }
  let shouldDodge = false
  let bonusAttack = 0

  playerClass.passives.forEach(passive => {
    const effect = passive.effect

    switch (passive.id) {
      case 'battle_hardened':
        // +5% damage reduction per battle survived
        if (!isAttacking && updatedState.battlesSurvived) {
          const reduction = Math.min(0.5, updatedState.battlesSurvived * 0.05)
          finalDamage = Math.floor(finalDamage * (1 - reduction))
        }
        break

      case 'berserker_rage':
        // +50% damage when below 30% health
        if (isAttacking && updatedState.isLowHealth) {
          finalDamage = Math.floor(finalDamage * 1.5)
        }
        break

      case 'backstab':
        // Critical hits deal +100% damage
        if (isAttacking && isCrit) {
          finalDamage = Math.floor(finalDamage * 2.0)
        }
        break

      case 'evasion':
        // 15% chance to dodge attacks
        if (!isAttacking && Math.random() < 0.15) {
          shouldDodge = true
          finalDamage = 0
        }
        break

      case 'spell_surge':
        // 20% chance to cast bonus spell
        if (isAttacking && Math.random() < 0.2) {
          bonusAttack = Math.floor(damage * 0.75)
        }
        break

      case 'mana_shield':
        // Reduce damage by 10% per recent spell
        if (!isAttacking) {
          // Simplified: reduce by 10% (assuming 1 recent spell)
          finalDamage = Math.floor(finalDamage * 0.9)
        }
        break

      case 'holy_light':
        // Healing handled separately after battle
        break

      case 'righteous_fury':
        // +25% damage against evil enemies (simplified: all enemies)
        if (isAttacking) {
          finalDamage = Math.floor(finalDamage * 1.25)
        }
        break

      case 'hunters_mark':
        // +10% damage per stack (max 5)
        if (isAttacking) {
          const stacks = Math.min(5, (updatedState.huntersMarkStacks || 0) + 1)
          finalDamage = Math.floor(finalDamage * (1 + stacks * 0.1))
          updatedState.huntersMarkStacks = stacks
        }
        break

      case 'forest_camouflage':
        // First attack always crits
        if (isAttacking && updatedState.isFirstAttack) {
          // This would be handled in the crit calculation
          updatedState.isFirstAttack = false
        }
        break

      case 'rampage':
        // +20% attack per enemy defeated
        if (isAttacking && updatedState.rampageStacks) {
          finalDamage = Math.floor(finalDamage * (1 + updatedState.rampageStacks * 0.2))
        }
        break

      case 'unstoppable_force':
        // Cannot be reduced below 1 HP in first 3 attacks
        if (!isAttacking && (updatedState.attacksReceived || 0) < 3) {
          // This would be handled in the health calculation
          updatedState.attacksReceived = (updatedState.attacksReceived || 0) + 1
        }
        break

      case 'flow_state':
        // Every 3rd attack deals double damage
        if (isAttacking) {
          const counter = (updatedState.flowStateCounter || 0) + 1
          if (counter % 3 === 0) {
            finalDamage = Math.floor(finalDamage * 2.0)
          }
          updatedState.flowStateCounter = counter
        }
        break
    }
  })

  return { finalDamage, updatedState, shouldDodge, bonusAttack }
}

export const shouldForceFirstAttackCrit = (
  classId: string | undefined,
  battleState: ClassBattleState
): boolean => {
  if (!classId) return false
  
  const playerClass = getClassById(classId)
  if (!playerClass) return false

  // Check for Forest Camouflage passive
  const hasForestCamouflage = playerClass.passives.some(p => p.id === 'forest_camouflage')
  return hasForestCamouflage && battleState.isFirstAttack
}

export const getExperienceMultiplier = (classId: string | undefined): number => {
  if (!classId) return 1.0

  const playerClass = getClassById(classId)
  if (!playerClass) return 1.0

  // Check for Enlightenment passive (Monk)
  const hasEnlightenment = playerClass.passives.some(p => p.id === 'enlightenment')
  return hasEnlightenment ? 1.5 : 1.0
}

export const canSurviveLethalDamage = (
  classId: string | undefined,
  battleState: ClassBattleState
): boolean => {
  if (!classId) return false

  const playerClass = getClassById(classId)
  if (!playerClass) return false

  // Check for Unstoppable Force passive (Berserker)
  const hasUnstoppableForce = playerClass.passives.some(p => p.id === 'unstoppable_force')
  return hasUnstoppableForce && (battleState.attacksReceived || 0) < 3
}

export const initializeBattleState = (classId: string | undefined): ClassBattleState => {
  return {
    huntersMarkStacks: 0,
    rampageStacks: 0,
    flowStateCounter: 0,
    battlesSurvived: 0,
    attacksReceived: 0,
    isFirstAttack: true,
    isLowHealth: false
  }
}