export const RemoteCursor = ({ x, y, color, username }) => (
  <div style={{
    position: 'absolute', pointerEvents: 'none', zIndex: 100,
    transform: `translate(${x}px, ${y}px)`,
    transition: 'transform 60ms linear',
  }}>
    <svg width="18" height="18" viewBox="0 0 16 16" style={{ display: 'block', filter: `drop-shadow(0 0 4px ${color})` }}>
      <path d="M0 0 L0 12 L3.5 8.5 L6 14 L8 13 L5.5 7.5 L10 7.5 Z"
        fill={color} stroke="rgba(0,0,0,0.5)" strokeWidth="0.8" />
    </svg>
    <div style={{
      marginTop: '2px', marginLeft: '14px',
      padding: '3px 10px', borderRadius: '6px',
      background: color,
      color: '#000',
      fontSize: '10px',
      fontFamily: 'JetBrains Mono, monospace',
      fontWeight: '600', whiteSpace: 'nowrap',
      boxShadow: `0 2px 12px ${color}55`,
      letterSpacing: '0.3px',
    }}>
      {username}
    </div>
  </div>
)