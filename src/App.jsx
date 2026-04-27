import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import PostPage from './pages/PostPage'
import CreatePost from './pages/CreatePost'

function App() {
  const [theme, setTheme] = useState('default')

  function handleThemeChange(newTheme) {
    setTheme(newTheme)
    if (newTheme === 'default') {
      document.documentElement.removeAttribute('data-theme')
    } else {
      document.documentElement.setAttribute('data-theme', newTheme)
    }
  }

  return (
    <Routes>
      <Route path="/" element={<Home onThemeChange={handleThemeChange} currentTheme={theme} />} />
      <Route path="/post/:id" element={<PostPage onThemeChange={handleThemeChange} currentTheme={theme} />} />
      <Route path="/create" element={<CreatePost onThemeChange={handleThemeChange} currentTheme={theme} />} />
    </Routes>
  )
}

export default App