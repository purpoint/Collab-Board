import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SERVER = process.env.REACT_APP_SERVER_URL || 'http://localhost:8080'

export const HomePage = () => {
  const [username, setUsername]     = useState('')
  const [password, setPassword]     = useState('')
  const [boardName, setBoardName]   = useState('')
  const [boardId, setBoardId]       = useState('')
  const [isRegister, setIsRegister] = useState(true)
  const [mode, setMode]             = useState('create')
  const [error, setError]           = useState('')
  const [loading, setLoading]       = useState(false)
  const [focused, setFocused]       = useState(null)
  const navigate = useNavigate()

  const handleAuth = async () => {
    const endpoint = isRegister ? 'register' : 'login'
    const res  = await fetch(`${SERVER}/api/auth/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); return null }
    localStorage.setItem('token', data.token)
    localStorage.setItem('username', data.user.username)
    return data.token
  }

  const handleCreate = async () => {
    setError('')
    if (!boardName.trim()) return setError('Board name is required')
    setLoading(true)
    try {
      const token = await handleAuth()
      if (!token) return
      const res  = await fetch(`${SERVER}/api/boards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: boardName.trim() })
      })
      const data = await res.json()
      if (!res.ok) return setError(data.error)
      navigate(`/board/${data.board.boardId}`)
    } catch { setError('Cannot reach server.') }
    finally  { setLoading(false) }
  }

  const handleJoin = async () => {
    setError('')
    const trimmed = boardId.trim()
    if (!trimmed) return setError('Board ID is required')
    setLoading(true)
    try {
      const token = await handleAuth()
      if (!token) return
      const res = await fetch(`${SERVER}/api/boards/${trimmed}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (!res.ok) return setError(data.error || 'Board not found')
      navigate(`/board/${trimmed}`)
    } catch { setError('Cannot reach server.') }
    finally  { setLoading(false) }
  }

  const inp = (name) => ({
    width: '100%', padding: '12px 14px',
    background: '#030810',
    border: `1px solid ${focused === name ? 'var(--cyan)' : 'var(--border-2)'}`,
    borderRadius: '8px', color: 'var(--text-1)',
    fontSize: '13px', fontFamily: 'JetBrains Mono, monospace',
    outline: 'none', transition: 'all 0.2s',
    boxShadow: focused === name ? '0 0 0 3px rgba(0,200,255,0.08)' : 'none',
    caretColor: 'var(--cyan)',
  })

  const seg = (active, col = 'var(--cyan)') => ({
    flex: 1, padding: '8px 0', borderRadius: '6px', border: 'none',
    background: active ? `rgba(0,200,255,0.08)` : 'transparent',
    outline: active ? `1px solid rgba(0,200,255,0.3)` : '1px solid transparent',
    color: active ? col : 'var(--text-3)',
    fontSize: '10px', fontFamily: 'JetBrains Mono, monospace',
    fontWeight: '500', letterSpacing: '1px', textTransform: 'uppercase',
    cursor: 'pointer', transition: 'all 0.2s',
  })

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--void)', position: 'relative', overflow: 'hidden',
    }}>
      {/* grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(14,31,48,0.4) 1px, transparent 1px),
          linear-gradient(90deg, rgba(14,31,48,0.4) 1px, transparent 1px)
        `,
        backgroundSize: '44px 44px',
      }} />

      {/* scan lines */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 3px)',
      }} />

      {/* glow */}
      <div style={{
        position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)',
        width: '800px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(0,200,255,0.04) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      {/* card */}
      <div className="fade-up" style={{
        position: 'relative', zIndex: 10, width: '380px',
        background: 'linear-gradient(160deg, var(--elevated) 0%, var(--deep) 100%)',
        border: '1px solid var(--border-2)',
        borderRadius: '16px', padding: '32px',
        boxShadow: '0 0 0 1px rgba(0,200,255,0.03), 0 32px 80px rgba(0,0,0,0.8), var(--shadow-cyan)',
      }}>

        {/* top glow line */}
        <div style={{
          position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
          background: 'linear-gradient(90deg, transparent, var(--cyan), transparent)',
        }} />

        {/* logo */}
        <div className="fade-up-1" style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '44px', height: '44px', borderRadius: '12px', marginBottom: '12px',
            background: 'linear-gradient(135deg, rgba(0,200,255,0.15), rgba(136,85,255,0.15))',
            border: '1px solid rgba(0,200,255,0.3)',
            boxShadow: '0 0 20px rgba(0,200,255,0.15)', fontSize: '20px',
          }}>⬡</div>
          <div style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '24px', fontWeight: '700',
            letterSpacing: '-0.5px', marginBottom: '4px',
            background: 'linear-gradient(135deg, #ffffff, #6888aa)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>CollabBoard</div>
          <div style={{ fontSize: '9px', letterSpacing: '3px', color: 'var(--text-3)' }}>
            REAL-TIME · MULTI-USER · CANVAS
          </div>
        </div>

        {/* auth tabs */}
        <div className="fade-up-2" style={{
          display: 'flex', gap: '3px', padding: '3px',
          background: 'var(--void)', borderRadius: '8px',
          border: '1px solid var(--border-1)', marginBottom: '16px',
        }}>
          <button style={seg(isRegister)}  onClick={() => { setIsRegister(true);  setError('') }}>Register</button>
          <button style={seg(!isRegister)} onClick={() => { setIsRegister(false); setError('') }}>Login</button>
        </div>

        {/* error */}
        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255,51,85,0.06)', border: '1px solid rgba(255,51,85,0.2)',
            borderRadius: '7px', padding: '9px 12px', marginBottom: '12px',
            color: 'var(--red)', fontSize: '11px',
          }}>⚠ {error}</div>
        )}

        {/* inputs */}
        <div className="fade-up-3" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          <input style={inp('username')} placeholder="username" value={username} type="text" autoComplete="off"
            onChange={e => setUsername(e.target.value)}
            onFocus={() => setFocused('username')} onBlur={() => setFocused(null)}
          />
          <input style={inp('password')} placeholder="password" value={password} type="password"
            onChange={e => setPassword(e.target.value)}
            onFocus={() => setFocused('password')} onBlur={() => setFocused(null)}
          />
        </div>

        {/* divider */}
        <div className="fade-up-4" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-1)' }} />
          <span style={{ fontSize: '8px', color: 'var(--text-3)', letterSpacing: '2px' }}>BOARD</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-1)' }} />
        </div>

        {/* board mode */}
        <div className="fade-up-4" style={{
          display: 'flex', gap: '3px', padding: '3px',
          background: 'var(--void)', borderRadius: '8px',
          border: '1px solid var(--border-1)', marginBottom: '10px',
        }}>
          <button style={seg(mode === 'create', 'var(--green)')} onClick={() => { setMode('create'); setError('') }}>+ Create</button>
          <button style={seg(mode === 'join',   'var(--green)')} onClick={() => { setMode('join');   setError('') }}>→ Join</button>
        </div>

        {/* board input */}
        <div className="fade-up-5" style={{ marginBottom: '16px' }}>
          <input
            style={inp('board')}
            placeholder={mode === 'create' ? 'board name...' : 'paste board id...'}
            value={mode === 'create' ? boardName : boardId}
            onChange={e => mode === 'create' ? setBoardName(e.target.value) : setBoardId(e.target.value)}
            onFocus={() => setFocused('board')} onBlur={() => setFocused(null)}
            onKeyDown={e => e.key === 'Enter' && (mode === 'create' ? handleCreate() : handleJoin())}
          />
          {mode === 'join' && (
            <p style={{ fontSize: '9px', color: 'var(--text-3)', marginTop: '5px', paddingLeft: '2px' }}>
              copy the board id from the url after /board/
            </p>
          )}
        </div>

        {/* CTA */}
        <div className="fade-up-6">
          <button
            onClick={mode === 'create' ? handleCreate : handleJoin}
            disabled={loading}
            style={{
              width: '100%', padding: '13px',
              background: loading ? 'var(--elevated)' : 'linear-gradient(135deg, #0088cc, #00c8ff, #8855ff)',
              border: loading ? '1px solid var(--border-1)' : 'none',
              borderRadius: '10px',
              color: loading ? 'var(--text-3)' : '#fff',
              fontSize: '11px', fontFamily: 'JetBrains Mono, monospace',
              fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.25s',
              boxShadow: loading ? 'none' : '0 4px 24px rgba(0,200,255,0.3)',
            }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,200,255,0.4)' }}}
            onMouseLeave={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,200,255,0.3)' }}}
          >
            {loading ? '⟳  connecting...' : mode === 'create' ? '⬡  Create & Enter' : '→  Enter Board'}
          </button>
        </div>

      </div>
    </div>
  )
}