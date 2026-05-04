import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CanvasBoard } from '../components/Canvas/CanvasBoard.jsx'
import { Toolbar } from '../components/Toolbar/Toolbar.jsx'
import { CursorOverlay } from '../components/Cursors/CursorOverlay.jsx'
import { useSocket } from '../hooks/useSocket.js'
import { useBoard } from '../hooks/useBoard.js'
import { useShapes } from '../hooks/useShapes.js'

export const BoardPage = () => {
    const { boardId } = useParams()
    const navigate = useNavigate()
    const [tool, setTool] = useState('rect')
    const [color, setColor] = useState('#06b6d4')
    const [copied, setCopied] = useState(false)

    const { connected } = useSocket()
    useBoard(boardId)
    const { emitDrawShape } = useShapes(boardId)

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const shortId = boardId?.split('-').slice(-1)[0]

    return (
        <div style={{
            display: 'flex', flexDirection: 'column',
            height: '100vh', background: 'var(--bg-void)',
            overflow: 'hidden',
        }}>

            {/* ── top bar ── */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 20px', height: '52px', flexShrink: 0,
                background: 'var(--bg-panel)',
                borderBottom: '1px solid var(--border-dim)',
                backdropFilter: 'blur(12px)',
                zIndex: 20,
            }}>
                {/* left — logo + board id */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <button onClick={() => navigate('/')} style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                    }}>
                        <div style={{
                            width: '28px', height: '28px', borderRadius: '8px',
                            background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(6,182,212,0.3))',
                            border: '1px solid rgba(124,58,237,0.4)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '14px',
                        }}>⬡</div>
                        <span style={{
                            fontFamily: 'Cabinet Grotesk, sans-serif',
                            fontSize: '16px', fontWeight: '800',
                            color: 'var(--text-bright)', letterSpacing: '-0.3px',
                        }}>CollabBoard</span>
                    </button>

                    <div style={{ width: '1px', height: '18px', background: 'var(--border-dim)' }} />

                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '4px 10px', borderRadius: '6px',
                        background: 'rgba(6,182,212,0.05)',
                        border: '1px solid rgba(6,182,212,0.15)',
                    }}>
                        <span style={{ fontSize: '10px', color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}>board</span>
                        <span style={{ fontSize: '11px', color: '#06b6d4', fontFamily: 'JetBrains Mono, monospace', fontWeight: '500' }}>#{shortId}</span>
                    </div>
                </div>

                {/* right — status + copy */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button onClick={copyLink} style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '6px 12px', borderRadius: '8px',
                        background: copied ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.03)',
                        border: copied ? '1px solid rgba(16,185,129,0.3)' : '1px solid var(--border-dim)',
                        color: copied ? '#10b981' : 'var(--text-mid)',
                        fontSize: '11px', fontFamily: 'JetBrains Mono, monospace',
                        cursor: 'pointer', transition: 'all 0.2s ease',
                    }}>
                        {copied ? '✓ copied' : '⎘ share link'}
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <div className="live-dot" style={{ background: connected ? '#10b981' : '#ef4444' }} />
                        <span style={{
                            fontSize: '11px', fontFamily: 'JetBrains Mono, monospace',
                            color: connected ? '#10b981' : '#ef4444',
                            letterSpacing: '0.5px',
                        }}>
                            {connected ? 'live' : 'offline'}
                        </span>
                    </div>
                </div>
            </div>

            {/* ── toolbar ── */}
            <Toolbar tool={tool} setTool={setTool} color={color} setColor={setColor} />

            {/* ── canvas ── */}
            <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
                <CanvasBoard
                    tool={tool} color={color}
                    boardId={boardId}
                    onShapeComplete={emitDrawShape}
                />
                <CursorOverlay />
            </div>

        </div>
    )
}