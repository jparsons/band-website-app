import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { adminMerchandiseApi } from '../../services/api'

const MerchManager = () => {
  const [editingItem, setEditingItem] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const queryClient = useQueryClient()
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      in_stock: true,
      published: true,
    }
  })

  const { data: merchandise } = useQuery({
    queryKey: ['admin-merchandise'],
    queryFn: async () => {
      const response = await adminMerchandiseApi.getMerchandise()
      return response.data
    },
  })

  const createMutation = useMutation({
    mutationFn: adminMerchandiseApi.createMerch,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-merchandise'])
      toast.success('Item created!')
      reset({ in_stock: true, published: true })
      setImageFile(null)
      setImagePreview(null)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => adminMerchandiseApi.updateMerch(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-merchandise'])
      toast.success('Item updated!')
      setEditingItem(null)
      setImageFile(null)
      setImagePreview(null)
      reset({ in_stock: true, published: true })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: adminMerchandiseApi.deleteMerch,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-merchandise'])
      toast.success('Item deleted!')
    },
  })

  const onSubmit = (data) => {
    const sizes = data.sizes ? data.sizes.split(',').map(s => s.trim()) : []
    const merchData = {
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      in_stock: data.in_stock,
      published: data.published,
      sizes_available: sizes,
    }

    if (imageFile) {
      merchData.image = imageFile
    }

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: merchData })
    } else {
      createMutation.mutate(merchData)
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setImagePreview(item.image_url)
    reset({
      name: item.name || '',
      description: item.description || '',
      price: item.price || '',
      category: item.category || '',
      sizes: item.sizes_available?.join(', ') || '',
      in_stock: item.in_stock ?? true,
      published: item.published ?? true,
    })
  }

  const handleCancel = () => {
    setEditingItem(null)
    setImageFile(null)
    setImagePreview(null)
    reset({
      name: '',
      description: '',
      price: '',
      category: '',
      sizes: '',
      in_stock: true,
      published: true,
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Merchandise Manager</h1>
      
      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">{editingItem ? 'Edit Item' : 'Add New Item'}</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Name *</label>
              <input type="text" {...register('name', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Description</label>
              <textarea rows="3" {...register('description')} className="w-full px-4 py-2 border rounded-lg"></textarea>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Price</label>
              <input type="number" step="0.01" {...register('price')} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Image *</label>
              <input type="file" accept="image/*" onChange={handleImageChange} className="w-full px-4 py-2 border rounded-lg" />
              {imagePreview && (
                <img src={imagePreview} alt="Product preview" className="mt-2 h-24 object-cover rounded" />
              )}
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Category</label>
              <input type="text" {...register('category')} className="w-full px-4 py-2 border rounded-lg" placeholder="e.g. Apparel, Music, Posters" />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Sizes Available</label>
              <input type="text" {...register('sizes')} className="w-full px-4 py-2 border rounded-lg" placeholder="S, M, L, XL" />
              <p className="text-xs text-gray-500 mt-1">Comma-separated</p>
            </div>
            
            <div className="mb-4 flex gap-4">
              <label className="flex items-center">
                <input type="checkbox" {...register('in_stock')} className="mr-2" />
                In Stock
              </label>
              <label className="flex items-center">
                <input type="checkbox" {...register('published')} className="mr-2" />
                Published
              </label>
            </div>

            <div className="flex gap-2">
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                {editingItem ? 'Update' : 'Create'}
              </button>
              {editingItem && (
                <button type="button" onClick={handleCancel} className="bg-gray-300 px-6 py-2 rounded-lg hover:bg-gray-400">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-4">All Items</h2>
          <div className="space-y-4">
            {merchandise?.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex gap-4">
                  {item.image_url && (
                    <img src={item.image_url} alt={item.name} className="w-20 h-20 object-cover rounded" />
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                    <p className="text-green-600 font-semibold">${item.price?.toFixed(2)}</p>
                    <div className="mt-2 flex gap-2">
                      <button onClick={() => handleEdit(item)} className="text-blue-600 hover:underline text-sm">Edit</button>
                      <button onClick={() => deleteMutation.mutate(item.id)} className="text-red-600 hover:underline text-sm">Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MerchManager
