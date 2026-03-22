import http from '../http'
import { extractApiData } from '../../utils/api'

export const userApi = {
  getCurrentUser: async () => {
    const response = await http.get('/users/current-user')
    return extractApiData(response)
  },

  getProfileByUsername: async (username) => {
    const response = await http.get(`/users/c/${username}`)
    return extractApiData(response)
  },

  getWatchHistory: async () => {
    const response = await http.get('/users/watch-history')
    return extractApiData(response)
  },

  updateAccount: async (payload) => {
    const response = await http.patch('/users/update-account', payload)
    return extractApiData(response)
  },
}
