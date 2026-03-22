const Loader = ({ label = 'Loading...' }) => {
  return (
    <div className="flex items-center gap-3 text-sm text-(--text-muted)">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--brand)] border-t-transparent" />
      <span>{label}</span>
    </div>
  )
}

export default Loader
