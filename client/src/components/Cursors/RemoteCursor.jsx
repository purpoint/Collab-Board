export const RemoteCursor = ({ x, y, color, username }) => (
    <div style={{
        position: 'absolute', pointerEvents: 'none', zIndex: 100,
        transform: `translate(${x}px, ${y}px)`,
        transition: 'transform 60ms linear',
    }}>
        <svg width="16" height="16" viewBox="0 0 16 16" style={{ display: 'block' }}>
            <path d="M0 0 L0 12 L3.5 8.5 L6 14 L8 13 L5.5 7.5 L10 7.5 Z"
                fill={color} stroke="rgba(0,0,0,0.4)" strokeWidth="0.8" />
        </svg>
        <div style={{
            marginTop: '2px', marginLeft: '12px',
            padding: '2px 8px', borderRadius: '5px',
            background: color,
            color: '#000', fontSize: '10px',
            fontFamily: 'JetBrains Mono, monospace',
            fontWeight: '500', whiteSpace: 'nowrap',
            boxShadow: `0 2px 8px ${color}66`,
        }}>
            {username}
        </div>
    </div>
)