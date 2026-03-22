import { LayoutDashboard, Home, Upload, ListVideo, UserCircle2, LogOut, Podcast } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const links = [
  { label: 'Home Feed', to: '/', icon: Home },
  { label: 'Upload Video', to: '/upload', icon: Upload },
  { label: 'Playlists', to: '/playlists', icon: ListVideo },
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Posts', to: '/tweets', icon: Podcast },
  { label: 'Profile', to: '/profile', icon: UserCircle2 },
]

const Sidebar = () => {
  const { logout } = useAuth()

  return (
    <aside className="glass-panel sticky top-0 hidden h-screen flex-col rounded-r-3xl px-5 py-6 lg:flex">
      <div>
        <p className="section-title text-2xl">MiniTube</p>
        <p className="mt-1 text-xs tracking-[0.18em] text-(--text-muted)">Creator Control Room</p>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-2">
        {links.map((link) => {
          const Icon = link.icon
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                  isActive ? 'bg-(--brand) text-slate-950' : 'text-(--text-muted) hover:bg-white/8 hover:text-white'
                }`
              }
            >
              <Icon size={16} />
              {link.label}
            </NavLink>
          )
        })}
      </nav>

      <button
        onClick={logout}
        className="mt-3 inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-(--text-muted) hover:bg-white/8 hover:text-white"
      >
        <LogOut size={15} />
        Logout
      </button>
    </aside>
  )
}

export default Sidebar
