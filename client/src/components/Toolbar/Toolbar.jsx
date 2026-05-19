export const Toolbar = ({ tool, setTool, color, setColor, fillColor, setFillColor, strokeWidth, setStrokeWidth, onClear }) => {
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
    <div style={{ width: '1px', height: '18px', background: '#0f1e30', margin: '0 6px', flexShrink: 0 }} />
  )

  const toolBtn = (t) => {
    const active = tool === t.id
    return (
      <button key={t.id} onClick={() => setTool(t.id)}
        style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          padding: '5px 11px', borderRadius: '7px', border: 'none',
          background: active ? 'rgba(124,58,237,0.15)' : 'transparent',
          outline: active ? '1px solid rgba(124,58,237,0.45)' : '1px solid transparent',
          color: active ? '#a78bfa' : '#2a4060',
          fontSize: '12px', fontFamily: 'Instrument Sans, sans-serif',
          fontWeight: active ? '600' : '500',
          cursor: 'pointer', transition: 'all 0.15s ease', flexShrink: 0,
          boxShadow: active ? '0 0 12px rgba(124,58,237,0.15)' : 'none',
        }}
        onMouseEnter={e => {
          if (!active) {
            e.currentTarget.style.color = '#4a6080'
            e.currentTarget.style.outline = '1px solid #1a2d45'
            e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
          }
        }}
        onMouseLeave={e => {
          if (!active) {
            e.currentTarget.style.color = '#2a4060'
            e.currentTarget.style.outline = '1px solid transparent'
            e.currentTarget.style.background = 'transparent'
          }
        }}
      >
        <span style={{ fontSize: '13px', lineHeight: 1 }}>{t.icon}</span>
        <span style={{ fontSize: '11px' }}>{t.label}</span>
      </button>
    )
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      padding: '0 14px', height: '44px', flexShrink: 0,
      background: 'linear-gradient(180deg, #070e1c 0%, #050b18 100%)',
      borderBottom: '1px solid #0a1828',
      overflowX: 'auto', zIndex: 10, gap: '2px',
    }}>

      {/* tool buttons */}
      {tools.map(toolBtn)}

      {sep()}

      {/* stroke color */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
        <span style={{ fontSize: '10px', color: '#1e3050', fontFamily: 'JetBrains Mono, monospace' }}>stroke</span>
        <div style={{ position: 'relative' }}>
          <input type="color" value={color} onChange={e => setColor(e.target.value)}
            style={{
              width: '22px', height: '22px', borderRadius: '5px',
              border: '1px solid #1a2d45', padding: '1px',
              cursor: 'pointer', background: 'transparent',
            }}
          />
        </div>
        <span style={{ fontSize: '10px', color: '#2a4060', fontFamily: 'JetBrains Mono, monospace' }}>{color}</span>
      </div>

      {sep()}

      {/* fill color */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
        <span style={{ fontSize: '10px', color: '#1e3050', fontFamily: 'JetBrains Mono, monospace' }}>fill</span>
        <input type="color"
          value={fillColor === 'transparent' ? '#000000' : fillColor}
          onChange={e => setFillColor(e.target.value)}
          style={{
            width: '22px', height: '22px', borderRadius: '5px',
            border: '1px solid #1a2d45', padding: '1px',
            cursor: 'pointer', background: 'transparent',
            opacity: fillColor === 'transparent' ? 0.3 : 1,
          }}
        />
        <button
          onClick={() => setFillColor(fillColor === 'transparent' ? '#ffffff' : 'transparent')}
          style={{
            padding: '2px 8px', borderRadius: '5px',
            border: '1px solid #0f1e30',
            background: fillColor === 'transparent' ? 'transparent' : 'rgba(6,182,212,0.08)',
            color: fillColor === 'transparent' ? '#1e3050' : '#06b6d4',
            fontSize: '10px', fontFamily: 'JetBrains Mono, monospace',
            cursor: 'pointer', transition: 'all 0.15s',
          }}
        >
          {fillColor === 'transparent' ? 'off' : 'on'}
        </button>
      </div>

      {sep()}

      {/* stroke width */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
        <span style={{ fontSize: '10px', color: '#1e3050', fontFamily: 'JetBrains Mono, monospace', marginRight: '2px' }}>width</span>
        {widths.map(w => (
          <button key={w.value} onClick={() => setStrokeWidth(w.value)}
            style={{
              width: '24px', height: '24px', borderRadius: '5px', border: 'none',
              background: strokeWidth === w.value ? 'rgba(124,58,237,0.15)' : 'transparent',
              outline: strokeWidth === w.value ? '1px solid rgba(124,58,237,0.4)' : '1px solid #0f1e30',
              color: strokeWidth === w.value ? '#a78bfa' : '#2a4060',
              fontSize: '10px', fontFamily: 'JetBrains Mono, monospace',
              cursor: 'pointer', transition: 'all 0.15s',
            }}
          >{w.label}</button>
        ))}
      </div>

      {sep()}

      {/* export */}
      <button
        onClick={() => {
          const canvas = document.querySelector('canvas')
          if (!canvas) return
          const a = document.createElement('a')
          a.href = canvas.toDataURL('image/png')
          a.download = 'collabboard.png'
          a.click()
        }}
        style={{
          display: 'flex', alignItems: 'center', gap: '4px',
          padding: '5px 10px', borderRadius: '7px',
          background: 'transparent', border: '1px solid #0f1e30',
          color: '#2a4060', fontSize: '10px',
          fontFamily: 'JetBrains Mono, monospace',
          cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = '#10b981'
          e.currentTarget.style.color = '#10b981'
          e.currentTarget.style.background = 'rgba(16,185,129,0.05)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = '#0f1e30'
          e.currentTarget.style.color = '#2a4060'
          e.currentTarget.style.background = 'transparent'
        }}
      >
        ↓ export
      </button>

      {sep()}

      {/* clear */}
      <button
        onClick={onClear}
        style={{
          display: 'flex', alignItems: 'center', gap: '4px',
          padding: '5px 10px', borderRadius: '7px',
          background: 'transparent', border: '1px solid #0f1e30',
          color: '#2a4060', fontSize: '10px',
          fontFamily: 'JetBrains Mono, monospace',
          cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = '#ef4444'
          e.currentTarget.style.color = '#ef4444'
          e.currentTarget.style.background = 'rgba(239,68,68,0.05)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = '#0f1e30'
          e.currentTarget.style.color = '#2a4060'
          e.currentTarget.style.background = 'transparent'
        }}
      >
        ✕ clear
      </button>

      {/* right — keyboard shortcuts */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        {[{ key: '⌘Z', label: 'undo' }, { key: 'Del', label: 'delete' }].map(({ key, label }) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <kbd style={{
              padding: '2px 5px', borderRadius: '4px',
              background: '#030810',
              border: '1px solid #0f1e30',
              color: '#2a4060',
              fontSize: '9px', fontFamily: 'JetBrains Mono, monospace',
            }}>{key}</kbd>
            <span style={{ fontSize: '9px', color: '#1a2d45', fontFamily: 'JetBrains Mono, monospace' }}>{label}</span>
          </div>
        ))}
      </div>

    </div>
  )
}