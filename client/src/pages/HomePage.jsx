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
    width: '100%',
    padding: '13px 16px',
    background: '#060d1a',
    border: `1px solid ${focused === name ? '#06b6d4' : '#1a2d45'}`,
    borderRadius: '10px',
    color: '#f0f6ff',
    fontSize: '14px',
    fontFamily: 'Instrument Sans, sans-serif',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxShadow: focused === name ? '0 0 0 3px rgba(6,182,212,0.1)' : 'none',
    caretColor: '#06b6d4',
  })

  const seg = (active, col = '#06b6d4') => ({
    flex: 1, padding: '9px 0', borderRadius: '8px', border: 'none',
    background: active ? `${col}18` : 'transparent',
    outline: active ? `1px solid ${col}55` : '1px solid transparent',
    color: active ? col : '#334560',
    fontSize: '11px', fontFamily: 'JetBrains Mono, monospace',
    fontWeight: '500', letterSpacing: '1px', textTransform: 'uppercase',
    cursor: 'pointer', transition: 'all 0.2s ease',
  })

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: '#02040b', position: 'relative', overflow: 'hidden',
    }}>
      {/* grid background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(20,35,60,0.5) 1px, transparent 1px),
          linear-gradient(90deg, rgba(20,35,60,0.5) 1px, transparent 1px)
        `,
        backgroundSize: '44px 44px',
      }} />

      {/* glow orbs */}
      <div style={{
        position: 'absolute', top: '-10%', left: '-5%',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-15%', right: '-5%',
        width: '600px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* card */}
      <div style={{
        position: 'relative', zIndex: 10,
        width: '400px',
        background: 'linear-gradient(160deg, #0a1525 0%, #070e1c 100%)',
        border: '1px solid #1a2d45',
        borderRadius: '20px',
        padding: '36px 36px 32px',
        boxShadow: '0 0 0 1px rgba(6,182,212,0.04), 0 32px 80px rgba(0,0,0,0.7)',
      }}>

        {/* top accent line */}
        <div style={{
          position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.9), rgba(6,182,212,0.9), transparent)',
          borderRadius: '1px',
        }} />

        {/* logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '48px', height: '48px', borderRadius: '14px', marginBottom: '14px',
            background: 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(6,182,212,0.25))',
            border: '1px solid rgba(124,58,237,0.5)',
            boxShadow: '0 0 20px rgba(124,58,237,0.2), inset 0 1px 0 rgba(255,255,255,0.05)',
            fontSize: '22px',
          }}>⬡</div>

          <div style={{
            fontFamily: 'Cabinet Grotesk, sans-serif',
            fontSize: '26px', fontWeight: '900',
            letterSpacing: '-0.8px', marginBottom: '5px',
            background: 'linear-gradient(135deg, #ffffff 0%, #7a9cc0 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>CollabBoard</div>

          <div style={{
            fontSize: '10px', letterSpacing: '2.5px',
            color: '#1e3050',
            fontFamily: 'JetBrains Mono, monospace',
          }}>REAL-TIME · MULTI-USER · CANVAS</div>
        </div>

        {/* auth tabs */}
        <div style={{
          display: 'flex', gap: '3px', padding: '3px',
          background: '#030810', borderRadius: '10px',
          border: '1px solid #0f1e30', marginBottom: '18px',
        }}>
          <button style={seg(isRegister)}  onClick={() => { setIsRegister(true);  setError('') }}>Register</button>
          <button style={seg(!isRegister)} onClick={() => { setIsRegister(false); setError('') }}>Login</button>
        </div>

        {/* error */}
        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(239,68,68,0.07)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '8px', padding: '10px 14px', marginBottom: '14px',
            color: '#fca5a5', fontSize: '12px',
            fontFamily: 'JetBrains Mono, monospace',
          }}>
            ⚠ {error}
          </div>
        )}

        {/* credentials */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          <input
            style={inp('username')} placeholder="username"
            value={username} type="text" autoComplete="off"
            onChange={e => setUsername(e.target.value)}
            onFocus={() => setFocused('username')}
            onBlur={() => setFocused(null)}
          />
          <input
            style={inp('password')} placeholder="password"
            value={password} type="password"
            onChange={e => setPassword(e.target.value)}
            onFocus={() => setFocused('password')}
            onBlur={() => setFocused(null)}
          />
        </div>

        {/* divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <div style={{ flex: 1, height: '1px', background: '#0f1e30' }} />
          <span style={{ fontSize: '9px', color: '#1e3050', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '2px' }}>BOARD</span>
          <div style={{ flex: 1, height: '1px', background: '#0f1e30' }} />
        </div>

        {/* board mode tabs */}
        <div style={{
          display: 'flex', gap: '3px', padding: '3px',
          background: '#030810', borderRadius: '10px',
          border: '1px solid #0f1e30', marginBottom: '12px',
        }}>
          <button style={seg(mode === 'create', '#10b981')} onClick={() => { setMode('create'); setError('') }}>+ Create</button>
          <button style={seg(mode === 'join',   '#10b981')} onClick={() => { setMode('join');   setError('') }}>→ Join</button>
        </div>

        {/* board input */}
        <div style={{ marginBottom: '20px' }}>
          <input
            style={inp('board')}
            placeholder={mode === 'create' ? 'board name...' : 'paste board id...'}
            value={mode === 'create' ? boardName : boardId}
            onChange={e => mode === 'create' ? setBoardName(e.target.value) : setBoardId(e.target.value)}
            onFocus={() => setFocused('board')}
            onBlur={() => setFocused(null)}
            onKeyDown={e => e.key === 'Enter' && (mode === 'create' ? handleCreate() : handleJoin())}
          />
          {mode === 'join' && (
            <p style={{
              fontSize: '10px', color: '#1e3050',
              fontFamily: 'JetBrains Mono, monospace',
              marginTop: '6px', paddingLeft: '2px'
            }}>
              find the id in the board url after /board/
            </p>
          )}
        </div>

        {/* CTA button */}
        <button
          onClick={mode === 'create' ? handleCreate : handleJoin}
          disabled={loading}
          style={{
            width: '100%', padding: '14px',
            background: loading
              ? '#0a1525'
              : 'linear-gradient(135deg, #7c3aed 0%, #2563eb 50%, #06b6d4 100%)',
            border: loading ? '1px solid #1a2d45' : 'none',
            borderRadius: '12px',
            color: loading ? '#334560' : '#ffffff',
            fontSize: '12px',
            fontFamily: 'JetBrains Mono, monospace',
            fontWeight: '600', letterSpacing: '2px',
            textTransform: 'uppercase',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.25s ease',
            boxShadow: loading ? 'none' : '0 4px 24px rgba(124,58,237,0.4), 0 0 60px rgba(6,182,212,0.1)',
          }}
          onMouseEnter={e => {
            if (!loading) {
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(124,58,237,0.5), 0 0 80px rgba(6,182,212,0.15)'
            }
          }}
          onMouseLeave={e => {
            if (!loading) {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 24px rgba(124,58,237,0.4), 0 0 60px rgba(6,182,212,0.1)'
            }
          }}
        >
          {loading ? '⟳  connecting...' : mode === 'create' ? '⬡  Create & Enter Board' : '→  Enter Board'}
        </button>

      </div>
    </div>
  )
}