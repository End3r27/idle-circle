import { useState } from 'react'
import { createCircle } from '../services/circles'
import { useAuth } from '../hooks/useAuth'

interface CreateCircleModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (circleId: string) => void
}

export default function CreateCircleModal({ isOpen, onClose, onSuccess }: CreateCircleModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [maxMembers, setMaxMembers] = useState(10)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    
    setLoading(true)
    setError('')

    const result = await createCircle(name, description, user.id, maxMembers)
    
    if (result.success && result.circleId) {
      onSuccess(result.circleId)
      onClose()
      setName('')
      setDescription('')
      setMaxMembers(10)
    } else {
      setError(result.error || 'Failed to create circle')
    }
    
    setLoading(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-effect rounded-2xl p-8 w-full max-w-md animate-fade-in">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-glow flex items-center justify-center">
            <span className="text-2xl">🏰</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Create New Circle</h2>
          <p className="text-gray-400 text-sm">Start your own adventure group</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="animate-slide-in">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Circle Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-black/30 text-white rounded-xl border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:outline-none transition-all duration-300"
              placeholder="Enter circle name"
              required
              maxLength={50}
            />
          </div>

          <div className="animate-slide-in" style={{ animationDelay: '0.1s' }}>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-black/30 text-white rounded-xl border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:outline-none transition-all duration-300 resize-none"
              placeholder="Describe your circle"
              rows={3}
              maxLength={200}
            />
          </div>

          <div className="animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Max Members
            </label>
            <select
              value={maxMembers}
              onChange={(e) => setMaxMembers(parseInt(e.target.value))}
              className="w-full px-4 py-3 bg-black/30 text-white rounded-xl border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:outline-none transition-all duration-300"
            >
              <option value={5}>5 members</option>
              <option value={10}>10 members</option>
              <option value={15}>15 members</option>
              <option value={20}>20 members</option>
            </select>
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-xl border border-red-500/20 animate-fade-in">
              {error}
            </div>
          )}

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600/80 hover:bg-gray-600 text-white py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 button-primary py-3 px-4 rounded-xl font-medium disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating...
                </div>
              ) : (
                'Create Circle'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}