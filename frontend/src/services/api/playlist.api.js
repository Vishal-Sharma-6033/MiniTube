import http from '../http'
import { extractApiData } from '../../utils/api'

export const playlistApi = {
  create: async (payload) => {
    const response = await http.post('/playlist', payload)
    return extractApiData(response)
  },

  getById: async (playlistId) => {
    const response = await http.get(`/playlist/${playlistId}`)
    return extractApiData(response)
  },

  getByUserId: async (userId) => {
    const response = await http.get(`/playlist/user/${userId}`)
    return extractApiData(response)
  },

  update: async (playlistId, payload) => {
    const response = await http.patch(`/playlist/${playlistId}`, payload)
    return extractApiData(response)
  },

  remove: async (playlistId) => {
    const response = await http.delete(`/playlist/${playlistId}`)
    return extractApiData(response)
  },

  addVideo: async (videoId, playlistId) => {
    const response = await http.patch(`/playlist/add/${videoId}/${playlistId}`)
    return extractApiData(response)
  },

  removeVideo: async (videoId, playlistId) => {
    const response = await http.patch(`/playlist/remove/${videoId}/${playlistId}`)
    return extractApiData(response)
  },
}
