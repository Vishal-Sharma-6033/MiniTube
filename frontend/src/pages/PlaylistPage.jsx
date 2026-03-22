import { useEffect, useState } from 'react'
import Button from '../components/common/Button'
import Loader from '../components/common/Loader'
import Modal from '../components/common/Modal'
import Input from '../components/common/Input'
import { useAuth } from '../context/AuthContext'
import { playlistApi } from '../services/api/playlist.api'
import { extractApiError } from '../utils/api'

const PlaylistPage = () => {
  const { user } = useAuth()
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)
  const [payload, setPayload] = useState({ name: '', description: '' })

  const fetchPlaylists = async () => {
    if (!user?._id) return

    try {
      setLoading(true)
      const result = await playlistApi.getByUserId(user._id)
      setPlaylists(result || [])
    } catch (err) {
      setError(extractApiError(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlaylists()
  }, [user?._id])

  const createPlaylist = async (event) => {
    event.preventDefault()
    try {
      await playlistApi.create(payload)
      setOpen(false)
      setPayload({ name: '', description: '' })
      fetchPlaylists()
    } catch (err) {
      setError(extractApiError(err))
    }
  }

  const deletePlaylist = async (playlistId) => {
    await playlistApi.remove(playlistId)
    fetchPlaylists()
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title text-3xl">Playlists</h1>
          <p className="text-sm text-(--text-muted)">Group videos into curated collections.</p>
        </div>
        <Button onClick={() => setOpen(true)}>Create Playlist</Button>
      </div>

      {loading ? <Loader label="Loading playlists" /> : null}
      {error ? <p className="text-sm text-red-300">{error}</p> : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {playlists.map((playlist) => (
          <article key={playlist._id} className="glass-panel rounded-2xl p-4">
            <h3 className="font-semibold text-white">{playlist.name}</h3>
            <p className="mt-2 text-sm text-(--text-muted)">{playlist.description}</p>
            <Button variant="danger" className="mt-4" onClick={() => deletePlaylist(playlist._id)}>
              Delete
            </Button>
          </article>
        ))}
      </div>

      <Modal title="Create Playlist" open={open} onClose={() => setOpen(false)}>
        <form onSubmit={createPlaylist} className="space-y-3">
          <Input
            label="Playlist Name"
            value={payload.name}
            onChange={(event) => setPayload((prev) => ({ ...prev, name: event.target.value }))}
            required
          />
          <label className="flex flex-col gap-2 text-sm text-(--text-muted)">
            Description
            <textarea
              value={payload.description}
              onChange={(event) => setPayload((prev) => ({ ...prev, description: event.target.value }))}
              className="min-h-24 rounded-xl border border-white/15 bg-(--panel-strong) p-3 outline-none focus:border-(--brand)"
              required
            />
          </label>
          <Button type="submit">Save Playlist</Button>
        </form>
      </Modal>
    </section>
  )
}

export default PlaylistPage
