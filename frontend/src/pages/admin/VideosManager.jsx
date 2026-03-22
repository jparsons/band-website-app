import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { adminVideosApi } from '../../services/api'

const VideosManager = () => {
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState(null)
  const queryClient = useQueryClient()
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      published: true,
    }
  })

  const { data: videos } = useQuery({
    queryKey: ['admin-videos'],
    queryFn: async () => {
      const response = await adminVideosApi.getVideos()
      return response.data
    },
  })

  const createMutation = useMutation({
    mutationFn: adminVideosApi.createVideo,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-videos'])
      toast.success('Video added!')
      reset({ published: true })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: adminVideosApi.deleteVideo,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-videos'])
      toast.success('Video deleted!')
    },
  })

  const onSubmit = (data) => {
    const submitData = {
      title: data.title,
      embed_url: data.embed_url,
      description: data.description,
      published: data.published,
    }

    if (thumbnailFile) {
      submitData.thumbnail = thumbnailFile
    }

    createMutation.mutate(submitData)
    setThumbnailFile(null)
    setThumbnailPreview(null)
  }

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setThumbnailFile(file)
      setThumbnailPreview(URL.createObjectURL(file))
    }
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Videos Manager</h1>
      
      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Add New Video</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Title *</label>
              <input type="text" {...register('title', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Embed URL *</label>
              <input type="text" {...register('embed_url', { required: true })} className="w-full px-4 py-2 border rounded-lg" placeholder="https://www.youtube.com/embed/..." />
              <p className="text-xs text-gray-500 mt-1">Use YouTube or Vimeo embed URL</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Description</label>
              <textarea rows="3" {...register('description')} className="w-full px-4 py-2 border rounded-lg"></textarea>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Thumbnail Image</label>
              <input type="file" accept="image/*" onChange={handleThumbnailChange} className="w-full px-4 py-2 border rounded-lg" />
              {thumbnailPreview && (
                <img src={thumbnailPreview} alt="Thumbnail preview" className="mt-2 h-24 object-cover rounded" />
              )}
              <p className="text-xs text-gray-500 mt-1">Optional custom thumbnail</p>
            </div>

            <div className="mb-4">
              <label className="flex items-center">
                <input type="checkbox" {...register('published')} className="mr-2" />
                Published
              </label>
            </div>
            
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Add Video
            </button>
          </form>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-4">All Videos</h2>
          <div className="space-y-4">
            {videos?.map((video) => (
              <div key={video.id} className="bg-white rounded-lg shadow p-4">
                <h3 className="font-bold text-lg">{video.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{video.description}</p>
                {video.thumbnail_url && (
                  <img src={video.thumbnail_url} alt={video.title} className="w-full h-32 object-cover rounded mb-2" />
                )}
                <div className="aspect-w-16 aspect-h-9 mb-2">
                  <iframe src={video.embed_url} className="w-full h-48 rounded" allowFullScreen></iframe>
                </div>
                <button onClick={() => deleteMutation.mutate(video.id)} className="text-red-600 hover:underline text-sm">
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideosManager
