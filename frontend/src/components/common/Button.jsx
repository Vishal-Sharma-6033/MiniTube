import clsx from 'clsx'

const variants = {
  primary: 'bg-(--brand) text-slate-950 hover:bg-[var(--brand-strong)]',
  ghost: 'bg-white/5 text-(--text-primary) hover:bg-white/10',
  danger: 'bg-[var(--danger)]/90 text-white hover:bg-[var(--danger)]',
}

const Button = ({ className, variant = 'primary', type = 'button', ...props }) => {
  return (
    <button
      type={type}
      className={clsx(
        'cursor-pointer rounded-xl px-4 py-2.5 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}

export default Button
