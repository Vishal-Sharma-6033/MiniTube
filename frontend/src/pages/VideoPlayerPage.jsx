import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Heart, MessageCircle, UserPlus } from 'lucide-react'
import Button from '../components/common/Button'
import Loader from '../components/common/Loader'
import ErrorState from '../components/common/ErrorState'
import { videoApi } from '../services/api/video.api'
import { commentApi } from '../services/api/comment.api'
import { likeApi } from '../services/api/like.api'
import { subscriptionApi } from '../services/api/subscription.api'
import { extractApiError } from '../utils/api'
import { formatDate } from '../utils/format'

const VideoPlayerPage = () => {
  const { videoId } = useParams()
  const [video, setVideo] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [commentText, setCommentText] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError('')

      const [videoData, commentData] = await Promise.all([
        videoApi.getById(videoId),
        commentApi.listByVideoId(videoId),
      ])

      setVideo(videoData)
      setComments(commentData)
      await videoApi.incrementView(videoId)
    } catch (err) {
      setError(extractApiError(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [videoId])

  const handleVideoLike = async () => {
    await likeApi.toggleVideoLike(videoId)
  }

  const handleSubscribe = async () => {
    if (!video?.owner?._id) return
    await subscriptionApi.toggle(video.owner._id)
  }

  const submitComment = async (event) => {
    event.preventDefault()
    if (!commentText.trim()) return

    try {
      setActionLoading(true)
      await commentApi.add(videoId, commentText)
      setCommentText('')
      const nextComments = await commentApi.listByVideoId(videoId)
      setComments(nextComments)
    } catch (err) {
      setError(extractApiError(err))
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return <Loader label="Loading video" />
  }

  if (error) {
    return <ErrorState message={error} />
  }

  if (!video) {
    return <ErrorState message="Video not found" />
  }

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
      <div className="space-y-4">
        <div className="glass-panel overflow-hidden rounded-3xl">
          <video src={video.videoFile} controls className="w-full" />
        </div>

        <div className="glass-panel rounded-2xl p-5">
          <h1 className="section-title text-2xl">{video.title}</h1>
          <p className="mt-2 text-sm text-(--text-muted)">{video.description}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="ghost" onClick={handleVideoLike} className="inline-flex items-center gap-2">
              <Heart size={16} /> Like
            </Button>
            <Button variant="ghost" onClick={handleSubscribe} className="inline-flex items-center gap-2">
              <UserPlus size={16} /> Subscribe
            </Button>
          </div>
        </div>
      </div>

      <aside className="glass-panel rounded-2xl p-4">
        <h2 className="section-title text-xl">Comments</h2>
        <form className="mt-3 flex gap-2" onSubmit={submitComment}>
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="w-full rounded-lg border border-white/15 bg-slate-950/35 px-3 py-2 text-sm outline-none focus:border-(--brand)"
            placeholder="Write a comment"
          />
          <Button type="submit" disabled={actionLoading}>Post</Button>
        </form>

        <div className="mt-4 space-y-3">
          {comments.map((comment) => (
            <article key={comment._id} className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-sm text-white">{comment.content}</p>
              <div className="mt-2 flex items-center justify-between text-xs text-(--text-muted)">
                <span>{comment.owner?.username || 'user'}</span>
                <span>{formatDate(comment.createdAt)}</span>
              </div>
            </article>
          ))}

          {comments.length === 0 ? (
            <p className="inline-flex items-center gap-2 text-sm text-(--text-muted)">
              <MessageCircle size={14} />
              No comments yet
            </p>
          ) : null}
        </div>
      </aside>
    </div>
  )
}

export default VideoPlayerPage
