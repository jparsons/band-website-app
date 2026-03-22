import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { adminPressQuotesApi } from '../../services/api'

const PressQuotesManager = () => {
  const [editingQuote, setEditingQuote] = useState(null)
  const queryClient = useQueryClient()
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const { data: pressQuotes } = useQuery({
    queryKey: ['admin-press-quotes'],
    queryFn: async () => {
      const response = await adminPressQuotesApi.getPressQuotes()
      return response.data
    },
  })

  useEffect(() => {
    if (editingQuote) {
      reset({
        quote: editingQuote.quote || '',
        source: editingQuote.source || '',
        author: editingQuote.author || '',
        url: editingQuote.url || '',
        published_date: editingQuote.published_date || '',
        position: editingQuote.position || 0,
        published: editingQuote.published ?? true,
        featured: editingQuote.featured ?? false,
      })
    }
  }, [editingQuote, reset])

  const createMutation = useMutation({
    mutationFn: adminPressQuotesApi.createPressQuote,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-press-quotes'])
      toast.success('Press quote added!')
      handleCancelEdit()
    },
    onError: (error) => {
      toast.error(error.response?.data?.errors?.join(', ') || 'Failed to add press quote')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => adminPressQuotesApi.updatePressQuote(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-press-quotes'])
      toast.success('Press quote updated!')
      handleCancelEdit()
    },
    onError: (error) => {
      toast.error(error.response?.data?.errors?.join(', ') || 'Failed to update press quote')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: adminPressQuotesApi.deletePressQuote,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-press-quotes'])
      toast.success('Press quote deleted!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.errors?.join(', ') || 'Failed to delete press quote')
    },
  })

  const onSubmit = (data) => {
    const submitData = {
      quote: data.quote,
      source: data.source,
      author: data.author || '',
      url: data.url || '',
      published_date: data.published_date || null,
      position: parseInt(data.position) || 0,
      published: data.published,
      featured: data.featured,
    }

    if (editingQuote) {
      updateMutation.mutate({ id: editingQuote.id, data: submitData })
    } else {
      createMutation.mutate(submitData)
    }
  }

  const handleEdit = (quote) => {
    setEditingQuote(quote)
  }

  const handleCancelEdit = () => {
    setEditingQuote(null)
    reset({
      quote: '',
      source: '',
      author: '',
      url: '',
      published_date: '',
      position: 0,
      published: true,
      featured: false,
    })
  }

  const handleDelete = (quote) => {
    if (window.confirm(`Are you sure you want to delete this quote from ${quote.source}?`)) {
      deleteMutation.mutate(quote.id)
    }
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Press Quotes</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">
            {editingQuote ? 'Edit Press Quote' : 'Add Press Quote'}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Quote *</label>
              <textarea
                {...register('quote', { required: 'Quote is required' })}
                className="w-full px-4 py-2 border rounded-lg"
                rows="4"
                placeholder="An incredible band that pushes boundaries..."
              />
              {errors.quote && (
                <p className="text-red-500 text-sm mt-1">{errors.quote.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Source (Publication) *</label>
              <input
                type="text"
                {...register('source', { required: 'Source is required' })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Rolling Stone"
              />
              {errors.source && (
                <p className="text-red-500 text-sm mt-1">{errors.source.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Author</label>
              <input
                type="text"
                {...register('author')}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="John Smith"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">URL</label>
              <input
                type="url"
                {...register('url')}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="https://..."
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Published Date</label>
              <input
                type="date"
                {...register('published_date')}
                className="w-full px-4 py-2 border rounded-lg"
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

            <div className="mb-4 flex gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('published')}
                  className="mr-2"
                  defaultChecked={true}
                />
                Published
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('featured')}
                  className="mr-2"
                />
                Featured
              </label>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {editingQuote ? 'Update' : 'Add Quote'}
              </button>
              {editingQuote && (
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
          <h2 className="text-2xl font-bold mb-4">All Press Quotes</h2>
          <div className="space-y-4">
            {pressQuotes?.length === 0 && (
              <p className="text-gray-500">No press quotes yet. Add your first quote!</p>
            )}
            {pressQuotes?.map((quote) => (
              <div key={quote.id} className="bg-white rounded-lg shadow p-4">
                <blockquote className="italic text-gray-700 mb-2 line-clamp-3">
                  "{quote.quote}"
                </blockquote>
                <p className="text-sm font-semibold">
                  {quote.author && `${quote.author}, `}{quote.source}
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs text-gray-500">Order: {quote.position}</span>
                  {quote.featured && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                      Featured
                    </span>
                  )}
                  {!quote.published && (
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                      Unpublished
                    </span>
                  )}
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleEdit(quote)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(quote)}
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

export default PressQuotesManager
