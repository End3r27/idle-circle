import { getClassById } from '../types/classes'

interface ClassDisplayProps {
  classId: string
  showDetails?: boolean
}

export default function ClassDisplay({ classId, showDetails = false }: ClassDisplayProps) {
  const playerClass = getClassById(classId)
  
  if (!playerClass) {
    return <span className="text-gray-400">Unknown Class</span>
  }

  if (!showDetails) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-lg">{playerClass.icon}</span>
        <span className="text-white font-medium">{playerClass.name}</span>
      </div>
    )
  }

  return (
    <div className="glass-effect p-4 rounded-xl">
      <div className="flex items-center space-x-3 mb-3">
        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${playerClass.color} flex items-center justify-center text-2xl`}>
          {playerClass.icon}
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">{playerClass.name}</h3>
          <p className="text-xs text-gray-400">{playerClass.description}</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div>
          <h4 className="text-sm font-semibold text-gray-300 mb-1">Active Buffs</h4>
          {playerClass.buffs.map(buff => (
            <div key={buff.id} className="text-xs bg-black/20 p-2 rounded">
              <span className="text-blue-400 font-medium">{buff.name}</span>
              <div className="text-gray-400">{buff.description}</div>
            </div>
          ))}
        </div>
        
        <div>
          <h4 className="text-sm font-semibold text-gray-300 mb-1">Passive Abilities</h4>
          {playerClass.passives.map(passive => (
            <div key={passive.id} className="text-xs bg-black/20 p-2 rounded">
              <span className="text-green-400 font-medium">{passive.name}</span>
              <div className="text-gray-400">{passive.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}