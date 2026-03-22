import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, error } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [localError, setLocalError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLocalError('')

    try {
      setLoading(true)
      await login({ email: form.email, password: form.password })
      const redirectTo = location.state?.from?.pathname || '/'
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setLocalError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4">
      <div className="glass-panel w-full rounded-3xl p-7 rise-in">
        <h1 className="section-title text-3xl">Welcome back</h1>
        <p className="mt-2 text-sm text-(--text-muted)">Login to manage your channel and creator analytics.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </Button>
        </form>

        {localError || error ? <p className="mt-4 text-sm text-red-300">{localError || error}</p> : null}

        <p className="mt-5 text-sm text-(--text-muted)">
          New on MiniTube?{' '}
          <Link to="/signup" className="font-semibold text-[var(--brand)]">
            Create account
          </Link>
        </p>
      </div>
    </main>
  )
}

export default LoginPage
