import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Spinner from '../components/Spinner'
import { getMockMovieById } from '../data/mockMovies'

const API_BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const MovieDetail = () => {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchMovieDetail = async () => {
    setLoading(true)
    setError('')

    try {
      const endpoint = `${API_BASE_URL}/movie/${id}?append_to_response=credits,videos,recommendations`
      const response = await fetch(endpoint, API_OPTIONS)

      if (!response.ok) {
        throw new Error('Failed to fetch movie details')
      }

      const data = await response.json()
      setMovie(data)
    } catch {
      const mock = getMockMovieById(id)
      if (mock) {
        setMovie(mock)
      } else {
        setError('Movie not found')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMovieDetail()
  }, [id])

  if (loading) return (
    <div className="wrapper">
      <Spinner />
    </div>
  )

  if (error) return (
    <div className="wrapper">
      <Link to="/" className="text-light-200 hover:text-white inline-block mb-6">&larr; Back to Movies</Link>
      <p className="text-red-500 mt-10">{error}</p>
    </div>
  )

  if (!movie) return null

  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
    : 'https://placehold.co/500x750/1a1a2e/ffffff?text=No+Poster'

  const backdrop = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280/${movie.backdrop_path}`
    : null

  const year = movie.release_date ? movie.release_date.split('-')[0] : 'N/A'
  const director = movie.credits?.crew?.find(c => c.job === 'Director')?.name

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A'
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)
  }

  return (
    <div className="wrapper">
      <Link to="/" className="text-light-200 hover:text-white inline-block mb-6 transition-colors">&larr; Back to Movies</Link>

      {backdrop && (
        <div className="relative w-full h-[300px] sm:h-[400px] rounded-2xl overflow-hidden mb-8">
          <img src={backdrop} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent" />
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-8 mb-12">
        <div className="shrink-0">
          <img
            src={poster}
            alt={movie.title}
            className="w-[250px] h-auto rounded-xl shadow-lg"
          />
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-white">{movie.title}</h1>

          {movie.tagline && (
            <p className="text-light-200 italic text-lg">{movie.tagline}</p>
          )}

          <div className="flex flex-wrap items-center gap-3 text-sm">
            {movie.vote_average && (
              <div className="flex items-center gap-1 bg-dark-100 px-3 py-1 rounded-full">
                <img src="/star.svg" alt="Star" className="size-4" />
                <span className="text-white font-bold">{movie.vote_average.toFixed(1)}</span>
              </div>
            )}
            {movie.runtime && (
              <span className="text-gray-100">{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
            )}
            <span className="text-gray-100">{year}</span>
            {movie.original_language && (
              <span className="uppercase text-gray-100">{movie.original_language}</span>
            )}
            {movie.status && (
              <span className="text-green-400">{movie.status}</span>
            )}
          </div>

          {movie.genres?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {movie.genres.map(genre => (
                <span key={genre.id} className="bg-dark-100 text-light-200 px-3 py-1 rounded-full text-sm">
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          <p className="text-gray-100 leading-relaxed">{movie.overview}</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
            {director && (
              <div>
                <p className="text-gray-100 text-xs uppercase tracking-wider">Director</p>
                <p className="text-white font-medium">{director}</p>
              </div>
            )}
            <div>
              <p className="text-gray-100 text-xs uppercase tracking-wider">Budget</p>
              <p className="text-white font-medium">{formatCurrency(movie.budget)}</p>
            </div>
            <div>
              <p className="text-gray-100 text-xs uppercase tracking-wider">Revenue</p>
              <p className="text-white font-medium">{formatCurrency(movie.revenue)}</p>
            </div>
          </div>
        </div>
      </div>

      {movie.credits?.cast?.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Cast</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
            {movie.credits.cast.slice(0, 15).map(person => (
              <div key={person.id} className="shrink-0 w-[130px] text-center">
                <img
                  src={person.profile_path
                    ? `https://image.tmdb.org/t/p/w185/${person.profile_path}`
                    : 'https://placehold.co/185x278/1a1a2e/ffffff?text=No+Photo'}
                  alt={person.name}
                  className="w-full h-[175px] object-cover rounded-lg mb-2"
                />
                <p className="text-white text-sm font-medium truncate">{person.name}</p>
                <p className="text-gray-100 text-xs truncate">{person.character}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {movie.videos?.results?.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Trailers & Videos</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
            {movie.videos.results.filter(v => v.site === 'YouTube').slice(0, 5).map(video => (
              <div key={video.id} className="shrink-0 w-[400px]">
                <div className="aspect-video rounded-xl overflow-hidden">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${video.key}`}
                    title={video.name}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <p className="text-white text-sm mt-2 truncate">{video.name}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {movie.recommendations?.results?.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Recommendations</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
            {movie.recommendations.results.slice(0, 10).map(rec => (
              <Link key={rec.id} to={`/movie/${rec.id}`} className="shrink-0 w-[150px]">
                <img
                  src={rec.poster_path
                    ? `https://image.tmdb.org/t/p/w342/${rec.poster_path}`
                    : 'https://placehold.co/342x513/1a1a2e/ffffff?text=No+Poster'}
                  alt={rec.title}
                  className="w-full h-[225px] object-cover rounded-lg mb-2"
                />
                <p className="text-white text-sm font-medium truncate">{rec.title}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {movie.production_companies?.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Production</h2>
          <div className="flex flex-wrap gap-6">
            {movie.production_companies.map(company => (
              <div key={company.id} className="bg-dark-100 px-4 py-2 rounded-lg">
                <p className="text-white text-sm">{company.name}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default MovieDetail
