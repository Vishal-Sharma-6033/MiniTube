export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1'

export const extractApiData = (response) => {
  const payload = response?.data
  if (!payload) {
    return null
  }

  if (typeof payload.data !== 'undefined') {
    return payload.data
  }

  if (typeof payload.message !== 'undefined') {
    return payload.message
  }

  return payload
}

export const extractApiError = (error) => {
  if (error?.response?.data?.message) {
    return error.response.data.message
  }
  if (error?.message) {
    return error.message
  }
  return 'Something went wrong. Please try again.'
}
