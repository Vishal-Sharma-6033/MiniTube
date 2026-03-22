import http from '../http'
import { extractApiData } from '../../utils/api'

export const authApi = {
  login: async (payload) => {
    const response = await http.post('/users/login', payload)
    return extractApiData(response)
  },

  signup: async (formData) => {
    const response = await http.post('/users/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000,
    })
    return extractApiData(response)
  },

  logout: async () => {
    const response = await http.post('/users/logout')
    return extractApiData(response)
  },
}
