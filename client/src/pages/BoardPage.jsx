import { useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CanvasBoard } from '../components/Canvas/CanvasBoard.jsx'
import { Toolbar } from '../components/Toolbar/Toolbar.jsx'
import { CursorOverlay } from '../components/Cursors/CursorOverlay.jsx'
import { ToastContainer, showToast } from '../components/UI/Toast.jsx'
import { useSocket } from '../hooks/useSocket.js'
import { useBoard } from '../hooks/useBoard.js'
import { useShapes } from '../hooks/useShapes.js'
import { useHistory } from '../hooks/useHistory.js'

export const BoardPage = () => {
  const { boardId } = useParams()
  const navigate    = useNavigate()

  const [tool, setTool]               = useState('rect')
  const [color, setColor]             = useState('#00c8ff')
  const [fillColor, setFillColor]     = useState('transparent')
  const [strokeWidth, setStrokeWidth] = useState(2)
  const [opacity, setOpacity]         = useState(1)
  const [zoom, setZoom]               = useState(1)
  const [copied, setCopied]           = useState(false)

  const { connected }                                      = useSocket()
  const { loading, boardName }                             = useBoard(boardId)
  const { emitDrawShape, emitDeleteShape, emitClearBoard } = useShapes(boardId)
  const { saveSnapshot }                                   = useHistory(boardId)

  const cursors   = useSelector(state => state.cursors)
  const userCount = Object.keys(cursors).length + 1

  const handleShapeComplete = useCallback((shape) => {
    saveSnapshot()
    emitDrawShape(shape)
  }, [saveSnapshot, emitDrawShape])

  const handleClearBoard = () => {
    if (window.confirm('Clear all shapes? This cannot be undone.')) {
      emitClearBoard()
      showToast('Board cleared', 'warning')
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    showToast('Link copied to clipboard', 'success')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleZoomIn    = () => setZoom(z => Math.min(z * 1.2, 5))
  const handleZoomOut   = () => setZoom(z => Math.max(z * 0.8, 0.2))
  const handleZoomReset = () => setZoom(1)

  const displayName = boardName || boardId?.split('-').slice(0, -1).join('-') || boardId
  const shortId     = boardId?.split('-').slice(-1)[0]

  return (
    <div style={{
      display:'flex', flexDirection:'column',
      height:'100vh', background:'var(--void)', overflow:'hidden',
    }}>

      {/* ── top bar ── */}
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'0 16px', height:'48px', flexShrink:0,
        background:'var(--panel)',
        borderBottom:'1px solid var(--border-1)',
        zIndex:20,
      }}>

        {/* left */}
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <button onClick={() => navigate('/')} style={{
            display:'flex', alignItems:'center', gap:'7px',
            background:'none', border:'none', cursor:'pointer', padding:0,
          }}>
            <div style={{
              width:'26px', height:'26px', borderRadius:'7px',
              background:'linear-gradient(135deg, rgba(0,200,255,0.2), rgba(136,85,255,0.2))',
              border:'1px solid rgba(0,200,255,0.3)',
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:'13px',
              boxShadow:'0 0 10px rgba(0,200,255,0.15)',
            }}>⬡</div>
            <span style={{
              fontFamily:'Space Grotesk, sans-serif',
              fontSize:'14px', fontWeight:'700',
              color:'var(--text-1)', letterSpacing:'-0.3px',
            }}>CollabBoard</span>
          </button>

          <div style={{ width:'1px', height:'14px', background:'var(--border-1)' }} />

          {/* board name */}
          <div style={{
            display:'flex', alignItems:'center', gap:'5px',
            padding:'3px 8px', borderRadius:'5px',
            background:'rgba(0,200,255,0.04)',
            border:'1px solid rgba(0,200,255,0.1)',
          }}>
            <span style={{ fontSize:'9px', color:'var(--text-3)' }}>board</span>
            <span style={{ fontSize:'10px', color:'var(--cyan)', fontWeight:'600' }}>
              {displayName.length > 20 ? `#${shortId}` : displayName}
            </span>
          </div>

          {/* users online */}
          <div style={{
            display:'flex', alignItems:'center', gap:'5px',
            padding:'3px 8px', borderRadius:'5px',
            background:'rgba(0,255,136,0.04)',
            border:'1px solid rgba(0,255,136,0.1)',
          }}>
            {/* colored dots for each cursor */}
            <div style={{ display:'flex', gap:'2px' }}>
              {Object.values(cursors).slice(0, 4).map((c, i) => (
                <div key={i} style={{
                  width:'6px', height:'6px', borderRadius:'50%',
                  background: c.color, boxShadow:`0 0 4px ${c.color}`,
                }} />
              ))}
              <div style={{
                width:'6px', height:'6px', borderRadius:'50%',
                background:'var(--cyan)', boxShadow:'0 0 4px var(--cyan)',
              }} />
            </div>
            <span style={{ fontSize:'10px', color:'var(--green)' }}>
              {userCount} online
            </span>
          </div>
        </div>

        {/* right */}
        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          <button onClick={copyLink} style={{
            display:'flex', alignItems:'center', gap:'5px',
            padding:'5px 10px', borderRadius:'6px',
            background: copied ? 'rgba(0,255,136,0.08)' : 'rgba(255,255,255,0.02)',
            border: copied ? '1px solid rgba(0,255,136,0.25)' : '1px solid var(--border-1)',
            color: copied ? 'var(--green)' : 'var(--text-2)',
            fontSize:'10px', cursor:'pointer', transition:'all 0.2s',
          }}>
            {copied ? '✓ copied' : '⎘ share'}
          </button>

          <div style={{ display:'flex', alignItems:'center', gap:'5px' }}>
            <div style={{
              width:'6px', height:'6px', borderRadius:'50%',
              background: connected ? 'var(--green)' : 'var(--red)',
              boxShadow: connected ? '0 0 6px var(--green)' : '0 0 6px var(--red)',
              animation: connected ? 'pulse 2s infinite' : 'none',
            }} />
            <span style={{ fontSize:'10px', color: connected ? 'var(--green)' : 'var(--red)' }}>
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
        opacity={opacity}         setOpacity={setOpacity}
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomReset={handleZoomReset}
        onClear={handleClearBoard}
      />

      {/* ── canvas ── */}
      <div style={{ position:'relative', flex:1, overflow:'hidden' }}>
        <CanvasBoard
          tool={tool} color={color}
          fillColor={fillColor}
          strokeWidth={strokeWidth}
          opacity={opacity}
          zoom={zoom}
          boardId={boardId}
          onShapeComplete={handleShapeComplete}
          onDeleteShape={emitDeleteShape}
        />
        <CursorOverlay />

        {/* zoom indicator */}
        <div style={{
          position:'absolute', bottom:'16px', left:'16px',
          padding:'4px 10px', borderRadius:'6px',
          background:'rgba(8,15,26,0.8)', border:'1px solid var(--border-1)',
          color:'var(--text-2)', fontSize:'10px',
          backdropFilter:'blur(8px)',
        }}>
          {Math.round(zoom * 100)}%
        </div>

        {/* loading overlay */}
        {loading && (
          <div style={{
            position:'absolute', inset:0,
            background:'rgba(1,4,8,0.9)',
            display:'flex', flexDirection:'column',
            alignItems:'center', justifyContent:'center',
            gap:'14px', zIndex:50, backdropFilter:'blur(8px)',
          }}>
            <div style={{
              width:'36px', height:'36px',
              border:'2px solid var(--border-2)',
              borderTop:'2px solid var(--cyan)',
              borderRadius:'50%',
              animation:'spin 0.8s linear infinite',
              boxShadow:'0 0 16px rgba(0,200,255,0.3)',
            }} />
            <span style={{ fontSize:'10px', color:'var(--text-3)', letterSpacing:'2px' }}>
              LOADING BOARD...
            </span>
          </div>
        )}
      </div>

      {/* toast notifications */}
      <ToastContainer />
    </div>
  )
}