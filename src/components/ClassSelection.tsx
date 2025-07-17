import { useState } from 'react'
import { PLAYER_CLASSES, PlayerClass } from '../types/classes'
import { useAuth } from '../hooks/useAuth'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../services/firebase'

interface ClassSelectionProps {
  onClassSelected: (classId: string) => void
  isModal?: boolean
}

export default function ClassSelection({ onClassSelected, isModal = false }: ClassSelectionProps) {
  const [selectedClass, setSelectedClass] = useState<PlayerClass | null>(null)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const handleClassSelect = (playerClass: PlayerClass) => {
    setSelectedClass(playerClass)
  }

  const handleConfirmSelection = async () => {
    if (!selectedClass || !user) return

    setLoading(true)
    try {
      // Update user's class in the database
      await updateDoc(doc(db, 'users', user.id), {
        playerClass: selectedClass.id,
        classSelectedAt: new Date()
      })

      onClassSelected(selectedClass.id)
    } catch (error) {
      console.error('Error updating user class:', error)
    }
    setLoading(false)
  }

  const containerClasses = isModal 
    ? "fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
    : "min-h-screen bg-gradient-to-br from-gray-900 to-black p-4"

  return (
    <div className={containerClasses}>
      <div className={`${isModal ? 'w-full max-w-6xl' : 'container mx-auto'} animate-fade-in`}>
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold gradient-text mb-4">Choose Your Class</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Select a class that defines your playstyle and grants unique abilities in battle. 
            Each class has different strengths, weaknesses, and special powers.
          </p>
          {selectedClass && (
            <div className="mt-4 p-4 bg-black/40 rounded-lg max-w-md mx-auto">
              <p className="text-sm text-gray-400">Selected: <span className="text-white font-semibold">{selectedClass.name}</span></p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {PLAYER_CLASSES.map((playerClass, index) => (
            <div
              key={playerClass.id}
              className={`glass-effect p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 animate-slide-in ${
                selectedClass?.id === playerClass.id 
                  ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/25' 
                  : 'hover:shadow-xl'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleClassSelect(playerClass)}
            >
              {/* Class Icon and Name */}
              <div className="text-center mb-4">
                <div className={`w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-r ${playerClass.color} flex items-center justify-center text-4xl`}>
                  {playerClass.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{playerClass.name}</h3>
                <p className="text-sm text-gray-400">{playerClass.description}</p>
              </div>

              {/* Starting Stats */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-2">Starting Stats</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Attack:</span>
                    <span className="text-red-400">{playerClass.startingStats.attack}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Defense:</span>
                    <span className="text-blue-400">{playerClass.startingStats.defense}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Health:</span>
                    <span className="text-green-400">{playerClass.startingStats.health}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Speed:</span>
                    <span className="text-yellow-400">{playerClass.startingStats.speed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Crit Rate:</span>
                    <span className="text-purple-400">{Math.round(playerClass.startingStats.critRate * 100)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Crit Dmg:</span>
                    <span className="text-orange-400">{playerClass.startingStats.critDamage}x</span>
                  </div>
                </div>
              </div>

              {/* Class Buffs */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-2">Class Buffs</h4>
                {playerClass.buffs.map((buff) => (
                  <div key={buff.id} className="bg-black/20 p-2 rounded mb-2">
                    <div className="font-medium text-xs text-blue-400">{buff.name}</div>
                    <div className="text-xs text-gray-400">{buff.description}</div>
                  </div>
                ))}
              </div>

              {/* Passives */}
              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-2">Passive Abilities</h4>
                {playerClass.passives.map((passive) => (
                  <div key={passive.id} className="bg-black/20 p-2 rounded mb-2">
                    <div className="font-medium text-xs text-green-400">{passive.name}</div>
                    <div className="text-xs text-gray-400">{passive.description}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Confirm Button */}
        {selectedClass && (
          <div className="text-center animate-fade-in">
            <button
              onClick={handleConfirmSelection}
              disabled={loading}
              className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                loading 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : `bg-gradient-to-r ${selectedClass.color} hover:scale-105 text-white shadow-lg`
              }`}
            >
              {loading ? 'Confirming...' : `Confirm ${selectedClass.name}`}
            </button>
            <p className="text-sm text-gray-400 mt-3">
              ⚠️ This choice is permanent and will affect your entire journey
            </p>
          </div>
        )}
      </div>
    </div>
  )
}