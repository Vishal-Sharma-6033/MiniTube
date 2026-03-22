import http from '../http'
import { extractApiData } from '../../utils/api'

export const tweetApi = {
  create: async (content) => {
    const response = await http.post('/tweets', { content })
    return extractApiData(response)
  },

  getById: async (tweetId) => {
    const response = await http.get(`/tweets/${tweetId}`)
    return extractApiData(response)
  },

  update: async (tweetId, content) => {
    const response = await http.patch(`/tweets/${tweetId}`, { content })
    return extractApiData(response)
  },

  remove: async (tweetId) => {
    const response = await http.delete(`/tweets/${tweetId}`)
    return extractApiData(response)
  },
}
