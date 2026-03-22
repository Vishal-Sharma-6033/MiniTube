import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="glass-panel rounded-2xl p-8 text-center">
        <h1 className="section-title text-4xl">404</h1>
        <p className="mt-2 text-sm text-(--text-muted)">The page you requested does not exist.</p>
        <Link to="/" className="mt-5 inline-block rounded-xl bg-(--brand) px-4 py-2 text-sm font-semibold text-slate-950">
          Go to Home
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
