import { useState } from 'react'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import { tweetApi } from '../services/api/tweet.api'
import { likeApi } from '../services/api/like.api'
import { extractApiError } from '../utils/api'

const TweetsPage = () => {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [tweets, setTweets] = useState([])

  const publish = async (event) => {
    event.preventDefault()
    if (!content.trim()) return

    try {
      setLoading(true)
      const tweet = await tweetApi.create(content)
      setTweets((prev) => [tweet, ...prev])
      setContent('')
    } catch (err) {
      setError(extractApiError(err))
    } finally {
      setLoading(false)
    }
  }

  const deleteTweet = async (tweetId) => {
    await tweetApi.remove(tweetId)
    setTweets((prev) => prev.filter((tweet) => tweet._id !== tweetId))
  }

  const likeTweet = async (tweetId) => {
    await likeApi.toggleTweetLike(tweetId)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <h1 className="section-title text-3xl">Creator Posts</h1>
      <form onSubmit={publish} className="glass-panel space-y-3 rounded-2xl p-4">
        <Input
          label="What are you sharing today?"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Post an announcement, update, or shoutout"
        />
        <Button type="submit" disabled={loading}>{loading ? 'Posting...' : 'Publish Post'}</Button>
      </form>

      {error ? <p className="text-sm text-red-300">{error}</p> : null}

      <div className="space-y-3">
        {tweets.map((tweet) => (
          <article key={tweet._id} className="glass-panel rounded-2xl p-4">
            <p className="text-sm text-slate-100">{tweet.content}</p>
            <div className="mt-3 flex gap-2">
              <Button variant="ghost" onClick={() => likeTweet(tweet._id)}>Like</Button>
              <Button variant="danger" onClick={() => deleteTweet(tweet._id)}>Delete</Button>
            </div>
          </article>
        ))}
        {tweets.length === 0 ? <p className="text-sm text-(--text-muted)">No posts yet. Publish your first one.</p> : null}
      </div>
    </div>
  )
}

export default TweetsPage
