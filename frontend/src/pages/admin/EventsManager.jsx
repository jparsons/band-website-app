import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { adminEventsApi } from '../../services/api'

const EventsManager = () => {
  const [editingEvent, setEditingEvent] = useState(null)
  const queryClient = useQueryClient()
  const { register, handleSubmit, reset } = useForm()

  const { data: events } = useQuery({
    queryKey: ['admin-events'],
    queryFn: async () => {
      const response = await adminEventsApi.getEvents()
      return response.data
    },
  })

  const createMutation = useMutation({
    mutationFn: adminEventsApi.createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-events'])
      toast.success('Event created!')
      reset()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => adminEventsApi.updateEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-events'])
      toast.success('Event updated!')
      setEditingEvent(null)
      reset()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: adminEventsApi.deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-events'])
      toast.success('Event deleted!')
    },
  })

  const onSubmit = (data) => {
    if (editingEvent) {
      updateMutation.mutate({ id: editingEvent.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const handleEdit = (event) => {
    setEditingEvent(event)
    reset(event)
  }

  const handleCancelEdit = () => {
    setEditingEvent(null)
    reset({})
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Events Manager</h1>
      
      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">
            {editingEvent ? 'Edit Event' : 'Create New Event'}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Title *</label>
              <input type="text" {...register('title', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Venue *</label>
              <input type="text" {...register('venue', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">City</label>
              <input type="text" {...register('city')} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">State</label>
              <input type="text" {...register('state')} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Date *</label>
              <input type="datetime-local" {...register('date', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Ticket URL</label>
              <input type="url" {...register('ticket_url')} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Description</label>
              <textarea rows="3" {...register('description')} className="w-full px-4 py-2 border rounded-lg"></textarea>
            </div>
            
            <div className="mb-4 flex items-center gap-4">
              <label className="flex items-center">
                <input type="checkbox" {...register('featured')} className="mr-2" />
                Featured
              </label>
              <label className="flex items-center">
                <input type="checkbox" {...register('published')} className="mr-2" />
                Published
              </label>
            </div>
            
            <div className="flex gap-2">
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                {editingEvent ? 'Update' : 'Create'}
              </button>
              {editingEvent && (
                <button type="button" onClick={handleCancelEdit} className="bg-gray-300 px-6 py-2 rounded-lg hover:bg-gray-400">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-4">All Events</h2>
          <div className="space-y-4">
            {events?.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow p-4">
                <h3 className="font-bold text-lg">{event.title}</h3>
                <p className="text-gray-600">{event.venue} - {event.city}</p>
                <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                <div className="mt-2 flex gap-2">
                  <button onClick={() => handleEdit(event)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => deleteMutation.mutate(event.id)} className="text-red-600 hover:underline">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventsManager
