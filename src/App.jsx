import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ThemeProvider } from './context/ThemeContext'
import ThemeToggle from './components/ThemeToggle'
import HomePage from './pages/HomePage'
import MovieDetail from './pages/MovieDetail'

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
}

const App = () => {
  const location = useLocation()

  return (
    <ThemeProvider>
      <main>
        <div className="pattern" />
        <ThemeToggle />
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Routes location={location}>
              <Route path="/" element={<HomePage />} />
              <Route path="/movie/:id" element={<MovieDetail />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
    </ThemeProvider>
  )
}

export default App
