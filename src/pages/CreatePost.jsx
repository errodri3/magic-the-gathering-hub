import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import Navbar from '../components/Navbar'

const FLAGS = ['General', 'Question', 'Opinion', 'Deck List', 'News', 'Humor']

function CreatePost({ onThemeChange, currentTheme }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const [flag, setFlag] = useState('General')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return

    const { data } = await supabase
      .from('posts')
      .insert([{ title, content, image_url: imageUrl, upvotes: 0, secret_key: secretKey, flag }])
      .select()

    if (data && data[0]) {
      navigate(`/post/${data[0].id}`)
    }
  }

  return (
    <>
      <Navbar onThemeChange={onThemeChange} currentTheme={currentTheme} />

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
            <label>Post Flag 🏷️</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {FLAGS.map(f => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFlag(f)}
                  style={{
                    padding: '0.4rem 1rem',
                    borderRadius: '20px',
                    border: '1px solid',
                    borderColor: flag === f ? 'var(--accent-gold)' : 'var(--border-color)',
                    background: flag === f ? 'rgba(201, 168, 76, 0.15)' : 'transparent',
                    color: flag === f ? 'var(--accent-gold)' : 'var(--text-secondary)',
                    fontFamily: 'Nunito, sans-serif',
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
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
            <button className="btn-secondary" onClick={() => navigate('/')}>Cancel</button>
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