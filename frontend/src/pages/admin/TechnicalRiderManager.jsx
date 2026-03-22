import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { adminTechnicalRiderApi } from '../../services/api'

const TechnicalRiderManager = () => {
  const [editingSection, setEditingSection] = useState(null)
  const [attachmentFile, setAttachmentFile] = useState(null)
  const queryClient = useQueryClient()
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const { data: sections } = useQuery({
    queryKey: ['admin-technical-rider'],
    queryFn: async () => {
      const response = await adminTechnicalRiderApi.getSections()
      return response.data
    },
  })

  useEffect(() => {
    if (editingSection) {
      reset({
        title: editingSection.title || '',
        content: editingSection.content || '',
        position: editingSection.position || 0,
        published: editingSection.published ?? true,
      })
    }
  }, [editingSection, reset])

  const createMutation = useMutation({
    mutationFn: adminTechnicalRiderApi.createSection,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-technical-rider'])
      toast.success('Section added!')
      handleCancelEdit()
    },
    onError: (error) => {
      toast.error(error.response?.data?.errors?.join(', ') || 'Failed to add section')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => adminTechnicalRiderApi.updateSection(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-technical-rider'])
      toast.success('Section updated!')
      handleCancelEdit()
    },
    onError: (error) => {
      toast.error(error.response?.data?.errors?.join(', ') || 'Failed to update section')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: adminTechnicalRiderApi.deleteSection,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-technical-rider'])
      toast.success('Section deleted!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.errors?.join(', ') || 'Failed to delete section')
    },
  })

  const onSubmit = (data) => {
    const submitData = {
      title: data.title,
      content: data.content || '',
      position: parseInt(data.position) || 0,
      published: data.published,
    }

    if (attachmentFile) {
      submitData.attachment = attachmentFile
    }

    if (editingSection) {
      updateMutation.mutate({ id: editingSection.id, data: submitData })
    } else {
      createMutation.mutate(submitData)
    }
  }

  const handleEdit = (section) => {
    setEditingSection(section)
    setAttachmentFile(null)
  }

  const handleCancelEdit = () => {
    setEditingSection(null)
    setAttachmentFile(null)
    reset({
      title: '',
      content: '',
      position: 0,
      published: true,
    })
  }

  const handleAttachmentChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAttachmentFile(file)
    }
  }

  const handleDelete = (section) => {
    if (window.confirm(`Are you sure you want to delete "${section.title}"?`)) {
      deleteMutation.mutate(section.id)
    }
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Technical Rider</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">
            {editingSection ? 'Edit Section' : 'Add Section'}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Section Title *</label>
              <input
                type="text"
                {...register('title', { required: 'Title is required' })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Stage Requirements"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Content</label>
              <textarea
                {...register('content')}
                className="w-full px-4 py-2 border rounded-lg font-mono text-sm"
                rows="10"
                placeholder="- Minimum stage size: 20' x 16'
- Power requirements: 4 x 20A circuits
- Monitor mix: 6 separate mixes
..."
              />
              <p className="text-sm text-gray-500 mt-1">
                Use plain text or simple formatting. Line breaks will be preserved.
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Attachment (Stage Plot, Input List, etc.)</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                onChange={handleAttachmentChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
              {attachmentFile && (
                <p className="text-sm text-gray-600 mt-1">
                  Selected: {attachmentFile.name}
                </p>
              )}
              {editingSection?.attachment_filename && !attachmentFile && (
                <p className="text-sm text-gray-600 mt-1">
                  Current: {editingSection.attachment_filename}
                </p>
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
                {editingSection ? 'Update' : 'Add Section'}
              </button>
              {editingSection && (
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
          <h2 className="text-2xl font-bold mb-4">All Sections</h2>
          <div className="space-y-4">
            {sections?.length === 0 && (
              <p className="text-gray-500">No sections yet. Add your first section!</p>
            )}
            {sections?.map((section) => (
              <div key={section.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{section.title}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(section)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(section)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {section.content && (
                  <p className="text-gray-600 text-sm whitespace-pre-wrap line-clamp-4 mb-2">
                    {section.content}
                  </p>
                )}
                {section.attachment_url && (
                  <p className="text-sm">
                    <a
                      href={section.attachment_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      📎 {section.attachment_filename}
                    </a>
                  </p>
                )}
                <div className="flex gap-2 mt-2">
                  <span className="text-xs text-gray-500">Order: {section.position}</span>
                  {!section.published && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                      Unpublished
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TechnicalRiderManager
