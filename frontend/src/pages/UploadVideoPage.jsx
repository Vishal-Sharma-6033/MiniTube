import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import { videoApi } from '../services/api/video.api'
import { extractApiError } from '../utils/api'

const UploadVideoPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '',
    description: '',
    videoFile: null,
    thumbnail: null,
  })

  const updateField = (field) => (event) => {
    const value = event.target.files ? event.target.files[0] : event.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const payload = new FormData()
    payload.append('title', form.title)
    payload.append('description', form.description)
    if (form.videoFile) payload.append('videoFile', form.videoFile)
    if (form.thumbnail) payload.append('thumbnail', form.thumbnail)

    try {
      setLoading(true)
      const response = await videoApi.upload(payload)
      navigate(`/video/${response?._id}`)
    } catch (err) {
      setError(extractApiError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="glass-panel rounded-3xl p-6">
        <h1 className="section-title text-3xl">Upload new video</h1>
        <p className="mt-1 text-sm text-(--text-muted)">Share tutorials, vlogs, and creator updates with your audience.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <Input label="Title" value={form.title} onChange={updateField('title')} required />
          <label className="flex flex-col gap-2 text-sm text-(--text-muted)">
            Description
            <textarea
              value={form.description}
              onChange={updateField('description')}
              className="min-h-28 rounded-xl border border-white/15 bg-(--panel-strong) p-3 outline-none focus:border-(--brand)"
              required
            />
          </label>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="text-sm text-(--text-muted)">
              Video file
              <input className="mt-2 block w-full text-sm" type="file" accept="video/*" onChange={updateField('videoFile')} required />
            </label>
            <label className="text-sm text-(--text-muted)">
              Thumbnail
              <input className="mt-2 block w-full text-sm" type="file" accept="image/*" onChange={updateField('thumbnail')} required />
            </label>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? 'Publishing...' : 'Publish Video'}
          </Button>
        </form>

        {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
      </div>
    </div>
  )
}

export default UploadVideoPage
