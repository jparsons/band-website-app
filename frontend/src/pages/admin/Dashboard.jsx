import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { adminEventsApi, adminMessagesApi } from '../../services/api'

const Dashboard = () => {
  const { data: events } = useQuery({
    queryKey: ['admin-events'],
    queryFn: async () => {
      const response = await adminEventsApi.getEvents()
      return response.data
    },
  })

  const { data: messages } = useQuery({
    queryKey: ['admin-messages'],
    queryFn: async () => {
      const response = await adminMessagesApi.getMessages()
      return response.data
    },
  })

  const upcomingEvents = events?.filter(e => new Date(e.date) >= new Date()).length || 0
  const unreadMessages = messages?.filter(m => !m.read).length || 0

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 mb-2">Upcoming Events</h3>
          <p className="text-4xl font-bold text-blue-600">{upcomingEvents}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 mb-2">Unread Messages</h3>
          <p className="text-4xl font-bold text-green-600">{unreadMessages}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 mb-2">Total Events</h3>
          <p className="text-4xl font-bold text-purple-600">{events?.length || 0}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 mb-2">Total Messages</h3>
          <p className="text-4xl font-bold text-orange-600">{messages?.length || 0}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/admin/events" className="block px-4 py-3 bg-blue-50 rounded hover:bg-blue-100">
              Manage Events
            </Link>
            <Link to="/admin/galleries" className="block px-4 py-3 bg-green-50 rounded hover:bg-green-100">
              Manage Galleries
            </Link>
            <Link to="/admin/videos" className="block px-4 py-3 bg-purple-50 rounded hover:bg-purple-100">
              Manage Videos
            </Link>
            <Link to="/admin/merch" className="block px-4 py-3 bg-orange-50 rounded hover:bg-orange-100">
              Manage Merchandise
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Recent Messages</h2>
          {messages && messages.length > 0 ? (
            <div className="space-y-3">
              {messages.slice(0, 5).map((message) => (
                <div key={message.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <p className="font-semibold">{message.name}</p>
                  <p className="text-sm text-gray-600">{message.subject || 'No subject'}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(message.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
              <Link to="/admin/messages" className="block text-blue-600 hover:underline mt-4">
                View all messages →
              </Link>
            </div>
          ) : (
            <p className="text-gray-600">No messages yet</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
