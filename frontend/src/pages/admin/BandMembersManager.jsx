import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { adminBandMembersApi } from '../../services/api'

const BandMembersManager = () => {
  const [editingMember, setEditingMember] = useState(null)
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const queryClient = useQueryClient()
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const { data: bandMembers } = useQuery({
    queryKey: ['admin-band-members'],
    queryFn: async () => {
      const response = await adminBandMembersApi.getBandMembers()
      return response.data
    },
  })

  useEffect(() => {
    if (editingMember) {
      reset({
        name: editingMember.name || '',
        role: editingMember.role || '',
        position: editingMember.position || 0,
        published: editingMember.published ?? true,
      })
      setPhotoPreview(editingMember.photo_url)
    }
  }, [editingMember, reset])

  const createMutation = useMutation({
    mutationFn: adminBandMembersApi.createBandMember,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-band-members'])
      toast.success('Band member added!')
      handleCancelEdit()
    },
    onError: (error) => {
      toast.error(error.response?.data?.errors?.join(', ') || 'Failed to add band member')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => adminBandMembersApi.updateBandMember(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-band-members'])
      toast.success('Band member updated!')
      handleCancelEdit()
    },
    onError: (error) => {
      toast.error(error.response?.data?.errors?.join(', ') || 'Failed to update band member')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: adminBandMembersApi.deleteBandMember,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-band-members'])
      toast.success('Band member deleted!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.errors?.join(', ') || 'Failed to delete band member')
    },
  })

  const onSubmit = (data) => {
    const submitData = {
      name: data.name,
      role: data.role || '',
      position: parseInt(data.position) || 0,
      published: data.published,
    }

    if (photoFile) {
      submitData.photo = photoFile
    }

    if (editingMember) {
      updateMutation.mutate({ id: editingMember.id, data: submitData })
    } else {
      createMutation.mutate(submitData)
    }
  }

  const handleEdit = (member) => {
    setEditingMember(member)
    setPhotoFile(null)
  }

  const handleCancelEdit = () => {
    setEditingMember(null)
    setPhotoFile(null)
    setPhotoPreview(null)
    reset({
      name: '',
      role: '',
      position: 0,
      published: true,
    })
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPhotoFile(file)
      setPhotoPreview(URL.createObjectURL(file))
    }
  }

  const handleDelete = (member) => {
    if (window.confirm(`Are you sure you want to delete ${member.name}?`)) {
      deleteMutation.mutate(member.id)
    }
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Band Members</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">
            {editingMember ? 'Edit Band Member' : 'Add Band Member'}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Name *</label>
              <input
                type="text"
                {...register('name', { required: 'Name is required' })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Role</label>
              <input
                type="text"
                {...register('role')}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Drums & Vocals"
              />
              <p className="text-sm text-gray-500 mt-1">e.g., Lead Guitar, Drums & Vocals, Bass</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
              {photoPreview && (
                <div className="mt-2">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="h-32 w-32 object-cover rounded-full"
                  />
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Display Order</label>
              <input
                type="number"
                {...register('position')}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="0"
              />
              <p className="text-sm text-gray-500 mt-1">Lower numbers appear first</p>
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
                {editingMember ? 'Update' : 'Add Member'}
              </button>
              {editingMember && (
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
          <h2 className="text-2xl font-bold mb-4">All Band Members</h2>
          <div className="space-y-4">
            {bandMembers?.length === 0 && (
              <p className="text-gray-500">No band members yet. Add your first member!</p>
            )}
            {bandMembers?.map((member) => (
              <div key={member.id} className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
                {member.photo_url ? (
                  <img
                    src={member.photo_url}
                    alt={member.name}
                    className="h-16 w-16 object-cover rounded-full"
                  />
                ) : (
                  <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-400 text-xl">{member.name.charAt(0)}</span>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{member.name}</h3>
                  {member.role && <p className="text-gray-600">{member.role}</p>}
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs text-gray-500">Order: {member.position}</span>
                    {!member.published && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                        Unpublished
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(member)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(member)}
                    className="text-red-600 hover:underline"
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

export default BandMembersManager
