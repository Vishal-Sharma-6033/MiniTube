const Modal = ({ title, open, onClose, children }) => {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
      <div className="glass-panel w-full max-w-lg rounded-2xl p-5 rise-in">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="section-title text-lg">{title}</h3>
          <button onClick={onClose} className="text-sm text-(--text-muted) hover:text-white">
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default Modal
