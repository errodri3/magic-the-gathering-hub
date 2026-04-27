import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import Navbar from '../components/Navbar'

const FLAGS = ['All', 'General', 'Question', 'Opinion', 'Deck List', 'News', 'Humor']

const FLAG_COLORS = {
  General: '#7b5ea7',
  Question: '#4ecdc4',
  Opinion: '#e05c5c',
  'Deck List': '#c9a84c',
  News: '#5c9ee0',
  Humor: '#e0a85c',
}

function timeAgo(timestamp) {
  const now = new Date()
  const diff = now - new Date(timestamp)
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(mins / 60)
  const days = Math.floor(hours / 24)
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  return `${mins} minute${mins > 1 ? 's' : ''} ago`
}

function Home({ onThemeChange, currentTheme }) {
  const [posts, setPosts] = useState([])
  const [search, setSearch] = useState('')
  const [orderBy, setOrderBy] = useState('created_at')
  const [activeFlag, setActiveFlag] = useState('All')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false
    supabase
      .from('posts')
      .select()
      .order(orderBy, { ascending: false })
      .then(({ data }) => {
        if (!cancelled) {
          setPosts(data || [])
          setLoading(false)
        }
      })
    return () => { cancelled = true }
  }, [orderBy])

  const filtered = posts
    .filter(p => activeFlag === 'All' || p.flag === activeFlag)
    .filter(p => p.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <>
      <Navbar onThemeChange={onThemeChange} currentTheme={currentTheme} />

      <div className="page-container">
        <h1 className="page-heading">The Gathering</h1>
        <p className="page-subheading">Share your decks, stories, and love for the game</p>

        <div className="controls">
          <input
            className="search-input"
            placeholder="🔍 Search posts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button
            className={`sort-btn ${orderBy === 'created_at' ? 'active' : ''}`}
            onClick={() => setOrderBy('created_at')}
          >
            ✨ Newest
          </button>
          <button
            className={`sort-btn ${orderBy === 'upvotes' ? 'active' : ''}`}
            onClick={() => setOrderBy('upvotes')}
          >
            🔥 Most Popular
          </button>
        </div>

        {/* Flag filters */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {FLAGS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFlag(f)}
              style={{
                padding: '0.3rem 0.9rem',
                borderRadius: '20px',
                border: '1px solid',
                borderColor: activeFlag === f ? (FLAG_COLORS[f] || 'var(--accent-gold)') : 'var(--border-color)',
                background: activeFlag === f ? `${FLAG_COLORS[f] ? FLAG_COLORS[f] + '22' : 'rgba(201,168,76,0.1)'}` : 'transparent',
                color: activeFlag === f ? (FLAG_COLORS[f] || 'var(--accent-gold)') : 'var(--text-secondary)',
                fontFamily: 'Nunito, sans-serif',
                fontWeight: '600',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="spinner-container">
            <div className="spinner" />
            <p className="spinner-text">Summoning posts...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🎴</div>
            <p>No posts found.</p>
          </div>
        ) : (
          filtered.map(post => (
            <div
              key={post.id}
              className="card"
              onClick={() => navigate(`/post/${post.id}`)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="card-time">{timeAgo(post.created_at)}</div>
                {post.flag && (
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    padding: '0.2rem 0.7rem',
                    borderRadius: '20px',
                    background: `${FLAG_COLORS[post.flag] ? FLAG_COLORS[post.flag] + '22' : 'rgba(201,168,76,0.1)'}`,
                    color: FLAG_COLORS[post.flag] || 'var(--accent-gold)',
                    border: `1px solid ${FLAG_COLORS[post.flag] || 'var(--accent-gold)'}`,
                  }}>
                    {post.flag}
                  </span>
                )}
              </div>
              <div className="card-title">{post.title}</div>
              <div className="card-upvotes">⚡ {post.upvotes} upvotes</div>
            </div>
          ))
        )}
      </div>
    </>
  )
}

export default Home