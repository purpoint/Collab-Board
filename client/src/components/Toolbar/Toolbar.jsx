export const Toolbar = ({ tool, setTool, color, setColor }) => {
    const tools = [
        { id: 'rect', icon: '▭', label: 'Rect' },
        { id: 'circle', icon: '○', label: 'Circle' },
        { id: 'line', icon: '╱', label: 'Line' },
    ]

    const toolBtn = (t) => {
        const active = tool === t.id
        return (
            <button key={t.id} onClick={() => setTool(t.id)} title={t.label}
                style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '6px 14px', borderRadius: '8px', border: 'none',
                    background: active
                        ? 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.2))'
                        : 'transparent',
                    outline: active ? '1px solid rgba(124,58,237,0.4)' : '1px solid transparent',
                    color: active ? '#c4b5fd' : 'var(--text-dim)',
                    fontSize: '13px', fontFamily: 'Instrument Sans, sans-serif',
                    fontWeight: active ? '600' : '400',
                    cursor: 'pointer', transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.color = 'var(--text-mid)'; e.currentTarget.style.outline = '1px solid var(--border-mid)' } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'var(--text-dim)'; e.currentTarget.style.outline = '1px solid transparent' } }}
            >
                <span style={{ fontSize: '15px', lineHeight: 1 }}>{t.icon}</span>
                <span style={{ fontSize: '12px' }}>{t.label}</span>
            </button>
        )
    }

    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: '0 16px', height: '46px', flexShrink: 0,
            background: 'var(--bg-panel)',
            borderBottom: '1px solid var(--border-dim)',
            zIndex: 10,
        }}>
            {/* tools */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                {tools.map(toolBtn)}
            </div>

            {/* separator */}
            <div style={{ width: '1px', height: '20px', background: 'var(--border-dim)', margin: '0 10px' }} />

            {/* color */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}>stroke</span>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input type="color" value={color} onChange={e => setColor(e.target.value)}
                        style={{
                            width: '26px', height: '26px', borderRadius: '6px',
                            border: '1px solid var(--border-mid)',
                            padding: '2px', cursor: 'pointer',
                            background: 'transparent',
                        }}
                    />
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-mid)', fontFamily: 'JetBrains Mono, monospace' }}>
                    {color}
                </span>
            </div>

            {/* separator */}
            <div style={{ width: '1px', height: '20px', background: 'var(--border-dim)', margin: '0 10px' }} />

            {/* export */}
            <button
                onClick={() => {
                    const canvas = document.querySelector('canvas')
                    if (!canvas) return
                    const a = document.createElement('a')
                    a.href = canvas.toDataURL('image/png')
                    a.download = 'collabboard-export.png'
                    a.click()
                }}
                style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '6px 12px', borderRadius: '8px',
                    background: 'transparent', border: '1px solid var(--border-dim)',
                    color: 'var(--text-dim)', fontSize: '11px',
                    fontFamily: 'JetBrains Mono, monospace',
                    cursor: 'pointer', transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#10b981'
                    e.currentTarget.style.color = '#10b981'
                    e.currentTarget.style.background = 'rgba(16,185,129,0.05)'
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border-dim)'
                    e.currentTarget.style.color = 'var(--text-dim)'
                    e.currentTarget.style.background = 'transparent'
                }}
            >
                ↓ export png
            </button>

            {/* right hint */}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}>
                    click & drag to draw
                </span>
            </div>
        </div>
    )
}