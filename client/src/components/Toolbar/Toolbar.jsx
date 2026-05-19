export const Toolbar = ({
  tool, setTool, color, setColor,
  fillColor, setFillColor,
  strokeWidth, setStrokeWidth,
  opacity, setOpacity,
  zoom, onZoomIn, onZoomOut, onZoomReset,
  onClear
}) => {
  const tools = [
    { id: 'rect',   icon: '▭', label: 'Rect' },
    { id: 'circle', icon: '○', label: 'Circle' },
    { id: 'line',   icon: '╱', label: 'Line' },
    { id: 'pencil', icon: '✏', label: 'Pencil' },
  ]

  const widths = [
    { label: 'S', value: 1 },
    { label: 'M', value: 3 },
    { label: 'L', value: 6 },
  ]

  const sep = () => (
    <div style={{ width:'1px', height:'18px', background:'var(--border-1)', margin:'0 6px', flexShrink:0 }} />
  )

  const label = (text) => (
    <span style={{ fontSize:'9px', color:'var(--text-3)', letterSpacing:'1px', textTransform:'uppercase', flexShrink:0 }}>{text}</span>
  )

  const toolBtn = (t) => {
    const active = tool === t.id
    return (
      <button key={t.id} onClick={() => setTool(t.id)}
        style={{
          display:'flex', alignItems:'center', gap:'5px',
          padding:'5px 10px', borderRadius:'6px', border:'none',
          background: active ? 'rgba(0,200,255,0.1)' : 'transparent',
          outline: active ? '1px solid rgba(0,200,255,0.4)' : '1px solid transparent',
          color: active ? 'var(--cyan)' : 'var(--text-3)',
          fontSize:'11px', fontFamily:'JetBrains Mono, monospace',
          fontWeight: active ? '600' : '400',
          cursor:'pointer', transition:'all 0.15s', flexShrink:0,
          boxShadow: active ? '0 0 10px rgba(0,200,255,0.1)' : 'none',
        }}
        onMouseEnter={e => { if (!active) { e.currentTarget.style.color='var(--text-2)'; e.currentTarget.style.outline='1px solid var(--border-2)' }}}
        onMouseLeave={e => { if (!active) { e.currentTarget.style.color='var(--text-3)'; e.currentTarget.style.outline='1px solid transparent' }}}
      >
        <span style={{ fontSize:'12px' }}>{t.icon}</span>
        <span>{t.label}</span>
      </button>
    )
  }

  return (
    <div style={{
      display:'flex', alignItems:'center', gap:'2px',
      padding:'0 12px', height:'44px', flexShrink:0,
      background:'var(--panel)',
      borderBottom:'1px solid var(--border-1)',
      overflowX:'auto', zIndex:10,
    }}>

      {tools.map(toolBtn)}
      {sep()}

      {/* stroke */}
      {label('stroke')}
      <div style={{ marginLeft:'5px', marginRight:'2px' }}>
        <input type="color" value={color} onChange={e => setColor(e.target.value)}
          style={{ width:'20px', height:'20px', borderRadius:'4px', border:'1px solid var(--border-2)', padding:'1px', cursor:'pointer', background:'transparent' }}
        />
      </div>
      <span style={{ fontSize:'9px', color:'var(--text-3)', marginRight:'4px' }}>{color}</span>

      {sep()}

      {/* fill */}
      {label('fill')}
      <div style={{ marginLeft:'5px' }}>
        <input type="color"
          value={fillColor === 'transparent' ? '#000000' : fillColor}
          onChange={e => setFillColor(e.target.value)}
          style={{ width:'20px', height:'20px', borderRadius:'4px', border:'1px solid var(--border-2)', padding:'1px', cursor:'pointer', background:'transparent', opacity: fillColor === 'transparent' ? 0.3 : 1 }}
        />
      </div>
      <button
        onClick={() => setFillColor(fillColor === 'transparent' ? '#ffffff' : 'transparent')}
        style={{
          marginLeft:'4px', padding:'2px 6px', borderRadius:'4px',
          border:'1px solid var(--border-1)',
          background: fillColor === 'transparent' ? 'transparent' : 'rgba(0,200,255,0.08)',
          color: fillColor === 'transparent' ? 'var(--text-3)' : 'var(--cyan)',
          fontSize:'9px', cursor:'pointer', transition:'all 0.15s',
        }}
      >
        {fillColor === 'transparent' ? 'off' : 'on'}
      </button>

      {sep()}

      {/* width */}
      {label('w')}
      <div style={{ display:'flex', gap:'3px', marginLeft:'5px' }}>
        {widths.map(w => (
          <button key={w.value} onClick={() => setStrokeWidth(w.value)}
            style={{
              width:'22px', height:'22px', borderRadius:'4px', border:'none',
              background: strokeWidth === w.value ? 'rgba(0,200,255,0.1)' : 'transparent',
              outline: strokeWidth === w.value ? '1px solid rgba(0,200,255,0.4)' : '1px solid var(--border-1)',
              color: strokeWidth === w.value ? 'var(--cyan)' : 'var(--text-3)',
              fontSize:'9px', cursor:'pointer', transition:'all 0.15s',
            }}
          >{w.label}</button>
        ))}
      </div>

      {sep()}

      {/* opacity */}
      {label('opacity')}
      <input type="range" min="0.1" max="1" step="0.05"
        value={opacity}
        onChange={e => setOpacity(parseFloat(e.target.value))}
        style={{ width:'60px', marginLeft:'6px', accentColor:'var(--cyan)', cursor:'pointer' }}
      />
      <span style={{ fontSize:'9px', color:'var(--text-3)', marginLeft:'4px', width:'28px' }}>
        {Math.round(opacity * 100)}%
      </span>

      {sep()}

      {/* zoom */}
      {label('zoom')}
      <div style={{ display:'flex', alignItems:'center', gap:'3px', marginLeft:'5px' }}>
        <button onClick={onZoomOut}
          style={{ width:'20px', height:'20px', borderRadius:'4px', border:'1px solid var(--border-1)', background:'transparent', color:'var(--text-2)', fontSize:'12px', cursor:'pointer' }}
        >−</button>
        <button onClick={onZoomReset}
          style={{ padding:'0 6px', height:'20px', borderRadius:'4px', border:'1px solid var(--border-1)', background:'transparent', color:'var(--cyan)', fontSize:'9px', cursor:'pointer', minWidth:'40px' }}
        >{Math.round((zoom || 1) * 100)}%</button>
        <button onClick={onZoomIn}
          style={{ width:'20px', height:'20px', borderRadius:'4px', border:'1px solid var(--border-1)', background:'transparent', color:'var(--text-2)', fontSize:'12px', cursor:'pointer' }}
        >+</button>
      </div>

      {sep()}

      {/* export */}
      <button onClick={() => {
        const canvas = document.querySelector('canvas')
        if (!canvas) return
        const a = document.createElement('a')
        a.href = canvas.toDataURL('image/png')
        a.download = 'collabboard.png'
        a.click()
      }}
        style={{ display:'flex', alignItems:'center', gap:'4px', padding:'4px 8px', borderRadius:'6px', background:'transparent', border:'1px solid var(--border-1)', color:'var(--text-3)', fontSize:'9px', cursor:'pointer', transition:'all 0.15s', flexShrink:0 }}
        onMouseEnter={e => { e.currentTarget.style.borderColor='var(--green)'; e.currentTarget.style.color='var(--green)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border-1)'; e.currentTarget.style.color='var(--text-3)' }}
      >↓ export</button>

      {sep()}

      {/* clear */}
      <button onClick={onClear}
        style={{ display:'flex', alignItems:'center', gap:'4px', padding:'4px 8px', borderRadius:'6px', background:'transparent', border:'1px solid var(--border-1)', color:'var(--text-3)', fontSize:'9px', cursor:'pointer', transition:'all 0.15s', flexShrink:0 }}
        onMouseEnter={e => { e.currentTarget.style.borderColor='var(--red)'; e.currentTarget.style.color='var(--red)'; e.currentTarget.style.background='rgba(255,51,85,0.05)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border-1)'; e.currentTarget.style.color='var(--text-3)'; e.currentTarget.style.background='transparent' }}
      >✕ clear</button>

      {/* shortcuts */}
      <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:'8px', flexShrink:0 }}>
        {[{ key:'⌘Z', label:'undo' }, { key:'Del', label:'delete' }, { key:'⌘scroll', label:'zoom' }].map(({ key, label }) => (
          <div key={key} style={{ display:'flex', alignItems:'center', gap:'3px' }}>
            <kbd style={{ padding:'1px 5px', borderRadius:'3px', background:'var(--elevated)', border:'1px solid var(--border-1)', color:'var(--text-2)', fontSize:'8px' }}>{key}</kbd>
            <span style={{ fontSize:'8px', color:'var(--text-3)' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}