import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { adminUsersApi } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

const UsersManager = () => {
  const [editingUser, setEditingUser] = useState(null)
  const queryClient = useQueryClient()
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const { user: currentUser } = useAuth()

  const { data: users } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const response = await adminUsersApi.getUsers()
      return response.data
    },
  })

  const createMutation = useMutation({
    mutationFn: adminUsersApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users'])
      toast.success('User created!')
      reset()
    },
    onError: (error) => {
      toast.error(error.response?.data?.errors?.join(', ') || 'Failed to create user')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => adminUsersApi.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users'])
      toast.success('User updated!')
      setEditingUser(null)
      reset()
    },
    onError: (error) => {
      toast.error(error.response?.data?.errors?.join(', ') || 'Failed to update user')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: adminUsersApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users'])
      toast.success('User deleted!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.errors?.join(', ') || 'Failed to delete user')
    },
  })

  const onSubmit = (data) => {
    // Remove empty password fields on update
    if (editingUser && !data.password) {
      delete data.password
      delete data.password_confirmation
    }

    if (editingUser) {
      updateMutation.mutate({ id: editingUser.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    reset({
      email: user.email,
      role: user.role,
      password: '',
      password_confirmation: '',
    })
  }

  const handleCancelEdit = () => {
    setEditingUser(null)
    reset({})
  }

  const handleDelete = (user) => {
    if (user.id === currentUser?.id) {
      toast.error('You cannot delete your own account')
      return
    }
    if (window.confirm(`Are you sure you want to delete ${user.email}?`)) {
      deleteMutation.mutate(user.id)
    }
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Users Manager</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">
            {editingUser ? 'Edit User' : 'Create New User'}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Email *</label>
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                className="w-full px-4 py-2 border rounded-lg"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">
                Password {editingUser ? '(leave blank to keep current)' : '*'}
              </label>
              <input
                type="password"
                {...register('password', {
                  required: editingUser ? false : 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                className="w-full px-4 py-2 border rounded-lg"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Confirm Password</label>
              <input
                type="password"
                {...register('password_confirmation')}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Role *</label>
              <select
                {...register('role', { required: true })}
                className="w-full px-4 py-2 border rounded-lg"
                disabled={editingUser?.id === currentUser?.id}
              >
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
              </select>
              {editingUser?.id === currentUser?.id && (
                <p className="text-sm text-gray-500 mt-1">You cannot change your own role</p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {editingUser ? 'Update' : 'Create'}
              </button>
              {editingUser && (
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
          <h2 className="text-2xl font-bold mb-4">All Users</h2>
          <div className="space-y-4">
            {users?.map((user) => (
              <div key={user.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{user.email}</h3>
                    <span className={`inline-block px-2 py-1 text-xs rounded mt-1 ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                    {user.id === currentUser?.id && (
                      <span className="inline-block px-2 py-1 text-xs rounded mt-1 ml-2 bg-blue-100 text-blue-800">
                        You
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    {user.id !== currentUser?.id && (
                      <button
                        onClick={() => handleDelete(user)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Created: {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UsersManager
