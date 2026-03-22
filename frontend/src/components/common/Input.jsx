import clsx from 'clsx'

const Input = ({ label, className, error, ...props }) => {
  return (
    <label className="flex w-full flex-col gap-2 text-sm">
      {label ? <span className="font-medium text-(--text-muted)">{label}</span> : null}
      <input
        className={clsx(
          'w-full rounded-xl border border-white/15 bg-(--panel-strong) px-3 py-2.5 text-(--text-primary) outline-none transition placeholder:text-slate-400 focus:border-(--brand)',
          className,
        )}
        {...props}
      />
      {error ? <span className="text-xs text-red-400">{error}</span> : null}
    </label>
  )
}

export default Input
