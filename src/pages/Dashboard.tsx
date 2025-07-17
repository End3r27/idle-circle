import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getUserCircles } from '../services/circles'
import { Circle } from '../types'
import CreateCircleModal from '../components/CreateCircleModal'
import JoinCircleModal from '../components/JoinCircleModal'

export default function Dashboard() {
  const [circles, setCircles] = useState<Circle[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      loadCircles()
    }
  }, [user])

  const loadCircles = async () => {
    if (!user) return
    
    setLoading(true)
    const userCircles = await getUserCircles(user.id)
    setCircles(userCircles)
    setLoading(false)
  }

  const handleCreateSuccess = (circleId: string) => {
    loadCircles()
    navigate(`/circle/${circleId}`)
  }

  const handleJoinSuccess = (circleId: string) => {
    loadCircles()
    navigate(`/circle/${circleId}`)
  }

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="container mx-auto p-4 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div className="animate-slide-in">
          <h1 className="text-4xl font-bold gradient-text mb-2">Idle Circle</h1>
          <p className="text-gray-400">Your idle adventure awaits</p>
        </div>
        <div className="flex items-center space-x-4 animate-slide-in" style={{ animationDelay: '0.2s' }}>
          <div className="text-right">
            <div className="text-white font-medium">Welcome back,</div>
            <div className="text-blue-400">{user?.displayName}</div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600/80 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass-effect p-6 rounded-2xl card-hover animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-lg">🏰</span>
              </div>
              <h2 className="text-xl font-semibold">Your Circles</h2>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowCreateModal(true)}
                className="button-primary px-3 py-1 rounded-lg text-sm font-medium"
              >
                Create
              </button>
              <button
                onClick={() => setShowJoinModal(true)}
                className="bg-green-600/80 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
              >
                Join
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : circles.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">No circles yet</div>
              <p className="text-sm text-gray-500">Create or join a circle to start your adventure!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {circles.map((circle, index) => (
                <div
                  key={circle.id}
                  onClick={() => navigate(`/circle/${circle.id}`)}
                  className="bg-black/20 p-4 rounded-xl cursor-pointer hover:bg-black/30 transition-all duration-300 hover:scale-105 border border-gray-700/50 hover:border-blue-500/30 animate-slide-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-white">{circle.name}</div>
                      <div className="text-sm text-gray-400">
                        {circle.members.length}/{circle.maxMembers} members
                      </div>
                    </div>
                    <div className="text-blue-400">→</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-effect p-6 rounded-2xl card-hover animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center">
              <span className="text-lg">⚔️</span>
            </div>
            <h2 className="text-xl font-semibold">Recent Battles</h2>
          </div>
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">No battles yet</div>
            <p className="text-sm text-gray-500">Join a circle to start battling!</p>
          </div>
        </div>

        <div className="glass-effect p-6 rounded-2xl card-hover animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
              <span className="text-lg">👤</span>
            </div>
            <h2 className="text-xl font-semibold">Profile</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Level</span>
              <span className="text-white font-semibold">{user?.level || 1}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Experience</span>
              <span className="text-blue-400 font-semibold">{user?.experience || 0} XP</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Circles</span>
              <span className="text-purple-400 font-semibold">{circles.length}</span>
            </div>
          </div>
          <div className="mt-6">
            <button
              onClick={() => navigate('/inventory')}
              className="button-primary w-full py-3 rounded-xl font-medium flex items-center justify-center space-x-2"
            >
              <span>📦</span>
              <span>View Inventory</span>
            </button>
          </div>
        </div>
      </div>

      <CreateCircleModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />

      <JoinCircleModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onSuccess={handleJoinSuccess}
      />
    </div>
  )
}