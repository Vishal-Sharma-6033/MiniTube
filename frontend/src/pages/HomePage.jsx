import { useEffect, useState } from 'react'
import VideoCard from '../components/common/VideoCard'
import Loader from '../components/common/Loader'
import ErrorState from '../components/common/ErrorState'
import { videoApi } from '../services/api/video.api'
import { extractApiError } from '../utils/api'

const HomePage = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchVideos = async () => {
    try {
      setLoading(true)
      setError('')
      const result = await videoApi.getAll()
      setVideos(result || [])
    } catch (err) {
      setError(extractApiError(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVideos()
  }, [])

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="section-title text-3xl md:text-4xl">Video feed</h1>
          <p className="mt-1 text-sm text-(--text-muted)">Latest uploads from channels you follow.</p>
        </div>
      </header>

      {loading ? <Loader label="Loading videos" /> : null}
      {error ? <ErrorState message={error} /> : null}

      {!loading && !error ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default HomePage
