import { useEffect, useState } from 'react'

const toastListeners = []
let toastId = 0

export const showToast = (message, type = 'info') => {
  const id = ++toastId
  toastListeners.forEach(fn => fn({ id, message, type }))
}

export const ToastContainer = () => {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const handler = (toast) => {
      setToasts(prev => [...prev, toast])
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toast.id))
      }, 3000)
    }
    toastListeners.push(handler)
    return () => {
      const idx = toastListeners.indexOf(handler)
      if (idx > -1) toastListeners.splice(idx, 1)
    }
  }, [])

  const colors = {
    info:    { bg: 'rgba(0,200,255,0.08)', border: 'rgba(0,200,255,0.25)', color: '#00c8ff', icon: 'ℹ' },
    success: { bg: 'rgba(0,255,136,0.08)', border: 'rgba(0,255,136,0.25)', color: '#00ff88', icon: '✓' },
    warning: { bg: 'rgba(255,170,0,0.08)', border: 'rgba(255,170,0,0.25)', color: '#ffaa00', icon: '⚠' },
    error:   { bg: 'rgba(255,51,85,0.08)',  border: 'rgba(255,51,85,0.25)',  color: '#ff3355', icon: '✕' },
  }

  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px',
      display: 'flex', flexDirection: 'column', gap: '8px',
      zIndex: 9999, pointerEvents: 'none',
    }}>
      {toasts.map(toast => {
        const c = colors[toast.type] || colors.info
        return (
          <div key={toast.id} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 16px',
            background: c.bg, border: `1px solid ${c.border}`,
            borderRadius: '8px', color: c.color,
            fontSize: '11px', fontFamily: 'JetBrains Mono, monospace',
            backdropFilter: 'blur(12px)',
            boxShadow: `0 4px 24px rgba(0,0,0,0.4)`,
            animation: 'slideIn 0.3s ease forwards',
            whiteSpace: 'nowrap',
          }}>
            <span>{c.icon}</span>
            <span style={{ color: 'var(--text-1)' }}>{toast.message}</span>
          </div>
        )
      })}
    </div>
  )
}