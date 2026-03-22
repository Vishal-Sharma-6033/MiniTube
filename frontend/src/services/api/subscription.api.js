import http from '../http'
import { extractApiData } from '../../utils/api'

export const subscriptionApi = {
  toggle: async (channelId) => {
    const response = await http.post(`/subscriptions/channel/${channelId}`)
    return extractApiData(response)
  },

  getChannelSubscribers: async (channelId) => {
    const response = await http.get(`/subscriptions/channel/${channelId}`)
    return extractApiData(response)
  },

  getSubscribedChannels: async (subscriberId) => {
    const response = await http.get(`/subscriptions/user/${subscriberId}`)
    return extractApiData(response)
  },
}
