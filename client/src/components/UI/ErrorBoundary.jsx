import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          background: 'var(--bg-void)',
          flexDirection: 'column', gap: '16px'
        }}>
          <div style={{ fontSize: '32px' }}>⚠</div>
          <div style={{
            fontFamily: 'Cabinet Grotesk, sans-serif',
            fontSize: '20px', fontWeight: '700',
            color: 'var(--text-bright)'
          }}>Something went wrong</div>
          <div style={{
            fontSize: '12px', color: 'var(--text-dim)',
            fontFamily: 'JetBrains Mono, monospace',
            maxWidth: '400px', textAlign: 'center'
          }}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </div>
          <button
            onClick={() => window.location.href = '/'}
            style={{
              marginTop: '8px', padding: '10px 24px',
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              border: 'none', borderRadius: '8px',
              color: '#fff', fontSize: '12px',
              fontFamily: 'JetBrains Mono, monospace',
              cursor: 'pointer', letterSpacing: '1px'
            }}
          >
            → go home
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary