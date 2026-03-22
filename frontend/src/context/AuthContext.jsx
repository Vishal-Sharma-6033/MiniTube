import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { authApi } from '../services/api/auth.api'
import { userApi } from '../services/api/user.api'
import { extractApiError } from '../utils/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const bootstrap = useCallback(async () => {
    try {
      setLoading(true)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('API timeout')), 10000)
      })

      const me = await Promise.race([userApi.getCurrentUser(), timeoutPromise])
      setUser(me)
      setError('')
    } catch (error) {
      setUser(null)

      // 401 is expected for logged-out users. Show no global backend error in that case.
      if (error?.response?.status === 401) {
        setError('')
      } else {
        setError('Backend is unreachable. Start API server and try again.')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    bootstrap()
  }, [bootstrap])

  const login = async (credentials) => {
    try {
      setError('')
      const payload = await authApi.login(credentials)
      setUser(payload?.user || null)
      return payload
    } catch (authError) {
      const message = extractApiError(authError)
      setError(message)
      throw new Error(message)
    }
  }

  const signup = async (formData) => {
    try {
      setError('')
      return await authApi.signup(formData)
    } catch (authError) {
      const message = extractApiError(authError)
      setError(message)
      throw new Error(message)
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } finally {
      setUser(null)
    }
  }

  const refreshUser = async () => {
    const me = await userApi.getCurrentUser()
    setUser(me)
    return me
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      isAuthenticated: Boolean(user),
      login,
      signup,
      logout,
      refreshUser,
      setUser,
    }),
    [user, loading, error],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
