import http from '../http'
import { extractApiData } from '../../utils/api'

export const commentApi = {
  listByVideoId: async (videoId) => {
    const response = await http.get(`/comments/${videoId}`)
    const payload = extractApiData(response)
    return payload?.comments || []
  },

  add: async (videoId, content) => {
    const response = await http.post(`/comments/${videoId}`, { content })
    return extractApiData(response)
  },

  update: async (commentId, content) => {
    const response = await http.patch(`/comments/${commentId}`, { content })
    return extractApiData(response)
  },

  remove: async (commentId) => {
    const response = await http.delete(`/comments/${commentId}`)
    return extractApiData(response)
  },
}
