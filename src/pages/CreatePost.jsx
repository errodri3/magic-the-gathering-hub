import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabase'

function CreatePost() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return

    const { data } = await supabase
      .from('posts')
      .insert([{ title, content, image_url: imageUrl, upvotes: 0, secret_key: secretKey }])
      .select()

    if (data && data[0]) {
      navigate(`/post/${data[0].id}`)
    }
  }

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
        <div className="form-card">
          <h2 className="form-title">✨ Create a New Post</h2>

          <div className="form-group">
            <label>Title *</label>
            <input
              className="form-input"
              placeholder="What's on your mind?"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Content (Optional)</label>
            <textarea
              className="form-textarea"
              placeholder="Share your thoughts, deck list, story..."
              value={content}
              onChange={e => setContent(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Image URL (Optional)</label>
            <input
              className="form-input"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Secret Key 🔐 (used to edit or delete your post later)</label>
            <input
              className="form-input"
              type="password"
              placeholder="Choose a secret key you'll remember"
              value={secretKey}
              onChange={e => setSecretKey(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <Link to="/" className="btn-secondary">Cancel</Link>
            <button className="btn-primary" onClick={handleSubmit}>
              Post to the Hub 🎴
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default CreatePost