const ErrorState = ({ message, action }) => {
  return (
    <div className="glass-panel rounded-2xl border border-red-400/25 p-4 text-red-200">
      <p className="text-sm">{message}</p>
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  )
}

export default ErrorState
