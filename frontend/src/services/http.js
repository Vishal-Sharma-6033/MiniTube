import axios from 'axios'
import { API_BASE_URL } from '../utils/api'

const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 60000,
})

let isRefreshing = false
let pendingQueue = []

const AUTH_ENDPOINTS = ['/users/login', '/users/register', '/users/refresh-token', '/users/logout']

const shouldSkipRefresh = (requestUrl = '') => {
  return AUTH_ENDPOINTS.some((path) => requestUrl.includes(path))
}

const processQueue = (error) => {
  pendingQueue.forEach((promise) => {
    if (error) {
      promise.reject(error)
    } else {
      promise.resolve()
    }
  })
  pendingQueue = []
}

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config
    const isUnauthorized = error?.response?.status === 401
    const refreshPath = '/users/refresh-token'
    const requestUrl = originalRequest?.url || ''

    if (!isUnauthorized || originalRequest?._retry || requestUrl === refreshPath || shouldSkipRefresh(requestUrl)) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject })
      }).then(() => http(originalRequest))
    }

    isRefreshing = true

    try {
      await http.post(refreshPath)
      processQueue(null)
      return http(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError)
      // Preserve the original 401 reason for the caller (e.g. invalid credentials).
      return Promise.reject(error)
    } finally {
      isRefreshing = false
    }
  },
)

export default http
