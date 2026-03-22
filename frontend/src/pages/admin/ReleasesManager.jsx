import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { adminReleasesApi } from '../../services/api'

const ReleasesManager = () => {
  const [editingRelease, setEditingRelease] = useState(null)
  const [coverFile, setCoverFile] = useState(null)
  const [coverPreview, setCoverPreview] = useState(null)
  const queryClient = useQueryClient()
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const { data: releases } = useQuery({
    queryKey: ['admin-releases'],
    queryFn: async () => {
      const response = await adminReleasesApi.getReleases()
      return response.data
    },
  })

  useEffect(() => {
    if (editingRelease) {
      reset({
        title: editingRelease.title || '',
        release_type: editingRelease.release_type || 'album',
        release_date: editingRelease.release_date || '',
        label: editingRelease.label || '',
        description: editingRelease.description || '',
        spotify_url: editingRelease.spotify_url || '',
        apple_music_url: editingRelease.apple_music_url || '',
        bandcamp_url: editingRelease.bandcamp_url || '',
        other_streaming_url: editingRelease.other_streaming_url || '',
        position: editingRelease.position || 0,
        published: editingRelease.published ?? true,
      })
      setCoverPreview(editingRelease.cover_art_url)
    }
  }, [editingRelease, reset])

  const createMutation = useMutation({
    mutationFn: adminReleasesApi.createRelease,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-releases'])
      toast.success('Release added!')
      handleCancelEdit()
    },
    onError: (error) => {
      toast.error(error.response?.data?.errors?.join(', ') || 'Failed to add release')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => adminReleasesApi.updateRelease(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-releases'])
      toast.success('Release updated!')
      handleCancelEdit()
    },
    onError: (error) => {
      toast.error(error.response?.data?.errors?.join(', ') || 'Failed to update release')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: adminReleasesApi.deleteRelease,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-releases'])
      toast.success('Release deleted!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.errors?.join(', ') || 'Failed to delete release')
    },
  })

  const onSubmit = (data) => {
    const submitData = {
      title: data.title,
      release_type: data.release_type,
      release_date: data.release_date || null,
      label: data.label || '',
      description: data.description || '',
      spotify_url: data.spotify_url || '',
      apple_music_url: data.apple_music_url || '',
      bandcamp_url: data.bandcamp_url || '',
      other_streaming_url: data.other_streaming_url || '',
      position: parseInt(data.position) || 0,
      published: data.published,
    }

    if (coverFile) {
      submitData.cover_art = coverFile
    }

    if (editingRelease) {
      updateMutation.mutate({ id: editingRelease.id, data: submitData })
    } else {
      createMutation.mutate(submitData)
    }
  }

  const handleEdit = (release) => {
    setEditingRelease(release)
    setCoverFile(null)
  }

  const handleCancelEdit = () => {
    setEditingRelease(null)
    setCoverFile(null)
    setCoverPreview(null)
    reset({
      title: '',
      release_type: 'album',
      release_date: '',
      label: '',
      description: '',
      spotify_url: '',
      apple_music_url: '',
      bandcamp_url: '',
      other_streaming_url: '',
      position: 0,
      published: true,
    })
  }

  const handleCoverChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setCoverFile(file)
      setCoverPreview(URL.createObjectURL(file))
    }
  }

  const handleDelete = (release) => {
    if (window.confirm(`Are you sure you want to delete "${release.title}"?`)) {
      deleteMutation.mutate(release.id)
    }
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Releases (Discography)</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">
            {editingRelease ? 'Edit Release' : 'Add Release'}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Title *</label>
              <input
                type="text"
                {...register('title', { required: 'Title is required' })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Album Name"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Release Type *</label>
              <select
                {...register('release_type', { required: 'Type is required' })}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="album">Album</option>
                <option value="ep">EP</option>
                <option value="single">Single</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Release Date</label>
              <input
                type="date"
                {...register('release_date')}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Label</label>
              <input
                type="text"
                {...register('label')}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Record Label Name"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Description</label>
              <textarea
                {...register('description')}
                className="w-full px-4 py-2 border rounded-lg"
                rows="3"
                placeholder="Brief description of the release..."
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Cover Art</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
              {coverPreview && (
                <div className="mt-2">
                  <img
                    src={coverPreview}
                    alt="Preview"
                    className="h-32 w-32 object-cover rounded"
                  />
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Spotify URL</label>
              <input
                type="url"
                {...register('spotify_url')}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="https://open.spotify.com/..."
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Apple Music URL</label>
              <input
                type="url"
                {...register('apple_music_url')}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="https://music.apple.com/..."
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Bandcamp URL</label>
              <input
                type="url"
                {...register('bandcamp_url')}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="https://bandname.bandcamp.com/..."
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Other Streaming URL</label>
              <input
                type="url"
                {...register('other_streaming_url')}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="https://..."
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Display Order</label>
              <input
                type="number"
                {...register('position')}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="0"
              />
            </div>

            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('published')}
                  className="mr-2"
                  defaultChecked={true}
                />
                Published
              </label>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {editingRelease ? 'Update' : 'Add Release'}
              </button>
              {editingRelease && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-gray-300 px-6 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">All Releases</h2>
          <div className="space-y-4">
            {releases?.length === 0 && (
              <p className="text-gray-500">No releases yet. Add your first release!</p>
            )}
            {releases?.map((release) => (
              <div key={release.id} className="bg-white rounded-lg shadow p-4 flex gap-4">
                {release.cover_art_url ? (
                  <img
                    src={release.cover_art_url}
                    alt={release.title}
                    className="h-20 w-20 object-cover rounded"
                  />
                ) : (
                  <div className="h-20 w-20 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-400 text-2xl">🎵</span>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{release.title}</h3>
                  <p className="text-gray-600 text-sm">
                    {release.release_type.charAt(0).toUpperCase() + release.release_type.slice(1)}
                    {release.release_date && ` • ${new Date(release.release_date).getFullYear()}`}
                  </p>
                  {release.label && <p className="text-gray-500 text-sm">{release.label}</p>}
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs text-gray-500">Order: {release.position}</span>
                    {!release.published && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                        Unpublished
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => handleEdit(release)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(release)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReleasesManager
