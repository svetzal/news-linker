import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Redirect from './pages/Redirect'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1 className="text-2xl font-bold text-canadian-red">News Linker</h1>
        <p className="text-sm">Share news links on social media</p>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/r/:encodedUrl" element={<Redirect />} />
        </Routes>
      </main>
      <footer className="app-footer mt-8 text-sm text-gray-500">
        <p>© {new Date().getFullYear()} News Linker</p>
      </footer>
    </div>
  )
}

export default App