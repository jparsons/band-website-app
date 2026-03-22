import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { adminMessagesApi } from '../../services/api'

const Messages = () => {
  const queryClient = useQueryClient()

  const { data: messages } = useQuery({
    queryKey: ['admin-messages'],
    queryFn: async () => {
      const response = await adminMessagesApi.getMessages()
      return response.data
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => adminMessagesApi.updateMessage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-messages'])
      toast.success('Message updated!')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: adminMessagesApi.deleteMessage,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-messages'])
      toast.success('Message deleted!')
    },
  })

  const toggleRead = (message) => {
    updateMutation.mutate({ id: message.id, data: { read: !message.read } })
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Contact Messages</h1>
      
      <div className="bg-white rounded-lg shadow">
        {messages && messages.length > 0 ? (
          <div className="divide-y">
            {messages.map((message) => (
              <div key={message.id} className={`p-6 ${message.read ? 'bg-gray-50' : 'bg-white'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg">{message.name}</h3>
                      <span className="text-sm text-gray-500">{message.email}</span>
                      {!message.read && (
                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">New</span>
                      )}
                    </div>
                    {message.subject && (
                      <p className="text-gray-700 font-semibold mb-2">{message.subject}</p>
                    )}
                    <p className="text-gray-600 mb-2">{message.message}</p>
                    <p className="text-xs text-gray-500">
                      Received: {new Date(message.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="ml-4 flex flex-col gap-2">
                    <button
                      onClick={() => toggleRead(message)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {message.read ? 'Mark Unread' : 'Mark Read'}
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(message.id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-600">
            No messages yet
          </div>
        )}
      </div>
    </div>
  )
}

export default Messages
