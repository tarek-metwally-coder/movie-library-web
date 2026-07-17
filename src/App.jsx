import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import MovieDetail from './pages/MovieDetail'

const App = () => {
  return (
    <main>
      <div className="pattern" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
      </Routes>
    </main>
  )
}

export default App