import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabase'

function PostPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [editImageUrl, setEditImageUrl] = useState('')

  useEffect(() => {
    supabase
      .from('posts')
      .select()
      .eq('id', id)
      .single()
      .then(({ data }) => {
        if (data) {
          setPost(data)
          setEditTitle(data.title)
          setEditContent(data.content || '')
          setEditImageUrl(data.image_url || '')
        }
      })

    supabase
      .from('comments')
      .select()
      .eq('post_id', id)
      .then(({ data }) => setComments(data || []))
  }, [id])

  async function handleUpvote() {
    const { data } = await supabase
      .from('posts')
      .update({ upvotes: post.upvotes + 1 })
      .eq('id', id)
      .select()
    if (data && data[0]) setPost(data[0])
  }

  async function handleDelete() {
    if (!confirm('Delete this post?')) return
    await supabase.from('comments').delete().eq('post_id', id)
    await supabase.from('posts').delete().eq('id', id)
    navigate('/')
  }

  async function handleEdit() {
    const { data } = await supabase
      .from('posts')
      .update({ title: editTitle, content: editContent, image_url: editImageUrl })
      .eq('id', id)
      .select()
    if (data && data[0]) {
      setPost(data[0])
      setIsEditing(false)
    }
  }

  async function handleComment() {
    if (!newComment.trim()) return
    const { data } = await supabase
      .from('comments')
      .insert([{ post_id: id, content: newComment }])
      .select()
    if (data) {
      setComments([...comments, data[0]])
      setNewComment('')
    }
  }

  if (!post) return (
    <>
      <nav className="navbar">
        <div className="navbar-brand"><span>🎴</span> MTG Hub</div>
        <div className="navbar-links">
          <Link to="/" className="btn-secondary">Home</Link>
          <Link to="/create" className="btn-primary">+ New Post</Link>
        </div>
      </nav>
      <div className="page-container">
        <div className="empty-state">
          <div className="icon">🎴</div>
          <p>Loading post...</p>
        </div>
      </div>
    </>
  )

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand"><span>🎴</span> MTG Hub</div>
        <div className="navbar-links">
          <Link to="/" className="btn-secondary">Home</Link>
          <Link to="/create" className="btn-primary">+ New Post</Link>
        </div>
      </nav>

      <div className="page-container">
        {isEditing ? (
          <div className="form-card">
            <h2 className="form-title">✏️ Edit Post</h2>
            <div className="form-group">
              <label>Title</label>
              <input
                className="form-input"
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Content</label>
              <textarea
                className="form-textarea"
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Image URL</label>
              <input
                className="form-input"
                value={editImageUrl}
                onChange={e => setEditImageUrl(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button className="btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleEdit}>Save Changes</button>
            </div>
          </div>
        ) : (
          <>
            <div className="card" style={{ cursor: 'default' }}>
              <div className="post-header">
                <div className="post-meta">{new Date(post.created_at).toLocaleDateString()}</div>
                <h1 className="post-title">{post.title}</h1>
              </div>

              {post.image_url && (
                <img src={post.image_url} alt="post" className="post-image" />
              )}

              {post.content && (
                <p className="post-content">{post.content}</p>
              )}

              <button className="upvote-btn" onClick={handleUpvote}>
                👍 {post.upvotes} upvotes
              </button>

              <div className="post-actions">
                <button className="btn-secondary" onClick={() => setIsEditing(true)}>✏️ Edit</button>
                <button className="btn-danger" onClick={handleDelete}>🗑️ Delete</button>
              </div>
            </div>

            <div className="comments-section">
              <h3 className="comments-title">💬 Comments ({comments.length})</h3>

              {comments.map(comment => (
                <div key={comment.id} className="comment">
                  {comment.content}
                </div>
              ))}

              <div className="comment-input-row">
                <input
                  className="comment-input"
                  placeholder="Leave a comment..."
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleComment()}
                />
                <button className="btn-primary" onClick={handleComment}>Post</button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default PostPage