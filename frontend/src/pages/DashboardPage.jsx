import { useEffect, useState } from 'react'
import Loader from '../components/common/Loader'
import StatCard from '../components/common/StatCard'
import { dashboardApi } from '../services/api/dashboard.api'
import { extractApiError } from '../utils/api'
import { formatNumber } from '../utils/format'

const DashboardPage = () => {
  const [stats, setStats] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true)
        const [statsPayload, videosPayload] = await Promise.all([
          dashboardApi.getStats(),
          dashboardApi.getChannelVideos({ page: 1, limit: 6 }),
        ])

        setStats(statsPayload)
        setVideos(videosPayload || [])
      } catch (err) {
        setError(extractApiError(err))
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  if (loading) return <Loader label="Loading dashboard" />

  return (
    <div className="space-y-5">
      <h1 className="section-title text-3xl">Channel Analytics</h1>
      {error ? <p className="text-sm text-red-300">{error}</p> : null}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Videos" value={formatNumber(stats?.totalVideos)} />
        <StatCard title="Total Views" value={formatNumber(stats?.totalViews)} tone="highlight" />
        <StatCard title="Subscribers" value={formatNumber(stats?.totalSubscriber)} />
        <StatCard title="Likes" value={formatNumber(stats?.totalLikes)} tone="highlight" />
      </section>

      <section className="glass-panel rounded-2xl p-5">
        <h2 className="section-title text-xl">Latest Uploaded Videos</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
          {videos.map((video) => (
            <article key={video._id} className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="font-semibold text-white">{video.title}</p>
              <p className="mt-1 text-xs text-(--text-muted)">Views: {formatNumber(video.views)}</p>
            </article>
          ))}
          {videos.length === 0 ? <p className="text-sm text-(--text-muted)">No channel videos found.</p> : null}
        </div>
      </section>
    </div>
  )
}

export default DashboardPage
