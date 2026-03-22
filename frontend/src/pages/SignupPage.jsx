import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import { useAuth } from '../context/AuthContext'

const SignupPage = () => {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    fullname: '',
    username: '',
    email: '',
    password: '',
    avatar: null,
    coverImage: null,
  })

  const update = (field) => (event) => {
    const value = event.target.files ? event.target.files[0] : event.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const payload = new FormData()
    payload.append('fullname', form.fullname)
    payload.append('username', form.username)
    payload.append('email', form.email)
    payload.append('password', form.password)

    if (form.avatar) {
      payload.append('avatar', form.avatar)
    }
    if (form.coverImage) {
      payload.append('coverImage', form.coverImage)
    }

    try {
      setLoading(true)
      await signup(payload)
      navigate('/login')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl items-center px-4 py-10">
      <div className="glass-panel w-full rounded-3xl p-7 rise-in">
        <h1 className="section-title text-3xl">Create creator account</h1>
        <p className="mt-2 text-sm text-(--text-muted)">Join MiniTube and publish videos, posts, and playlists.</p>

        <form className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <Input label="Full Name" value={form.fullname} onChange={update('fullname')} required />
          <Input label="Username" value={form.username} onChange={update('username')} required />
          <Input label="Email" type="email" value={form.email} onChange={update('email')} required />
          <Input label="Password" type="password" value={form.password} onChange={update('password')} required />

          <label className="text-sm text-(--text-muted)">
            Avatar
            <input className="mt-2 block w-full text-sm" type="file" accept="image/*" onChange={update('avatar')} required />
          </label>
          <label className="text-sm text-(--text-muted)">
            Cover Image
            <input className="mt-2 block w-full text-sm" type="file" accept="image/*" onChange={update('coverImage')} />
          </label>

          <Button type="submit" className="md:col-span-2" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}

        <p className="mt-5 text-sm text-(--text-muted)">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[var(--brand)]">
            Login now
          </Link>
        </p>
      </div>
    </main>
  )
}

export default SignupPage
