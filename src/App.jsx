import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import ThemeToggle from './components/ThemeToggle'
import HomePage from './pages/HomePage'
import MovieDetail from './pages/MovieDetail'

const App = () => {
  return (
    <ThemeProvider>
      <main>
        <div className="pattern" />
        <ThemeToggle />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
        </Routes>
      </main>
    </ThemeProvider>
  )
}

export default App