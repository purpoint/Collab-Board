import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const FloatingOrb = ({ style }) => (
    <div style={{
        position: 'absolute', borderRadius: '50%',
        filter: 'blur(80px)', pointerEvents: 'none',
        ...style
    }} />
)

export const HomePage = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [boardName, setBoardName] = useState('')
    const [boardId, setBoardId] = useState('')
    const [isRegister, setIsRegister] = useState(true)
    const [mode, setMode] = useState('create')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [focusedInput, setFocusedInput] = useState(null)
    const navigate = useNavigate()

    const handleAuth = async () => {
        const endpoint = isRegister ? 'register' : 'login'
        const res = await fetch(`http://localhost:8080/api/auth/${endpoint}`, {
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
        setError(''); setLoading(true)
        try {
            const token = await handleAuth()
            if (!token) return
            const res = await fetch('http://localhost:8080/api/boards', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ name: boardName })
            })
            const data = await res.json()
            if (!res.ok) return setError(data.error)
            navigate(`/board/${data.board.boardId}`)
        } catch { setError('Cannot reach server. Make sure backend is running.') }
        finally { setLoading(false) }
    }

    const handleJoin = async () => {
        setError(''); setLoading(true)
        try {
            const token = await handleAuth()
            if (!token) return
            const res = await fetch(`http://localhost:8080/api/boards/${boardId}/join`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
            })
            const data = await res.json()
            if (!res.ok) return setError(data.error)
            navigate(`/board/${boardId}`)
        } catch { setError('Cannot reach server. Make sure backend is running.') }
        finally { setLoading(false) }
    }

    const inputStyle = (name) => ({
        width: '100%',
        padding: '12px 16px',
        background: 'rgba(8,15,30,0.9)',
        border: `1px solid ${focusedInput === name ? 'rgba(6,182,212,0.6)' : 'var(--border-mid)'}`,
        borderRadius: '10px',
        color: 'var(--text-bright)',
        fontSize: '14px',
        fontFamily: 'Instrument Sans, sans-serif',
        outline: 'none',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        boxShadow: focusedInput === name ? '0 0 0 3px rgba(6,182,212,0.08)' : 'none',
        caretColor: '#06b6d4',
    })

    const segmentStyle = (active, color = '#06b6d4') => ({
        flex: 1, padding: '9px 0',
        borderRadius: '8px',
        border: active ? `1px solid ${color}44` : '1px solid transparent',
        background: active ? `${color}12` : 'transparent',
        color: active ? color : 'var(--text-dim)',
        fontSize: '12px',
        fontFamily: 'JetBrains Mono, monospace',
        fontWeight: '500',
        letterSpacing: '0.8px',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    })

    return (
        <div style={{
            minHeight: '100vh', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            background: 'var(--bg-void)', position: 'relative', overflow: 'hidden',
        }}>
            {/* background orbs */}
            <FloatingOrb style={{ width: 500, height: 500, top: '-10%', left: '-10%', background: 'rgba(124,58,237,0.06)' }} />
            <FloatingOrb style={{ width: 600, height: 400, bottom: '-15%', right: '-10%', background: 'rgba(6,182,212,0.05)' }} />
            <FloatingOrb style={{ width: 300, height: 300, top: '40%', left: '60%', background: 'rgba(124,58,237,0.04)' }} />

            {/* grid */}
            <div style={{
                position: 'absolute', inset: 0, opacity: 0.4,
                backgroundImage: `
          linear-gradient(var(--border-dim) 1px, transparent 1px),
          linear-gradient(90deg, var(--border-dim) 1px, transparent 1px)
        `,
                backgroundSize: '44px 44px',
            }} />

            {/* card */}
            <div className="animate-fade-up" style={{
                position: 'relative', zIndex: 10,
                width: '420px',
                background: 'var(--bg-glass)',
                border: '1px solid var(--border-mid)',
                borderRadius: '24px',
                padding: '40px',
                backdropFilter: 'blur(24px)',
                boxShadow: 'var(--shadow-glow), inset 0 1px 0 rgba(255,255,255,0.04)',
                animation: 'borderGlow 4s ease infinite',
            }}>

                {/* top shimmer line */}
                <div style={{
                    position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.8), rgba(6,182,212,0.8), transparent)',
                    borderRadius: '1px',
                }} />

                {/* logo block */}
                <div className="animate-fade-up-1" style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: '52px', height: '52px', borderRadius: '16px', marginBottom: '16px',
                        background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.2))',
                        border: '1px solid rgba(124,58,237,0.4)',
                        boxShadow: '0 0 24px rgba(124,58,237,0.2)',
                        fontSize: '24px',
                    }}>⬡</div>
                    <div style={{
                        fontFamily: 'Cabinet Grotesk, sans-serif',
                        fontSize: '28px', fontWeight: '900',
                        letterSpacing: '-1px', marginBottom: '6px',
                        background: 'linear-gradient(135deg, #f0f6ff 0%, #7a9cc0 100%)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>CollabBoard</div>
                    <div style={{
                        fontSize: '10px', letterSpacing: '3px',
                        color: 'var(--text-dim)',
                        fontFamily: 'JetBrains Mono, monospace',
                    }}>REAL-TIME · MULTI-USER · CANVAS</div>
                </div>

                {/* auth segment */}
                <div className="animate-fade-up-2" style={{
                    display: 'flex', gap: '4px', padding: '4px',
                    background: 'rgba(3,5,10,0.8)', borderRadius: '12px',
                    border: '1px solid var(--border-dim)', marginBottom: '20px',
                }}>
                    <button style={segmentStyle(isRegister)} onClick={() => setIsRegister(true)}>Register</button>
                    <button style={segmentStyle(!isRegister)} onClick={() => setIsRegister(false)}>Login</button>
                </div>

                {/* error */}
                {error && (
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                        borderRadius: '10px', padding: '10px 14px', marginBottom: '16px',
                        color: '#fca5a5', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace',
                    }}>
                        <span>⚠</span> {error}
                    </div>
                )}

                {/* credentials */}
                <div className="animate-fade-up-3" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                    <input
                        style={inputStyle('username')} placeholder="username"
                        value={username} type="text" autoComplete="off"
                        onChange={e => setUsername(e.target.value)}
                        onFocus={() => setFocusedInput('username')}
                        onBlur={() => setFocusedInput(null)}
                    />
                    <input
                        style={inputStyle('password')} placeholder="password"
                        value={password} type="password"
                        onChange={e => setPassword(e.target.value)}
                        onFocus={() => setFocusedInput('password')}
                        onBlur={() => setFocusedInput(null)}
                    />
                </div>

                {/* divider */}
                <div className="animate-fade-up-4" style={{
                    display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px',
                }}>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border-dim)' }} />
                    <span style={{ fontSize: '10px', color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '2px' }}>BOARD</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border-dim)' }} />
                </div>

                {/* board mode segment */}
                <div className="animate-fade-up-4" style={{
                    display: 'flex', gap: '4px', padding: '4px',
                    background: 'rgba(3,5,10,0.8)', borderRadius: '12px',
                    border: '1px solid var(--border-dim)', marginBottom: '14px',
                }}>
                    <button style={segmentStyle(mode === 'create', '#10b981')} onClick={() => setMode('create')}>+ Create</button>
                    <button style={segmentStyle(mode === 'join', '#10b981')} onClick={() => setMode('join')}>→ Join</button>
                </div>

                {/* board input */}
                <div className="animate-fade-up-5" style={{ marginBottom: '24px' }}>
                    <input
                        style={inputStyle('board')}
                        placeholder={mode === 'create' ? 'board name...' : 'paste board id...'}
                        value={mode === 'create' ? boardName : boardId}
                        onChange={e => mode === 'create' ? setBoardName(e.target.value) : setBoardId(e.target.value)}
                        onFocus={() => setFocusedInput('board')}
                        onBlur={() => setFocusedInput(null)}
                    />
                </div>

                {/* CTA button */}
                <div className="animate-fade-up-6">
                    <button
                        onClick={mode === 'create' ? handleCreate : handleJoin}
                        disabled={loading}
                        style={{
                            width: '100%', padding: '14px',
                            background: loading ? 'var(--bg-elevated)' : 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                            backgroundSize: '200% 200%',
                            border: 'none', borderRadius: '12px',
                            color: loading ? 'var(--text-dim)' : '#fff',
                            fontSize: '13px',
                            fontFamily: 'JetBrains Mono, monospace',
                            fontWeight: '500', letterSpacing: '1.5px',
                            textTransform: 'uppercase',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: loading ? 'none' : '0 4px 24px rgba(124,58,237,0.35), 0 0 48px rgba(6,182,212,0.1)',
                        }}
                        onMouseEnter={e => { if (!loading) e.currentTarget.style.boxShadow = '0 4px 32px rgba(124,58,237,0.5), 0 0 60px rgba(6,182,212,0.2)' }}
                        onMouseLeave={e => { if (!loading) e.currentTarget.style.boxShadow = '0 4px 24px rgba(124,58,237,0.35), 0 0 48px rgba(6,182,212,0.1)' }}
                    >
                        {loading ? '⟳ connecting...' : mode === 'create' ? '⬡ Create & Enter Board' : '→ Enter Board'}
                    </button>
                </div>

            </div>
        </div>
    )
}