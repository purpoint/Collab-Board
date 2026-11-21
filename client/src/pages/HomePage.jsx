import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const SERVER = process.env.REACT_APP_SERVER_URL || 'http://localhost:8080'

// Free Render backends sleep after 15 min idle and take 30-60s to wake.
// This retries requests while the server is waking instead of failing.
const fetchWithRetry = async (url, options = {}, onWaiting) => {
  const deadline = Date.now() + 90000 // give up after 90 seconds
  while (true) {
    try {
      const res = await fetch(url, options)
      // 502/503 = Render is still waking the server up
      if (res.status !== 502 && res.status !== 503) return res
    } catch {
      // network error = server not reachable yet, keep waiting
    }
    if (Date.now() > deadline) throw new Error('timeout')
    if (onWaiting) onWaiting()
    await new Promise(r => setTimeout(r, 4000))
  }
}

export const HomePage = () => {
  const [username, setUsername]     = useState('')
  const [password, setPassword]     = useState('')
  const [boardName, setBoardName]   = useState('')
  const [boardId, setBoardId]       = useState('')
  const [isRegister, setIsRegister] = useState(true)
  const [mode, setMode]             = useState('create')
  const [error, setError]           = useState('')
  const [loading, setLoading]       = useState(false)
  const [waking, setWaking]         = useState(false)
  const [focused, setFocused]       = useState(null)
  const [serverStatus, setServerStatus] = useState('checking') // checking | waking | ready
  const navigate = useNavigate()

  // Wake the backend the moment the page opens, so it is ready by the time
  // the visitor has typed their username and password.
  useEffect(() => {
    let cancelled = false
    const slowTimer = setTimeout(() => { if (!cancelled) setServerStatus('waking') }, 1500)
    fetchWithRetry(`${SERVER}/health`)
      .then(() => { if (!cancelled) setServerStatus('ready') })
      .catch(() => {})
      .finally(() => clearTimeout(slowTimer))
    return () => { cancelled = true; clearTimeout(slowTimer) }
  }, [])

  const post = (path, body, token) =>
    fetchWithRetry(`${SERVER}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    }, () => setWaking(true))

  const handleAuth = async () => {
    const endpoint = isRegister ? 'register' : 'login'
    const res  = await post(`/api/auth/${endpoint}`, { username, password })
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
      const res  = await post('/api/boards', { name: boardName.trim() }, token)
      const data = await res.json()
      if (!res.ok) return setError(data.error)
      navigate(`/board/${data.board.boardId}`)
    } catch { setError('Server is taking too long to wake up. Please try again in a minute.') }
    finally  { setLoading(false); setWaking(false) }
  }

  const handleJoin = async () => {
    setError('')
    const trimmed = boardId.trim()
    if (!trimmed) return setError('Board ID is required')
    setLoading(true)
    try {
      const token = await handleAuth()
      if (!token) return
      const res  = await post(`/api/boards/${trimmed}/join`, null, token)
      const data = await res.json()
      if (!res.ok) return setError(data.error || 'Board not found')
      navigate(`/board/${trimmed}`)
    } catch { setError('Server is taking too long to wake up. Please try again in a minute.') }
    finally  { setLoading(false); setWaking(false) }
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
    background: active ? 'rgba(0,200,255,0.08)' : 'transparent',
    outline: active ? '1px solid rgba(0,200,255,0.3)' : '1px solid transparent',
    color: active ? col : 'var(--text-3)',
    fontSize: '10px', fontFamily: 'JetBrains Mono, monospace',
    fontWeight: '500', letterSpacing: '1px', textTransform: 'uppercase',
    cursor: 'pointer', transition: 'all 0.2s',
  })

  const statusText = {
    checking: '',
    waking:   'waking up server... (free hosting, up to a minute)',
    ready:    'server ready',
  }[serverStatus]

  const buttonText = waking
    ? 'waking server...'
    : loading
      ? 'connecting...'
      : mode === 'create' ? 'Create & Enter' : 'Enter Board'

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--void)', position: 'relative', overflow: 'hidden',
      padding: '16px',
    }}>
      {/* grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(14,31,48,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(14,31,48,0.4) 1px, transparent 1px)',
        backgroundSize: '44px 44px',
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
        position: 'relative', zIndex: 10, width: '100%', maxWidth: '380px',
        background: 'linear-gradient(160deg, var(--elevated) 0%, var(--deep) 100%)',
        border: '1px solid var(--border-2)',
        borderRadius: '16px', padding: '32px',
        boxShadow: '0 32px 80px rgba(0,0,0,0.8), var(--shadow-cyan)',
      }}>

        {/* logo */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '44px', height: '44px', borderRadius: '12px', marginBottom: '12px',
            background: 'linear-gradient(135deg, rgba(0,200,255,0.15), rgba(136,85,255,0.15))',
            border: '1px solid rgba(0,200,255,0.3)', fontSize: '20px',
          }}>⬡</div>
          <div style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '24px', fontWeight: '700', marginBottom: '4px',
            background: 'linear-gradient(135deg, #ffffff, #6888aa)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>CollabBoard</div>
          <div style={{ fontSize: '9px', letterSpacing: '3px', color: 'var(--text-3)' }}>
            REAL-TIME · MULTI-USER · CANVAS
          </div>

          {/* server status */}
          {statusText && (
            <div style={{
              marginTop: '12px', fontSize: '9px',
              color: serverStatus === 'ready' ? 'var(--green)' : 'var(--amber)',
            }}>
              ● {statusText}
            </div>
          )}
        </div>

        {/* auth tabs */}
        <div style={{
          display: 'flex', gap: '3px', padding: '3px',
          background: 'var(--void)', borderRadius: '8px',
          border: '1px solid var(--border-1)', marginBottom: '16px',
        }}>
          <button style={seg(isRegister)} onClick={() => { setIsRegister(true); setError('') }}>Register</button>
          <button style={seg(!isRegister)} onClick={() => { setIsRegister(false); setError('') }}>Login</button>
        </div>

        {/* error */}
        {error && (
          <div style={{
            background: 'rgba(255,51,85,0.06)', border: '1px solid rgba(255,51,85,0.2)',
            borderRadius: '7px', padding: '9px 12px', marginBottom: '12px',
            color: 'var(--red)', fontSize: '11px',
          }}>⚠ {error}</div>
        )}

        {/* inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          <input
            style={inp('username')} placeholder="username" value={username} type="text" autoComplete="off"
            onChange={e => setUsername(e.target.value)}
            onFocus={() => setFocused('username')} onBlur={() => setFocused(null)}
          />
          <input
            style={inp('password')} placeholder="password" value={password} type="password"
            onChange={e => setPassword(e.target.value)}
            onFocus={() => setFocused('password')} onBlur={() => setFocused(null)}
          />
        </div>

        {/* board mode */}
        <div style={{
          display: 'flex', gap: '3px', padding: '3px',
          background: 'var(--void)', borderRadius: '8px',
          border: '1px solid var(--border-1)', marginBottom: '10px',
        }}>
          <button style={seg(mode === 'create', 'var(--green)')} onClick={() => { setMode('create'); setError('') }}>+ Create</button>
          <button style={seg(mode === 'join', 'var(--green)')} onClick={() => { setMode('join'); setError('') }}>→ Join</button>
        </div>

        {/* board input */}
        <div style={{ marginBottom: '16px' }}>
          <input
            style={inp('board')}
            placeholder={mode === 'create' ? 'board name...' : 'paste board id...'}
            value={mode === 'create' ? boardName : boardId}
            onChange={e => (mode === 'create' ? setBoardName(e.target.value) : setBoardId(e.target.value))}
            onFocus={() => setFocused('board')} onBlur={() => setFocused(null)}
            onKeyDown={e => { if (e.key === 'Enter') { if (mode === 'create') handleCreate(); else handleJoin() } }}
          />
          {mode === 'join' && (
            <p style={{ fontSize: '9px', color: 'var(--text-3)', marginTop: '5px' }}>
              copy the board id from the url after /board/
            </p>
          )}
        </div>

        {/* main button */}
        <button
          onClick={mode === 'create' ? handleCreate : handleJoin}
          disabled={loading}
          style={{
            width: '100%', padding: '13px',
            background: loading ? 'var(--elevated)' : 'linear-gradient(135deg, #0088cc, #00c8ff, #8855ff)',
            border: 'none', borderRadius: '10px',
            color: loading ? 'var(--text-3)' : '#fff',
            fontSize: '11px', fontFamily: 'JetBrains Mono, monospace',
            fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {buttonText}
        </button>

      </div>
    </div>
  )
}

