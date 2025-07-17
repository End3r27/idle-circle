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
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Idle Circle</h1>
        <div className="flex items-center space-x-4">
          <span className="text-gray-300">Welcome, {user?.displayName}</span>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Circles</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
              >
                Create
              </button>
              <button
                onClick={() => setShowJoinModal(true)}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
              >
                Join
              </button>
            </div>
          </div>
          
          {loading ? (
            <p className="text-gray-300">Loading circles...</p>
          ) : circles.length === 0 ? (
            <p className="text-gray-300">No circles yet. Create or join one!</p>
          ) : (
            <div className="space-y-2">
              {circles.map((circle) => (
                <div
                  key={circle.id}
                  onClick={() => navigate(`/circle/${circle.id}`)}
                  className="bg-gray-700 p-3 rounded cursor-pointer hover:bg-gray-600 transition-colors"
                >
                  <div className="font-semibold">{circle.name}</div>
                  <div className="text-sm text-gray-400">
                    {circle.members.length}/{circle.maxMembers} members
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Recent Battles</h2>
          <p className="text-gray-300">No battles yet. Join a circle to start!</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Profile</h2>
          <div className="space-y-2">
            <p className="text-gray-300">Level {user?.level || 1}</p>
            <p className="text-gray-300">{user?.experience || 0} XP</p>
            <p className="text-gray-300">Circles: {circles.length}</p>
          </div>
          <div className="mt-4">
            <button
              onClick={() => navigate('/inventory')}
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 w-full"
            >
              📦 View Inventory
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