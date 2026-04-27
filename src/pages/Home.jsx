import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabase'

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

function Home() {
  const [posts, setPosts] = useState([])
  const [search, setSearch] = useState('')
  const [orderBy, setOrderBy] = useState('created_at')
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false
    supabase
      .from('posts')
      .select()
      .order(orderBy, { ascending: false })
      .then(({ data }) => {
        if (!cancelled) setPosts(data || [])
      })
    return () => { cancelled = true }
  }, [orderBy])

  const filtered = posts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">
          <span>🎴</span> MTG Hub
        </div>
        <div className="navbar-links">
          <Link to="/" className="btn-secondary">Home</Link>
          <Link to="/create" className="btn-primary">+ New Post</Link>
        </div>
      </nav>

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

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🎴</div>
            <p>No posts yet. Be the first to share!</p>
          </div>
        ) : (
          filtered.map(post => (
            <div
              key={post.id}
              className="card"
              onClick={() => navigate(`/post/${post.id}`)}
            >
              <div className="card-time">{timeAgo(post.created_at)}</div>
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