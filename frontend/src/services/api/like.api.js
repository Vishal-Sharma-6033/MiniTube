import http from '../http'
import { extractApiData } from '../../utils/api'

export const likeApi = {
  toggleVideoLike: async (videoId) => {
    const response = await http.post(`/likes/toggle/v/${videoId}`)
    return extractApiData(response)
  },

  toggleCommentLike: async (commentId) => {
    const response = await http.post(`/likes/toggle/c/${commentId}`)
    return extractApiData(response)
  },

  toggleTweetLike: async (tweetId) => {
    const response = await http.post(`/likes/toggle/t/${tweetId}`)
    return extractApiData(response)
  },

  getLikedVideos: async () => {
    const response = await http.get('/likes/videos')
    return extractApiData(response)
  },
}
