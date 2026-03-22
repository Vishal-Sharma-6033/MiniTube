import http from '../http'
import { extractApiData } from '../../utils/api'

export const videoApi = {
  getAll: async () => {
    const response = await http.get('/videos')
    return extractApiData(response)
  },

  getById: async (videoId) => {
    const response = await http.get(`/videos/${videoId}`)
    return extractApiData(response)
  },

  upload: async (formData) => {
    const response = await http.post('/videos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 180000,
    })
    return extractApiData(response)
  },

  update: async (videoId, payload) => {
    const response = await http.patch(`/videos/${videoId}`, payload)
    return extractApiData(response)
  },

  delete: async (videoId) => {
    const response = await http.delete(`/videos/${videoId}`)
    return extractApiData(response)
  },

  toggleStatus: async (videoId) => {
    const response = await http.patch(`/videos/${videoId}/toggle-status`)
    return extractApiData(response)
  },

  incrementView: async (videoId) => {
    const response = await http.patch(`/videos/${videoId}/view`)
    return extractApiData(response)
  },
}
