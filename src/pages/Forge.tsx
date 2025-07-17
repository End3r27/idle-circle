import { useParams } from 'react-router-dom'

export default function Forge() {
  const { id } = useParams<{ id: string }>()
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Circle Forge {id}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Your Gear</h2>
          <p className="text-gray-300">No gear available for forging</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Forge Queue</h2>
          <p className="text-gray-300">No items in forge queue</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Trade Offers</h2>
          <p className="text-gray-300">No trade offers available</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Fusion Results</h2>
          <p className="text-gray-300">No fusion results yet</p>
        </div>
      </div>
    </div>
  )
}