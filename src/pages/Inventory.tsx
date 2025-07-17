import { useNavigate } from 'react-router-dom'
import Inventory from '../components/Inventory'

export default function InventoryPage() {
  const navigate = useNavigate()

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Inventory</h1>
        <button
          onClick={() => navigate('/')}
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
        >
          Back to Dashboard
        </button>
      </div>

      <Inventory />
    </div>
  )
}