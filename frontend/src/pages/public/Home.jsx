import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { eventsApi, videosApi } from '../../services/api'
import { useTheme } from '../../context/ThemeContext'

const Home = () => {
  const { band } = useTheme()
  
  const { data: events } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const response = await eventsApi.getEvents()
      return response.data
    },
  })

  const { data: videos } = useQuery({
    queryKey: ['videos'],
    queryFn: async () => {
      const response = await videosApi.getVideos()
      return response.data
    },
  })

  const nextEvent = events?.[0]
  const latestVideo = videos?.[0]

  return (
    <div>
      {/* Hero Section */}
      <div 
        className="hero-section min-h-[600px] flex items-center justify-center text-white relative"
        style={{
          backgroundImage: band.background_image_url 
            ? `url(${band.background_image_url})` 
            : 'linear-gradient(to right, #000000, #434343)',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-center px-4">
          {band.logo_url && (
            <img src={band.logo_url} alt={band.name} className="h-32 mx-auto mb-8" />
          )}
          <h1 className="text-6xl font-bold mb-4">{band.name || 'Welcome'}</h1>
          <p className="text-xl mb-2">{band.bio}</p>
          {band.hero_tagline && (
            <p className="text-2xl font-semibold mb-8">{band.hero_tagline}</p>
          )}
          {!band.hero_tagline && <div className="mb-8"></div>}
          <div className="space-x-4">
            <Link to="/events" className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-lg inline-block">
              See {band.nav_events || 'Events'}
            </Link>
            <Link to="/contact" className="bg-white text-black hover:bg-gray-200 px-8 py-3 rounded-lg inline-block">
              {band.nav_contact || 'Contact'} Us
            </Link>
          </div>
        </div>
      </div>

      {/* Next Event Section */}
      {nextEvent && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-8 text-center">Next Show</h2>
            <div className="max-w-2xl mx-auto bg-gray-100 rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-2">{nextEvent.title}</h3>
              <p className="text-xl text-gray-600 mb-4">{nextEvent.venue}</p>
              <p className="text-lg mb-4">
                {new Date(nextEvent.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              {nextEvent.ticket_url && (
                <a 
                  href={nextEvent.ticket_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 inline-block"
                >
                  Get Tickets
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Latest Video Section */}
      {latestVideo && (
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-8 text-center">Latest Video</h2>
            <div className="max-w-4xl mx-auto">
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src={latestVideo.embed_url}
                  className="w-full h-[500px] rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <h3 className="text-2xl font-bold mt-4">{latestVideo.title}</h3>
              <p className="text-gray-600 mt-2">{latestVideo.description}</p>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">{band.cta_title || 'Stay Connected'}</h2>
          <p className="text-xl mb-8">{band.cta_subtitle || 'Follow us on social media for updates and exclusive content'}</p>
          <div className="flex justify-center space-x-6">
            {band.social_links?.facebook && (
              <a href={band.social_links.facebook} className="text-2xl hover:text-gray-300">Facebook</a>
            )}
            {band.social_links?.instagram && (
              <a href={band.social_links.instagram} className="text-2xl hover:text-gray-300">Instagram</a>
            )}
            {band.social_links?.twitter && (
              <a href={band.social_links.twitter} className="text-2xl hover:text-gray-300">Twitter</a>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
