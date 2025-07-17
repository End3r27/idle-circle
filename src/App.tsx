import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import AuthForm from './components/AuthForm'
import Dashboard from './pages/Dashboard'
import Circle from './pages/Circle'
import Forge from './pages/Forge'
import InventoryPage from './pages/Inventory'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <AuthForm onSuccess={() => {}} />
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/circle/:id" element={<Circle />} />
          <Route path="/forge/:id" element={<Forge />} />
          <Route path="/inventory" element={<InventoryPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App