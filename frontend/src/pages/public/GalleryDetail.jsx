import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import Lightbox from 'yet-another-react-lightbox'
import Captions from 'yet-another-react-lightbox/plugins/captions'
import { galleriesApi } from '../../services/api'

const GalleryDetail = () => {
  const { id } = useParams()
  const [photoIndex, setPhotoIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  const { data: gallery, isLoading } = useQuery({
    queryKey: ['gallery', id],
    queryFn: async () => {
      const response = await galleriesApi.getGallery(id)
      return response.data
    },
  })

  if (isLoading) {
    return <div className="py-16 text-center">Loading gallery...</div>
  }

  if (!gallery) {
    return <div className="py-16 text-center">Gallery not found</div>
  }

  const photos = gallery.photos || []
  const slides = photos.map((photo) => ({
    src: photo.image_url,
    title: photo.caption,
  }))

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link to="/galleries" className="text-blue-600 hover:text-blue-800">
            ← Back to Galleries
          </Link>
        </div>

        <h1 className="text-5xl font-bold mb-4">{gallery.title}</h1>
        {gallery.description && (
          <p className="text-xl text-gray-600 mb-8">{gallery.description}</p>
        )}

        {photos.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo, index) => (
                <div
                  key={photo.id}
                  className="cursor-pointer group relative overflow-hidden rounded-lg"
                  onClick={() => {
                    setPhotoIndex(index)
                    setIsOpen(true)
                  }}
                >
                  <img
                    src={photo.image_url}
                    alt={photo.caption || `Photo ${index + 1}`}
                    className="w-full h-64 object-cover group-hover:scale-110 transition duration-300"
                  />
                  {photo.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2">
                      <p className="text-sm truncate">{photo.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <Lightbox
              open={isOpen}
              close={() => setIsOpen(false)}
              index={photoIndex}
              slides={slides}
              plugins={[Captions]}
            />
          </>
        ) : (
          <p className="text-center text-xl text-gray-600">No photos in this gallery yet.</p>
        )}
      </div>
    </div>
  )
}

export default GalleryDetail
