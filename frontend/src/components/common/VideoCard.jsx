import { Link } from 'react-router-dom'
import { Eye } from 'lucide-react'
import { formatDate, formatNumber } from '../../utils/format'

const VideoCard = ({ video }) => {
  return (
    <Link
      to={`/video/${video._id}`}
      className="glass-panel group flex flex-col overflow-hidden rounded-2xl transition duration-300 hover:-translate-y-1"
    >
      <img
        src={video.thumbnail}
        alt={video.title}
        className="h-44 w-full object-cover transition duration-300 group-hover:scale-[1.03]"
      />
      <div className="space-y-2 p-4">
        <h3 className="line-clamp-2 text-base font-semibold text-(--text-primary)">{video.title}</h3>
        <p className="text-xs text-(--text-muted)">{video.owner?.username || 'creator'}</p>
        <div className="flex items-center justify-between text-xs text-(--text-muted)">
          <span className="inline-flex items-center gap-1">
            <Eye size={14} />
            {formatNumber(video.views)}
          </span>
          <span>{formatDate(video.createdAt)}</span>
        </div>
      </div>
    </Link>
  )
}

export default VideoCard
