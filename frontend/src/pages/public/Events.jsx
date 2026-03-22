import { useQuery } from '@tanstack/react-query'
import { eventsApi } from '../../services/api'
import { useTheme } from '../../context/ThemeContext'

const Events = () => {
  const { band } = useTheme()
  const { data: events, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const response = await eventsApi.getEvents()
      return response.data
    },
  })

  if (isLoading) {
    return <div className="py-16 text-center">Loading events...</div>
  }

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold mb-12 text-center">{band.nav_events || 'Events'}</h1>
        
        {events && events.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                <div className="p-6">
                  <div className="text-sm text-gray-500 mb-2">
                    {new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
                  <p className="text-xl text-gray-700 mb-2">{event.venue}</p>
                  <p className="text-gray-600 mb-1">{event.city}, {event.state}</p>
                  {event.description && (
                    <p className="text-gray-600 mt-4">{event.description}</p>
                  )}
                  <div className="mt-4 space-y-2">
                    {event.doors_open && (
                      <p className="text-sm text-gray-600">Doors: {event.doors_open}</p>
                    )}
                    {event.show_starts && (
                      <p className="text-sm text-gray-600">Show: {event.show_starts}</p>
                    )}
                  </div>
                  {event.ticket_url && (
                    <a
                      href={event.ticket_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 block w-full bg-red-600 text-white text-center px-4 py-2 rounded hover:bg-red-700"
                    >
                      Get Tickets
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-xl text-gray-600">No upcoming events at the moment. Check back soon!</p>
        )}
      </div>
    </div>
  )
}

export default Events
