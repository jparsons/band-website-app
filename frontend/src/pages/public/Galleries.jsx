import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { galleriesApi } from '../../services/api'
import { useTheme } from '../../context/ThemeContext'

const Galleries = () => {
  const { band } = useTheme()
  const { data: galleries, isLoading } = useQuery({
    queryKey: ['galleries'],
    queryFn: async () => {
      const response = await galleriesApi.getGalleries()
      return response.data
    },
  })

  if (isLoading) {
    return <div className="py-16 text-center">Loading galleries...</div>
  }

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold mb-12 text-center">{band.nav_galleries || 'Galleries'}</h1>
        
        {galleries && galleries.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {galleries.map((gallery) => (
              <Link
                key={gallery.id}
                to={`/galleries/${gallery.id}`}
                className="group block bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                {gallery.cover_image_url ? (
                  <div className="h-64 overflow-hidden">
                    <img
                      src={gallery.cover_image_url}
                      alt={gallery.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                  </div>
                ) : gallery.photos && gallery.photos[0] ? (
                  <div className="h-64 overflow-hidden">
                    <img
                      src={gallery.photos[0].image_url}
                      alt={gallery.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                  </div>
                ) : (
                  <div className="h-64 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No images</span>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{gallery.title}</h3>
                  {gallery.description && (
                    <p className="text-gray-600">{gallery.description}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    {gallery.photos?.length || 0} photos
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-xl text-gray-600">No galleries available yet.</p>
        )}
      </div>
    </div>
  )
}

export default Galleries
