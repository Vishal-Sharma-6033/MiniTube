import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Loader from '../components/common/Loader'
import { userApi } from '../services/api/user.api'
import { playlistApi } from '../services/api/playlist.api'
import { subscriptionApi } from '../services/api/subscription.api'
import { extractApiError } from '../utils/api'

const ProfilePage = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [playlists, setPlaylists] = useState([])
  const [subscribedChannels, setSubscribedChannels] = useState([])
  const [watchHistory, setWatchHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const username = useMemo(() => user?.username, [user?.username])

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?._id || !username) return

      try {
        setLoading(true)
        const [profileData, playlistData, subscribedData, watchData] = await Promise.all([
          userApi.getProfileByUsername(username),
          playlistApi.getByUserId(user._id),
          subscriptionApi.getSubscribedChannels(user._id),
          userApi.getWatchHistory(),
        ])

        setProfile(profileData)
        setPlaylists(playlistData || [])
        setSubscribedChannels(subscribedData || [])
        setWatchHistory(watchData || [])
      } catch (err) {
        setError(extractApiError(err))
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [user?._id, username])

  if (loading) return <Loader label="Loading profile" />

  return (
    <div className="space-y-6">
      {error ? <p className="text-sm text-red-300">{error}</p> : null}

      <section className="glass-panel overflow-hidden rounded-3xl">
        <div className="h-40 bg-linear-to-r from-cyan-500/30 via-emerald-500/20 to-blue-500/30" />
        <div className="px-6 pb-6">
          <img
            src={profile?.avatar || user?.avatar}
            alt={profile?.username}
            className="-mt-10 h-20 w-20 rounded-2xl border-4 border-[#0a1223] object-cover"
          />
          <h1 className="section-title mt-3 text-3xl">{profile?.fullname || user?.fullname}</h1>
          <p className="text-sm text-(--text-muted)">@{profile?.username || user?.username}</p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-(--text-muted)">
            <span className="rounded-full bg-white/8 px-3 py-1">Subscribers: {profile?.subscribeCount || 0}</span>
            <span className="rounded-full bg-white/8 px-3 py-1">Subscribed: {profile?.subscribedToCount || 0}</span>
            <span className="rounded-full bg-white/8 px-3 py-1">Playlists: {playlists.length}</span>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <article className="glass-panel rounded-2xl p-4">
          <h2 className="section-title text-xl">Subscribed Channels</h2>
          <div className="mt-3 space-y-2">
            {subscribedChannels.map((entry) => (
              <p key={entry._id} className="text-sm text-(--text-muted)">
                {entry.channel?.fullname || entry.channel?.username}
              </p>
            ))}
            {subscribedChannels.length === 0 ? <p className="text-sm text-(--text-muted)">No subscriptions yet.</p> : null}
          </div>
        </article>

        <article className="glass-panel rounded-2xl p-4">
          <h2 className="section-title text-xl">Watch History</h2>
          <div className="mt-3 space-y-2">
            {watchHistory.map((video) => (
              <p key={video._id} className="line-clamp-1 text-sm text-(--text-muted)">
                {video.title}
              </p>
            ))}
            {watchHistory.length === 0 ? <p className="text-sm text-(--text-muted)">No watch history available.</p> : null}
          </div>
        </article>
      </section>
    </div>
  )
}

export default ProfilePage
