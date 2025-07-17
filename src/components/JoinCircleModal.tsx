import { useState } from 'react'
import { joinCircle } from '../services/circles'
import { useAuth } from '../hooks/useAuth'

interface JoinCircleModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (circleId: string) => void
}

export default function JoinCircleModal({ isOpen, onClose, onSuccess }: JoinCircleModalProps) {
  const [inviteCode, setInviteCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    
    setLoading(true)
    setError('')

    const result = await joinCircle(inviteCode.toUpperCase(), user.id)
    
    if (result.success && result.circleId) {
      onSuccess(result.circleId)
      onClose()
      setInviteCode('')
    } else {
      setError(result.error || 'Failed to join circle')
    }
    
    setLoading(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-white mb-4">Join Circle</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Invite Code
            </label>
            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase tracking-wider"
              placeholder="Enter 8-character code"
              required
              maxLength={8}
            />
            <p className="text-xs text-gray-400 mt-1">
              Ask your friend for their Circle's invite code
            </p>
          </div>

          {error && (
            <div className="text-red-400 text-sm">{error}</div>
          )}

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || inviteCode.length !== 8}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Joining...' : 'Join Circle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}