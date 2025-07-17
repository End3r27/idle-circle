import { useState } from 'react'
import { createCircleBattle } from '../services/battles'

interface ManualBattleProps {
  circleId: string
  onBattleCreated: () => void
}

export default function ManualBattle({ circleId, onBattleCreated }: ManualBattleProps) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleStartBattle = async () => {
    setLoading(true)
    setMessage('')

    const result = await createCircleBattle(circleId, 'challenge')
    
    if (result.success) {
      setMessage('Battle started successfully!')
      onBattleCreated()
    } else {
      setMessage(`Error: ${result.error}`)
    }
    
    setLoading(false)
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Manual Battle</h2>
      
      <div className="space-y-4">
        <p className="text-gray-300 text-sm">
          Start a battle manually instead of waiting for the automatic timer.
        </p>
        
        <button
          onClick={handleStartBattle}
          disabled={loading}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Starting Battle...' : '⚔️ Start Battle Now'}
        </button>
        
        {message && (
          <div className={`text-sm p-2 rounded ${
            message.includes('Error') ? 'bg-red-900 text-red-200' : 'bg-green-900 text-green-200'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  )
}