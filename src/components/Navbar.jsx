import { Link } from 'react-router-dom'

const THEMES = [
  { id: 'default', label: '⚪ Colorless' },
  { id: 'forest', label: '🌿 Forest' },
  { id: 'island', label: '🏝️ Island' },
  { id: 'mountain', label: '🌋 Mountain' },
  { id: 'swamp', label: '🟣 Swamp' },
  { id: 'plains', label: '🌾 Plains' },
]

function Navbar({ onThemeChange, currentTheme }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span>🎴</span> MTG Hub
      </div>
      <div className="navbar-links">
        <select
          value={currentTheme}
          onChange={e => onThemeChange(e.target.value)}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            padding: '0.4rem 0.8rem',
            borderRadius: '20px',
            fontFamily: 'Nunito, sans-serif',
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}
        >
          {THEMES.map(t => (
            <option key={t.id} value={t.id}>{t.label}</option>
          ))}
        </select>
        <Link to="/" className="btn-secondary">Home</Link>
        <Link to="/create" className="btn-primary">+ New Post</Link>
      </div>
    </nav>
  )
}

export default Navbar