import Inventory from '../components/Inventory'

export default function InventoryPage() {
  return (
    <div className="container mx-auto p-4 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-2">Equipment & Items</h1>
        <p className="text-gray-400">Manage your gear and inventory</p>
      </div>

      <Inventory />
    </div>
  )
}