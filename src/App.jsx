import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './pages/Home'
import Blog from './pages/Blog'
import Team from './pages/Team'

function App() {
  const [darkMode, setDarkMode] = useState(true)

  const theme = {
    bg: darkMode ? '#0a0a0a' : '#fafafa',
    text: darkMode ? '#ffffff' : '#0a0a0a',
    muted: darkMode ? '#888888' : '#666666',
    accent: darkMode ? '#3b82f6' : '#2563eb',
    cardBg: darkMode ? '#1a1a1a' : '#ffffff',
    border: darkMode ? '#333' : '#e5e5e5',
  }

  return (
    <BrowserRouter>
      <div style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        background: theme.bg,
        color: theme.text,
        minHeight: '100vh',
        transition: 'all 0.3s ease',
      }}>
        <Nav theme={theme} darkMode={darkMode} setDarkMode={setDarkMode} />

        <Routes>
          <Route path="/" element={<Home theme={theme} />} />
          <Route path="/blog" element={<Blog theme={theme} />} />
          <Route path="/blog/:slug" element={<Blog theme={theme} />} />
          <Route path="/team" element={<Team theme={theme} />} />
        </Routes>

        <footer style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '3rem 2rem',
          textAlign: 'center',
          color: theme.muted,
          fontSize: '0.9rem',
        }}>
          Self-hosted on a Synology NAS. Because why not.
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App
