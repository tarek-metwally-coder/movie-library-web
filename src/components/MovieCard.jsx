import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const MovieCard = ({ movie:
    { id, title, vote_average, poster_path, release_date, original_language } }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
        >
            <Link to={`/movie/${id}`} className="block">
                <motion.div
                    className='movie-card'
                    whileHover={{ boxShadow: '0 8px 30px rgba(171, 139, 255, 0.15)' }}
                >
                    <img src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : '/no-movie.png'}
                        alt={title} />

                    <div className="mt-4">
                        <h3>{title}</h3>

                        <div className="content">
                            <div className="rating">
                                <img src="star.svg" alt="Star Icon" />
                                <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
                            </div>
                            <span>•</span>
                            <p className='lang'>{original_language}</p>

                            <span>•</span>
                            <p className="year">{release_date ? release_date.split('-')[0] : 'N/A'}</p>
                        </div>

                    </div>
                </motion.div>
            </Link>
        </motion.div>
    )
}

export default MovieCard
