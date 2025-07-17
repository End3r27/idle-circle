import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Navigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const navItems = [
    { path: '/', icon: '🏠', label: 'Dashboard' },
    { path: '/battles', icon: '⚔️', label: 'Solo Battles' },
    { path: '/raids', icon: '🐉', label: 'Boss Raids' },
    { path: '/inventory', icon: '🎒', label: 'Equipment' },
  ]

  const handleLogout = async () => {
    await logout()
  }

  return (
    <nav className="glass-effect border-b border-gray-700/50 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Title */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-glow">
              <span className="text-lg">⭕</span>
            </div>
            <span className="text-xl font-bold gradient-text">Idle Circle</span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-blue-600/80 text-white shadow-lg scale-105' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="hidden md:block font-medium">{item.label}</span>
                </button>
              )
            })}
          </div>

          {/* User Info & Logout */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-right">
              <div className="text-white font-medium">{user?.displayName}</div>
              <div className="text-xs text-gray-400">Level {user?.level || 1}</div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600/80 hover:bg-red-600 text-white px-3 py-2 rounded-xl transition-all duration-300 hover:scale-105 text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}