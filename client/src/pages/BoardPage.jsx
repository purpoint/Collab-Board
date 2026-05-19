import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CanvasBoard } from '../components/Canvas/CanvasBoard.jsx'
import { Toolbar } from '../components/Toolbar/Toolbar.jsx'
import { CursorOverlay } from '../components/Cursors/CursorOverlay.jsx'
import { useSocket } from '../hooks/useSocket.js'
import { useBoard } from '../hooks/useBoard.js'
import { useShapes } from '../hooks/useShapes.js'
import { useHistory } from '../hooks/useHistory.js'

export const BoardPage = () => {
  const { boardId }  = useParams()
  const navigate     = useNavigate()
  const [tool, setTool]               = useState('rect')
  const [color, setColor]             = useState('#06b6d4')
  const [fillColor, setFillColor]     = useState('transparent')
  const [strokeWidth, setStrokeWidth] = useState(2)
  const [copied, setCopied]           = useState(false)

  const { connected }                                      = useSocket()
  const { loading }                                        = useBoard(boardId)
  const { emitDrawShape, emitDeleteShape, emitClearBoard } = useShapes(boardId)
  const { saveSnapshot }                                   = useHistory(boardId)

  const cursors   = useSelector(state => state.cursors)
  const userCount = Object.keys(cursors).length + 1

  const handleShapeComplete = (shape) => {
    saveSnapshot()
    emitDrawShape(shape)
  }

  const handleClearBoard = () => {
    if (window.confirm('Clear all shapes? This cannot be undone.')) {
      emitClearBoard()
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shortId = boardId?.split('-').slice(-1)[0]

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100vh', background: '#02040b',
      overflow: 'hidden',
    }}>

      {/* ── top bar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', height: '52px', flexShrink: 0,
        background: 'linear-gradient(180deg, #0a1525 0%, #070e1c 100%)',
        borderBottom: '1px solid #0f1e30',
        zIndex: 20,
      }}>

        {/* left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

          {/* logo */}
          <button onClick={() => navigate('/')} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '8px',
              background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(6,182,212,0.3))',
              border: '1px solid rgba(124,58,237,0.5)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '14px',
              boxShadow: '0 0 12px rgba(124,58,237,0.2)',
            }}>⬡</div>
            <span style={{
              fontFamily: 'Cabinet Grotesk, sans-serif',
              fontSize: '16px', fontWeight: '900',
              color: '#f0f6ff', letterSpacing: '-0.3px',
            }}>CollabBoard</span>
          </button>

          <div style={{ width: '1px', height: '16px', background: '#0f1e30' }} />

          {/* board id */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            padding: '4px 10px', borderRadius: '6px',
            background: 'rgba(6,182,212,0.04)',
            border: '1px solid rgba(6,182,212,0.12)',
          }}>
            <span style={{ fontSize: '9px', color: '#1e3050', fontFamily: 'JetBrains Mono, monospace' }}>board</span>
            <span style={{ fontSize: '11px', color: '#06b6d4', fontFamily: 'JetBrains Mono, monospace', fontWeight: '600' }}>#{shortId}</span>
          </div>

          {/* users online */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            padding: '4px 10px', borderRadius: '6px',
            background: 'rgba(16,185,129,0.04)',
            border: '1px solid rgba(16,185,129,0.12)',
          }}>
            <div style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 6px #10b981',
            }} />
            <span style={{ fontSize: '11px', color: '#10b981', fontFamily: 'JetBrains Mono, monospace' }}>
              {userCount} online
            </span>
          </div>
        </div>

        {/* right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

          {/* share */}
          <button onClick={copyLink} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 14px', borderRadius: '8px',
            background: copied ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.02)',
            border: copied ? '1px solid rgba(16,185,129,0.3)' : '1px solid #0f1e30',
            color: copied ? '#10b981' : '#4a6080',
            fontSize: '11px', fontFamily: 'JetBrains Mono, monospace',
            cursor: 'pointer', transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => { if (!copied) { e.currentTarget.style.borderColor = '#1a2d45'; e.currentTarget.style.color = '#7a9cc0' }}}
          onMouseLeave={e => { if (!copied) { e.currentTarget.style.borderColor = '#0f1e30'; e.currentTarget.style.color = '#4a6080' }}}
          >
            {copied ? '✓ copied' : '⎘ share link'}
          </button>

          {/* live indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: connected ? '#10b981' : '#ef4444',
              boxShadow: connected ? '0 0 6px #10b981' : '0 0 6px #ef4444',
              animation: connected ? 'livePulse 2s ease infinite' : 'none',
            }} />
            <span style={{
              fontSize: '11px', fontFamily: 'JetBrains Mono, monospace',
              color: connected ? '#10b981' : '#ef4444',
            }}>
              {connected ? 'live' : 'offline'}
            </span>
          </div>
        </div>
      </div>

      {/* ── toolbar ── */}
      <Toolbar
        tool={tool}               setTool={setTool}
        color={color}             setColor={setColor}
        fillColor={fillColor}     setFillColor={setFillColor}
        strokeWidth={strokeWidth} setStrokeWidth={setStrokeWidth}
        onClear={handleClearBoard}
      />

      {/* ── canvas area ── */}
      <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
        <CanvasBoard
          tool={tool}
          color={color}
          fillColor={fillColor}
          strokeWidth={strokeWidth}
          boardId={boardId}
          onShapeComplete={handleShapeComplete}
          onDeleteShape={emitDeleteShape}
        />
        <CursorOverlay />

        {/* loading overlay */}
        {loading && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(2,4,11,0.9)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '16px', zIndex: 50,
            backdropFilter: 'blur(8px)',
          }}>
            <div style={{
              width: '40px', height: '40px',
              border: '2px solid #0f1e30',
              borderTop: '2px solid #06b6d4',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              boxShadow: '0 0 16px rgba(6,182,212,0.3)',
            }} />
            <span style={{
              fontSize: '12px', color: '#334560',
              fontFamily: 'JetBrains Mono, monospace',
              letterSpacing: '2px',
            }}>LOADING BOARD...</span>
          </div>
        )}
      </div>

    </div>
  )
}