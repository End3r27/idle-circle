// Experience and leveling system utilities

/**
 * Calculate the total experience required to reach a specific level
 */
export function getExperienceForLevel(level: number): number {
  if (level <= 1) return 0
  
  // Exponential scaling: each level requires more XP
  // Level 2: 100 XP, Level 3: 225 XP, Level 4: 400 XP, etc.
  return Math.floor(50 * level * level + 50 * level)
}

/**
 * Calculate what level a player should be based on their total experience
 */
export function getLevelFromExperience(experience: number): number {
  let level = 1
  
  while (getExperienceForLevel(level + 1) <= experience) {
    level++
  }
  
  return level
}

/**
 * Calculate experience needed for the next level
 */
export function getExperienceToNextLevel(currentExp: number, currentLevel: number): number {
  const expForNextLevel = getExperienceForLevel(currentLevel + 1)
  return Math.max(0, expForNextLevel - currentExp)
}

/**
 * Calculate experience progress within current level as a percentage
 */
export function getLevelProgress(currentExp: number, currentLevel: number): number {
  const expForCurrentLevel = getExperienceForLevel(currentLevel)
  const expForNextLevel = getExperienceForLevel(currentLevel + 1)
  const expInCurrentLevel = currentExp - expForCurrentLevel
  const expNeededForLevel = expForNextLevel - expForCurrentLevel
  
  return Math.min(100, Math.max(0, (expInCurrentLevel / expNeededForLevel) * 100))
}