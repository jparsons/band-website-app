import { useQuery } from '@tanstack/react-query'
import { videosApi } from '../../services/api'
import { useTheme } from '../../context/ThemeContext'

const Videos = () => {
  const { band } = useTheme()
  const { data: videos, isLoading } = useQuery({
    queryKey: ['videos'],
    queryFn: async () => {
      const response = await videosApi.getVideos()
      return response.data
    },
  })

  if (isLoading) {
    return <div className="py-16 text-center">Loading videos...</div>
  }

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold mb-12 text-center">{band.nav_videos || 'Videos'}</h1>
        
        {videos && videos.length > 0 ? (
          <div className="max-w-4xl mx-auto space-y-12">
            {videos.map((video) => (
              <div key={video.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    src={video.embed_url}
                    className="w-full h-[500px]"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{video.title}</h3>
                  {video.description && (
                    <p className="text-gray-600">{video.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-xl text-gray-600">No videos available yet.</p>
        )}
      </div>
    </div>
  )
}

export default Videos
