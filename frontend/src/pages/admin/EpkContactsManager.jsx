import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { adminEpkContactsApi } from '../../services/api'

const CONTACT_TYPES = [
  { value: 'booking', label: 'Booking' },
  { value: 'press', label: 'Press' },
  { value: 'management', label: 'Management' },
  { value: 'licensing', label: 'Licensing' },
]

const EpkContactsManager = () => {
  const [editingContact, setEditingContact] = useState(null)
  const queryClient = useQueryClient()
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const { data: contacts } = useQuery({
    queryKey: ['admin-epk-contacts'],
    queryFn: async () => {
      const response = await adminEpkContactsApi.getEpkContacts()
      return response.data
    },
  })

  useEffect(() => {
    if (editingContact) {
      reset({
        contact_type: editingContact.contact_type || 'booking',
        name: editingContact.name || '',
        email: editingContact.email || '',
        phone: editingContact.phone || '',
        company: editingContact.company || '',
        territory: editingContact.territory || '',
        position: editingContact.position || 0,
        published: editingContact.published ?? true,
      })
    }
  }, [editingContact, reset])

  const createMutation = useMutation({
    mutationFn: adminEpkContactsApi.createEpkContact,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-epk-contacts'])
      toast.success('Contact added!')
      handleCancelEdit()
    },
    onError: (error) => {
      toast.error(error.response?.data?.errors?.join(', ') || 'Failed to add contact')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => adminEpkContactsApi.updateEpkContact(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-epk-contacts'])
      toast.success('Contact updated!')
      handleCancelEdit()
    },
    onError: (error) => {
      toast.error(error.response?.data?.errors?.join(', ') || 'Failed to update contact')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: adminEpkContactsApi.deleteEpkContact,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-epk-contacts'])
      toast.success('Contact deleted!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.errors?.join(', ') || 'Failed to delete contact')
    },
  })

  const onSubmit = (data) => {
    const submitData = {
      contact_type: data.contact_type,
      name: data.name,
      email: data.email || '',
      phone: data.phone || '',
      company: data.company || '',
      territory: data.territory || '',
      position: parseInt(data.position) || 0,
      published: data.published,
    }

    if (editingContact) {
      updateMutation.mutate({ id: editingContact.id, data: submitData })
    } else {
      createMutation.mutate(submitData)
    }
  }

  const handleEdit = (contact) => {
    setEditingContact(contact)
  }

  const handleCancelEdit = () => {
    setEditingContact(null)
    reset({
      contact_type: 'booking',
      name: '',
      email: '',
      phone: '',
      company: '',
      territory: '',
      position: 0,
      published: true,
    })
  }

  const handleDelete = (contact) => {
    if (window.confirm(`Are you sure you want to delete ${contact.name}?`)) {
      deleteMutation.mutate(contact.id)
    }
  }

  // Group contacts by type
  const contactsByType = contacts?.reduce((acc, contact) => {
    if (!acc[contact.contact_type]) {
      acc[contact.contact_type] = []
    }
    acc[contact.contact_type].push(contact)
    return acc
  }, {}) || {}

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">EPK Contacts</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">
            {editingContact ? 'Edit Contact' : 'Add Contact'}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Contact Type *</label>
              <select
                {...register('contact_type', { required: 'Type is required' })}
                className="w-full px-4 py-2 border rounded-lg"
              >
                {CONTACT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

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
              <label className="block text-sm font-semibold mb-2">Company</label>
              <input
                type="text"
                {...register('company')}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Booking Agency Inc."
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                {...register('email')}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="booking@example.com"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Phone</label>
              <input
                type="tel"
                {...register('phone')}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Territory</label>
              <input
                type="text"
                {...register('territory')}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="North America, Europe, Worldwide"
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
                {editingContact ? 'Update' : 'Add Contact'}
              </button>
              {editingContact && (
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
          <h2 className="text-2xl font-bold mb-4">All Contacts</h2>
          <div className="space-y-6">
            {contacts?.length === 0 && (
              <p className="text-gray-500">No contacts yet. Add your first contact!</p>
            )}
            {CONTACT_TYPES.map((type) => {
              const typeContacts = contactsByType[type.value]
              if (!typeContacts || typeContacts.length === 0) return null
              return (
                <div key={type.value}>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-blue-600 mb-3">
                    {type.label}
                  </h3>
                  <div className="space-y-3">
                    {typeContacts.map((contact) => (
                      <div key={contact.id} className="bg-white rounded-lg shadow p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold">{contact.name}</h4>
                            {contact.company && (
                              <p className="text-gray-600 text-sm">{contact.company}</p>
                            )}
                            {contact.email && (
                              <p className="text-sm">{contact.email}</p>
                            )}
                            {contact.phone && (
                              <p className="text-sm">{contact.phone}</p>
                            )}
                            {contact.territory && (
                              <p className="text-sm text-gray-500">Territory: {contact.territory}</p>
                            )}
                            <div className="flex gap-2 mt-1">
                              <span className="text-xs text-gray-500">Order: {contact.position}</span>
                              {!contact.published && (
                                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                                  Unpublished
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(contact)}
                              className="text-blue-600 hover:underline text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(contact)}
                              className="text-red-600 hover:underline text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EpkContactsManager
