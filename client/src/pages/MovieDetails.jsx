import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BlurCircle from '../components/BlurCircle'
import { Heart, PlayCircleIcon, StarIcon } from 'lucide-react'
import timeFormat from '../lib/timeFormat'
import DateSelect from '../components/DateSelect'
import MovieCard from '../components/MovieCard'
import Loading from '../components/Loading'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { dummyShowsData, dummyDateTimeData } from "../assets/assets"
import fallbackImage from '../assets/screenImage.svg'

const MovieDetails = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [show, setShow] = useState(null)

  const {
    shows,
    axios,
    getToken,
    user,
    fetchFavoriteMovies,
    favoriteMovies,
    image_base_url,
  } = useAppContext()

  // isFavorite derived from favoriteMovies context on every render
  const isFavorite = favoriteMovies.some(m => String(m._id) === String(id))

  const getShow = async () => {
    try {
      const { data } = await axios.get(`/api/show/${id}`)
      if (data.success && data.movie) setShow(data)
      else {
        const found = dummyShowsData.find(m => String(m._id || m.id) === String(id))
        if (found) setShow({ movie: found, dateTime: dummyDateTimeData })
      }
    } catch {
      const found = dummyShowsData.find(m => String(m._id || m.id) === String(id))
      if (found) setShow({ movie: found, dateTime: dummyDateTimeData })
    }
  }

  // Handle favorite toggle by calling backend and refreshing context
  const handleFavorite = async () => {
    if (!user) {
      toast.error("Please login to proceed")
      return
    }
    try {
      const { data } = await axios.post(
        '/api/user/update-favorite',
        { movieId: id },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      )
      if (data.success) {
        await fetchFavoriteMovies()
        toast.success(data.message)
      } else {
        toast.error(data.message || 'Failed to update favorite')
      }
    } catch {
      toast.error('Failed to update favorite')
    }
  }

  useEffect(() => { getShow() }, [id])

  const showDateTime =
    show?.dateTime && Object.keys(show?.dateTime || {}).length > 0
      ? show.dateTime
      : dummyDateTimeData

  const posterSrc =
    show?.movie?.poster_path
      ? show.movie.poster_path.startsWith('http')
        ? show.movie.poster_path
        : image_base_url + show.movie.poster_path
      : fallbackImage

  return show && show.movie ? (
    <div className='px-6 md:px-16 lg:px-40 pt-30 md:pt-50'>
      <div className='flex flex-col md:flex-row gap-8 max-w-6xl mx-auto'>
        <img
          src={posterSrc}
          alt={show.movie.title || 'Movie Poster'}
          className='max-md:mx-auto rounded-xl h-104 max-w-70 object-cover'
        />
        <div className='relative flex flex-col gap-3'>
          <BlurCircle top='-100px' left='-100px' />
          <p className='text-primary'>{show.movie.original_language?.toUpperCase() || 'ENGLISH'}</p>
          <h1 className='text-4xl font-semibold max-w-96 text-balance'>{show.movie.title}</h1>
          <div className='flex items-center gap-2 text-gray-300'>
            <StarIcon className='w-5 h-5 text-primary fill-primary' />
            {show.movie.vote_average?.toFixed(1) || 'N/A'} User Rating
          </div>
          <p className='text-gray-400 mt-2 text-sm leading-tight max-w-xl'>{show.movie.overview || ''}</p>
          <p>
            {show.movie.runtime ? timeFormat(show.movie.runtime) : 'Unknown duration'} •{' '}
            {show.movie.genres?.map((genre) => genre.name).join(', ') || 'Unknown genres'} •{' '}
            {show.movie.release_date?.split('-')[0] || 'Unknown year'}
          </p>
          <div className='flex items-center flex-wrap gap-4 mt-4'>
            <button className='flex items-center gap-2 px-7 py-3 text-sm bg-gray-800 hover:bg-gray-900 transition rounded-md font-medium cursor-pointer active:scale-95'>
              <PlayCircleIcon className='w-5 h-5' />
              Watch Trailer
            </button>
            <a
              href='#dateSelect'
              className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer active:scale-95'
            >
              Buy Tickets
            </a>
            <button
              onClick={handleFavorite}
              className='bg-gray-700 p-2.5 rounded-full transition cursor-pointer active:scale-95'
              aria-label='Toggle Favorite'
            >
              <Heart
                className={`w-5 h-5 ${isFavorite ? 'fill-primary text-primary' : ''}`}
              />
            </button>
          </div>
        </div>
      </div>

      <p className='text-lg font-medium mt-20'>Your Favorite Cast</p>
      <div className='overflow-x-auto no-scrollbar mt-8 pb-4'>
        <div className='flex items-center gap-4 w-max px-4'>
          {show.movie.casts?.slice(0, 12).map((cast, index) => (
            <div key={cast.name || index} className='flex flex-col items-center text-center'>
              <img
                src={cast.profile_path || fallbackImage}
                alt={cast.name}
                className='rounded-full h-20 md:h-20 aspect-square object-cover'
              />
              <p className='font-medium text-xs mt-3'>{cast.name}</p>
            </div>
          ))}
        </div>
      </div>

      <DateSelect dateTime={showDateTime} id={id} />

      <p className='text-lg font-medium mt-20 mb-8'>You May Also Like</p>
      <div className='flex flex-wrap max-sm:justify-center gap-8'>
        {shows.slice(0, 4).map((showItem) => {
          if (!showItem?.movie) return null
          return <MovieCard key={showItem.movie._id || showItem.movie.id} movie={showItem.movie} />
        })}
      </div>

      <div className='flex justify-center mt-20'>
        <button
          onClick={() => {
            navigate('/movies')
            scrollTo(0, 0)
          }}
          className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer'
        >
          Show more
        </button>
      </div>
    </div>
  ) : (
    <Loading />
  )
}

export default MovieDetails
