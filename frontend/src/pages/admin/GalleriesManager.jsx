import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { adminGalleriesApi, adminPhotosApi } from '../../services/api'

const GalleriesManager = () => {
  const [selectedGallery, setSelectedGallery] = useState(null)
  const [coverImageFile, setCoverImageFile] = useState(null)
  const [coverImagePreview, setCoverImagePreview] = useState(null)
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const queryClient = useQueryClient()
  const galleryForm = useForm()
  const photoForm = useForm()

  const { data: galleries } = useQuery({
    queryKey: ['admin-galleries'],
    queryFn: async () => {
      const response = await adminGalleriesApi.getGalleries()
      return response.data
    },
  })

  const createGalleryMutation = useMutation({
    mutationFn: adminGalleriesApi.createGallery,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-galleries'])
      toast.success('Gallery created!')
      galleryForm.reset()
      setCoverImageFile(null)
      setCoverImagePreview(null)
    },
  })

  const deleteGalleryMutation = useMutation({
    mutationFn: adminGalleriesApi.deleteGallery,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-galleries'])
      toast.success('Gallery deleted!')
      setSelectedGallery(null)
    },
  })

  const addPhotoMutation = useMutation({
    mutationFn: ({ galleryId, data }) => adminPhotosApi.createPhoto(galleryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-galleries'])
      toast.success('Photo added!')
      photoForm.reset()
      setPhotoFile(null)
      setPhotoPreview(null)
    },
  })

  const deletePhotoMutation = useMutation({
    mutationFn: adminPhotosApi.deletePhoto,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-galleries'])
      toast.success('Photo deleted!')
    },
  })

  const onCreateGallery = (data) => {
    const submitData = {
      title: data.title,
      description: data.description,
    }
    if (coverImageFile) {
      submitData.cover_image = coverImageFile
    }
    createGalleryMutation.mutate(submitData)
  }

  const onAddPhoto = (data) => {
    if (selectedGallery && photoFile) {
      const submitData = {
        image: photoFile,
        caption: data.caption,
      }
      addPhotoMutation.mutate({ galleryId: selectedGallery.id, data: submitData })
    }
  }

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setCoverImageFile(file)
      setCoverImagePreview(URL.createObjectURL(file))
    }
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPhotoFile(file)
      setPhotoPreview(URL.createObjectURL(file))
    }
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Galleries Manager</h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Create Gallery</h2>
          <form onSubmit={galleryForm.handleSubmit(onCreateGallery)} className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Title *</label>
              <input type="text" {...galleryForm.register('title', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Description</label>
              <textarea {...galleryForm.register('description')} className="w-full px-4 py-2 border rounded-lg" rows="3"></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Cover Image *</label>
              <input type="file" accept="image/*" onChange={handleCoverImageChange} className="w-full px-4 py-2 border rounded-lg" />
              {coverImagePreview && (
                <img src={coverImagePreview} alt="Cover preview" className="mt-2 h-24 object-cover rounded" />
              )}
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Create Gallery
            </button>
          </form>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-4">All Galleries</h2>
          <div className="space-y-4">
            {galleries?.map((gallery) => (
              <div key={gallery.id} className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-lg" onClick={() => setSelectedGallery(gallery)}>
                <h3 className="font-bold">{gallery.title}</h3>
                <p className="text-sm text-gray-600">{gallery.photos?.length || 0} photos</p>
                <button onClick={(e) => { e.stopPropagation(); deleteGalleryMutation.mutate(gallery.id); }} className="text-red-600 text-sm hover:underline mt-2">
                  Delete Gallery
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          {selectedGallery ? (
            <>
              <h2 className="text-2xl font-bold mb-4">{selectedGallery.title}</h2>
              <form onSubmit={photoForm.handleSubmit(onAddPhoto)} className="bg-white rounded-lg shadow p-6 mb-4">
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">Image *</label>
                  <input type="file" accept="image/*" onChange={handlePhotoChange} className="w-full px-4 py-2 border rounded-lg" />
                  {photoPreview && (
                    <img src={photoPreview} alt="Photo preview" className="mt-2 h-24 object-cover rounded" />
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">Caption</label>
                  <input type="text" {...photoForm.register('caption')} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <button type="submit" disabled={!photoFile} className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400">
                  Add Photo
                </button>
              </form>
              
              <div className="space-y-2">
                {selectedGallery.photos?.map((photo) => (
                  <div key={photo.id} className="bg-white rounded-lg shadow p-3 flex items-center justify-between">
                    <img src={photo.image_url} alt={photo.caption} className="w-16 h-16 object-cover rounded" />
                    <p className="flex-1 mx-3 text-sm">{photo.caption || 'No caption'}</p>
                    <button onClick={() => deletePhotoMutation.mutate(photo.id)} className="text-red-600 text-sm hover:underline">
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-gray-600">Select a gallery to manage photos</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default GalleriesManager
