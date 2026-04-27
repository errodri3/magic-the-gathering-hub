import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import PostPage from './pages/PostPage'
import CreatePost from './pages/CreatePost'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/post/:id" element={<PostPage />} />
      <Route path="/create" element={<CreatePost />} />
    </Routes>
  )
}

export default App