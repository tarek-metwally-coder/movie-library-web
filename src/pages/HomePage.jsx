import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Search from '../components/Search'
import { MovieCardSkeleton, TrendingSkeleton } from '../components/Skeletons'
import MovieCard from '../components/MovieCard'
import { useDebounce } from 'react-use'
import { getTrendingMovies, updateSearchCount } from '../appwrite'
import { MOCK_MOVIES, MOCK_TRENDING } from '../data/mockMovies'

const API_BASE_URL = 'https://api.themoviedb.org/3'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const GENRES = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 18, name: 'Drama' },
  { id: 14, name: 'Fantasy' },
  { id: 27, name: 'Horror' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Sci-Fi' },
  { id: 53, name: 'Thriller' },
]

const RATING_OPTIONS = [
  { value: 0, label: 'Any Rating' },
  { value: 5, label: '5+' },
  { value: 6, label: '6+' },
  { value: 7, label: '7+' },
  { value: 8, label: '8+' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [movieList, setMovieList] = useState(MOCK_MOVIES)
  const [isLoading, setIsLoading] = useState(false)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [trendingMovies, setTrendingMovies] = useState(MOCK_TRENDING)
  const [isTrendingLoading, setisTrendingLoading] = useState(false)
  const [trendingErrorMessage, setTrendingErrorMessage] = useState('')

  const [selectedGenre, setSelectedGenre] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [minRating, setMinRating] = useState(0)

  const [page, setPage] = useState(1)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])

  const fetchMovies = async (query = '', pageNum = 1) => {
    if (pageNum === 1) {
      setIsLoading(true)
      setErrorMessage('')
    } else {
      setIsLoadingMore(true)
    }

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${pageNum}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${pageNum}`

      const response = await fetch(endpoint, API_OPTIONS)
      if (!response.ok) {
        throw new Error('Failed to fetch movies')
      }

      const data = await response.json()

      if (data.Response == 'false') {
        if (pageNum === 1) {
          setErrorMessage(data.Error || 'Failed to fetch movies')
          setMovieList([])
        }
        return
      }

      if (pageNum === 1) {
        setMovieList(data.results || [])
      } else {
        setMovieList(prev => [...prev, ...(data.results || [])])
      }

      if (query && data.results?.length > 0 && pageNum === 1) {
        await updateSearchCount(query, data.results[0])
      }
    } catch (error) {
      console.error(`Error fetching movies: ${error}`)
      if (pageNum === 1) {
        if (!query) {
          setMovieList(MOCK_MOVIES)
          setErrorMessage('')
        } else {
          setErrorMessage('Error fetching movies. Please try again later.')
        }
      }
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }

  const loadTrendingMovies = async () => {
    try {
      setisTrendingLoading(true)
      setTrendingErrorMessage('')

      const movies = await getTrendingMovies()
      setTrendingMovies(movies)
    } catch (error) {
      console.error(`Error fetching Trending movies: ${error}`)
      setTrendingMovies(MOCK_TRENDING)
      setTrendingErrorMessage('')
    } finally {
      setisTrendingLoading(false)
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm, 1)
    setPage(1)
  }, [debouncedSearchTerm])

  useEffect(() => {
    loadTrendingMovies()
  }, [])

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchMovies(debouncedSearchTerm, nextPage)
  }

  const filteredMovies = useMemo(() => {
    return movieList.filter(movie => {
      if (selectedGenre && !movie.genre_ids?.includes(Number(selectedGenre)) && !movie.genres?.some(g => g.id === Number(selectedGenre))) return false
      if (selectedYear && (!movie.release_date || movie.release_date.split('-')[0] !== selectedYear)) return false
      if (minRating && (movie.vote_average || 0) < minRating) return false
      return true
    })
  }, [movieList, selectedGenre, selectedYear, minRating])

  const years = useMemo(() => {
    const set = new Set(movieList.map(m => m.release_date?.split('-')[0]).filter(Boolean))
    return [...set].sort((a, b) => b.localeCompare(a))
  }, [movieList])

  const hasActiveFilters = selectedGenre || selectedYear || minRating > 0

  const clearFilters = () => {
    setSelectedGenre('')
    setSelectedYear('')
    setMinRating(0)
  }

  return (
    <motion.div
      className="wrapper"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <header>
        <img src="./hero.png" alt="Hero Banner" />
        <h1>Find <span className='text-gradient'>Movies</span> You'll Enjoy Without the Hassle</h1>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </header>

      {isTrendingLoading ? (
        <TrendingSkeleton />
      ) : trendingErrorMessage ? (
        <p className='text-red-500 mt-[40px] mb-[40px]'>{trendingErrorMessage}</p>
      ) : trendingMovies.length > 0 && (
        <motion.section className='trending' variants={itemVariants}>
          <h2>Trending Movies</h2>
          <ul>
            {trendingMovies.map((movie, index) => (
              <li key={movie.$id}>
                <p>{index + 1}</p>
                <img src={movie.poster_url} alt={movie.title} />
              </li>
            ))}
          </ul>
        </motion.section>
      )}

      <motion.section className='all-movies' variants={itemVariants}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2>
            {debouncedSearchTerm
              ? `Search Results for "${debouncedSearchTerm}"`
              : 'All Movies'}
          </h2>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-light-200 hover:text-white transition-colors self-start"
            >
              Clear filters &times;
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-3 items-center mt-2">
          <select
            value={selectedGenre}
            onChange={e => setSelectedGenre(e.target.value)}
            className="bg-dark-100 text-white px-3 py-2 rounded-lg text-sm border border-gray-700/30 outline-none"
          >
            <option value="">All Genres</option>
            {GENRES.map(g => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={e => setSelectedYear(e.target.value)}
            className="bg-dark-100 text-white px-3 py-2 rounded-lg text-sm border border-gray-700/30 outline-none"
          >
            <option value="">All Years</option>
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <select
            value={minRating}
            onChange={e => setMinRating(Number(e.target.value))}
            className="bg-dark-100 text-white px-3 py-2 rounded-lg text-sm border border-gray-700/30 outline-none"
          >
            {RATING_OPTIONS.map(r => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        ) : errorMessage ? (
          <p className='text-red-500 mt-[40px] mb-[40px]'>{errorMessage}</p>
        ) : filteredMovies.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="text-6xl mb-4 opacity-30">🎬</div>
            <p className="text-light-200 text-lg">
              {hasActiveFilters
                ? 'No movies match your filters.'
                : debouncedSearchTerm
                  ? `No movies found for "${debouncedSearchTerm}".`
                  : 'No movies available.'}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 text-sm text-light-200 hover:text-white underline transition-colors"
              >
                Try clearing filters
              </button>
            )}
          </motion.div>
        ) : (
          <>
            <motion.ul
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence mode="popLayout">
                {filteredMovies.map((movie) => (
                  <motion.li
                    key={movie.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.25 }}
                  >
                    <MovieCard movie={movie} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>

            <div className="flex justify-center mt-8">
              <button
                onClick={loadMore}
                disabled={isLoadingMore}
                className="bg-dark-100 hover:bg-dark-100/80 text-white px-8 py-3 rounded-full font-medium transition-colors disabled:opacity-50"
              >
                {isLoadingMore ? 'Loading...' : 'Load More Movies'}
              </button>
            </div>
          </>
        )}
      </motion.section>
    </motion.div>
  )
}

export default HomePage
