import { Bell, Search } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getInitials } from '../../utils/format'

const Navbar = () => {
  const { user } = useAuth()

  return (
    <header className="glass-panel sticky top-0 z-30 flex items-center justify-between rounded-2xl px-4 py-3">
      <div className="relative w-full max-w-lg">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          placeholder="Search videos, creators, playlists"
          className="w-full rounded-xl border border-white/10 bg-slate-950/30 py-2 pl-10 pr-4 text-sm outline-none transition focus:border-(--brand)"
        />
      </div>
      <div className="ml-4 flex items-center gap-4">
        <button className="rounded-xl border border-white/10 bg-slate-900/50 p-2.5 text-slate-300 hover:text-white">
          <Bell size={16} />
        </button>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-(--brand) text-sm font-bold text-slate-950">
          {getInitials(user?.fullname || user?.username || 'MT')}
        </div>
      </div>
    </header>
  )
}

export default Navbar
