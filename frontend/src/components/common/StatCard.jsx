const StatCard = ({ title, value, tone = 'default' }) => {
  const toneClass =
    tone === 'highlight'
      ? 'from-emerald-400/20 to-cyan-400/10 border-emerald-300/30'
      : 'from-slate-400/5 to-cyan-300/5 border-white/10'

  return (
    <article className={`glass-panel rounded-2xl border bg-gradient-to-br p-5 ${toneClass}`}>
      <p className="text-xs uppercase tracking-[0.2em] text-(--text-muted)">{title}</p>
      <p className="mt-3 text-2xl font-bold text-(--text-primary)">{value}</p>
    </article>
  )
}

export default StatCard
