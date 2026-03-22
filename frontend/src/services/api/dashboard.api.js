import http from '../http'
import { extractApiData } from '../../utils/api'

export const dashboardApi = {
  getStats: async () => {
    const response = await http.get('/deshboard/stats')
    return extractApiData(response)
  },

  getChannelVideos: async (params = {}) => {
    const response = await http.get('/deshboard/videos', { params })
    return extractApiData(response)
  },
}
