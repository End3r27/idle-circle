import { useParams } from 'react-router-dom'

export default function Circle() {
  const { id } = useParams<{ id: string }>()
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Circle {id}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Members</h2>
          <p className="text-gray-300">No members yet</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Battle Log</h2>
          <p className="text-gray-300">No battles yet</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Weekly Events</h2>
          <p className="text-gray-300">No events active</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Circle Feed</h2>
          <p className="text-gray-300">No activity yet</p>
        </div>
      </div>
    </div>
  )
}