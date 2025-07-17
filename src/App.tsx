import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import AuthForm from './components/AuthForm'
import Navigation from './components/Navigation'
import Dashboard from './pages/Dashboard'
import Circle from './pages/Circle'
import Forge from './pages/Forge'
import InventoryPage from './pages/Inventory'
import SoloBattles from './pages/SoloBattles'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="animate-pulse-slow">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-glow"></div>
          </div>
          <div className="text-white text-xl font-medium">Loading Idle Circle...</div>
          <div className="text-gray-400 text-sm mt-2">Preparing your adventure</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthForm onSuccess={() => {}} />
  }

  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <Navigation />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/battles" element={<SoloBattles />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/circle/:id" element={<Circle />} />
          <Route path="/forge/:id" element={<Forge />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App