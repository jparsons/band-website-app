import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Public API
export const bandApi = {
  getBand: () => api.get('/band'),
}

export const eventsApi = {
  getEvents: () => api.get('/events'),
  getEvent: (id) => api.get(`/events/${id}`),
}

export const galleriesApi = {
  getGalleries: () => api.get('/galleries'),
  getGallery: (id) => api.get(`/galleries/${id}`),
}

export const videosApi = {
  getVideos: () => api.get('/videos'),
}

export const merchandiseApi = {
  getMerchandise: () => api.get('/merchandise'),
  getMerchItem: (id) => api.get(`/merchandise/${id}`),
}

export const contactApi = {
  sendMessage: (data) => api.post('/contact', { contact_message: data }),
}

export const bandMembersApi = {
  getBandMembers: () => api.get('/band_members'),
}

export const releasesApi = {
  getReleases: () => api.get('/releases'),
}

export const epkApi = {
  getEpk: () => api.get('/epk'),
  downloadPdf: () => api.get('/epk/pdf', { responseType: 'blob' }),
}

// Auth API
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  verify: () => api.get('/auth/verify'),
}

// Helper to create FormData with nested keys for Rails
const buildFormData = (data, namespace) => {
  const formData = new FormData()
  for (const key in data) {
    const value = data[key]
    // Skip only undefined and null, but include empty strings
    if (value === undefined || value === null) continue

    const formKey = namespace ? `${namespace}[${key}]` : key
    if (value instanceof File) {
      formData.append(formKey, value)
    } else if (typeof value === 'object' && !(value instanceof File)) {
      // Handle nested objects like social_links
      for (const nestedKey in value) {
        const nestedValue = value[nestedKey]
        if (nestedValue !== undefined && nestedValue !== null) {
          formData.append(`${formKey}[${nestedKey}]`, nestedValue)
        }
      }
    } else {
      // Convert to string to ensure proper FormData encoding
      formData.append(formKey, String(value))
    }
  }
  return formData
}

// Admin API
export const adminBandApi = {
  updateBand: (data) => {
    // Check if there are any files to upload
    const hasFiles = Object.values(data).some(value => value instanceof File)

    if (hasFiles) {
      const formData = buildFormData(data, 'band')
      return api.patch('/admin/band', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    } else {
      // Use JSON for non-file updates (more reliable)
      return api.patch('/admin/band', { band: data })
    }
  },
}

export const adminEventsApi = {
  getEvents: () => api.get('/admin/events'),
  createEvent: (data) => api.post('/admin/events', { event: data }),
  updateEvent: (id, data) => api.patch(`/admin/events/${id}`, { event: data }),
  deleteEvent: (id) => api.delete(`/admin/events/${id}`),
}

export const adminGalleriesApi = {
  getGalleries: () => api.get('/admin/galleries'),
  createGallery: (data) => {
    const formData = buildFormData(data, 'photo_gallery')
    return api.post('/admin/galleries', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  updateGallery: (id, data) => {
    const formData = buildFormData(data, 'photo_gallery')
    return api.patch(`/admin/galleries/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  deleteGallery: (id) => api.delete(`/admin/galleries/${id}`),
}

export const adminPhotosApi = {
  createPhoto: (galleryId, data) => {
    const formData = buildFormData(data, 'photo')
    return api.post(`/admin/galleries/${galleryId}/photos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  updatePhoto: (id, data) => {
    const formData = buildFormData(data, 'photo')
    return api.patch(`/admin/photos/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  deletePhoto: (id) => api.delete(`/admin/photos/${id}`),
}

export const adminVideosApi = {
  getVideos: () => api.get('/admin/videos'),
  createVideo: (data) => {
    const formData = buildFormData(data, 'video')
    return api.post('/admin/videos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  updateVideo: (id, data) => {
    const formData = buildFormData(data, 'video')
    return api.patch(`/admin/videos/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  deleteVideo: (id) => api.delete(`/admin/videos/${id}`),
}

export const adminMerchandiseApi = {
  getMerchandise: () => api.get('/admin/merchandise'),
  createMerch: (data) => {
    const formData = buildFormData(data, 'merchandise')
    return api.post('/admin/merchandise', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  updateMerch: (id, data) => {
    const formData = buildFormData(data, 'merchandise')
    return api.patch(`/admin/merchandise/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  deleteMerch: (id) => api.delete(`/admin/merchandise/${id}`),
}

export const adminMessagesApi = {
  getMessages: () => api.get('/admin/messages'),
  updateMessage: (id, data) => api.patch(`/admin/messages/${id}`, { contact_message: data }),
  deleteMessage: (id) => api.delete(`/admin/messages/${id}`),
}

export const adminUsersApi = {
  getUsers: () => api.get('/admin/users'),
  getUser: (id) => api.get(`/admin/users/${id}`),
  createUser: (data) => api.post('/admin/users', { user: data }),
  updateUser: (id, data) => api.patch(`/admin/users/${id}`, { user: data }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
}

export const adminBandMembersApi = {
  getBandMembers: () => api.get('/admin/band_members'),
  getBandMember: (id) => api.get(`/admin/band_members/${id}`),
  createBandMember: (data) => {
    const formData = buildFormData(data, 'band_member')
    return api.post('/admin/band_members', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  updateBandMember: (id, data) => {
    const formData = buildFormData(data, 'band_member')
    return api.patch(`/admin/band_members/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  deleteBandMember: (id) => api.delete(`/admin/band_members/${id}`),
}

export const adminPressQuotesApi = {
  getPressQuotes: () => api.get('/admin/press_quotes'),
  getPressQuote: (id) => api.get(`/admin/press_quotes/${id}`),
  createPressQuote: (data) => api.post('/admin/press_quotes', { press_quote: data }),
  updatePressQuote: (id, data) => api.patch(`/admin/press_quotes/${id}`, { press_quote: data }),
  deletePressQuote: (id) => api.delete(`/admin/press_quotes/${id}`),
}

export const adminReleasesApi = {
  getReleases: () => api.get('/admin/releases'),
  getRelease: (id) => api.get(`/admin/releases/${id}`),
  createRelease: (data) => {
    const formData = buildFormData(data, 'release')
    return api.post('/admin/releases', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  updateRelease: (id, data) => {
    const formData = buildFormData(data, 'release')
    return api.patch(`/admin/releases/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  deleteRelease: (id) => api.delete(`/admin/releases/${id}`),
}

export const adminEpkContactsApi = {
  getEpkContacts: () => api.get('/admin/epk_contacts'),
  getEpkContact: (id) => api.get(`/admin/epk_contacts/${id}`),
  createEpkContact: (data) => api.post('/admin/epk_contacts', { epk_contact: data }),
  updateEpkContact: (id, data) => api.patch(`/admin/epk_contacts/${id}`, { epk_contact: data }),
  deleteEpkContact: (id) => api.delete(`/admin/epk_contacts/${id}`),
}

export const adminTechnicalRiderApi = {
  getSections: () => api.get('/admin/technical_rider_sections'),
  getSection: (id) => api.get(`/admin/technical_rider_sections/${id}`),
  createSection: (data) => {
    const formData = buildFormData(data, 'technical_rider_section')
    return api.post('/admin/technical_rider_sections', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  updateSection: (id, data) => {
    const formData = buildFormData(data, 'technical_rider_section')
    return api.patch(`/admin/technical_rider_sections/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  deleteSection: (id) => api.delete(`/admin/technical_rider_sections/${id}`),
}

export default api
