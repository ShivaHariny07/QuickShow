import React from 'react'
import MovieCard from '../components/MovieCard'
import BlurCircle from '../components/BlurCircle'
import { useAppContext } from '../context/AppContext'

const Movies = () => {

  const { shows, image_base_url } = useAppContext()

  // Get the first movie's backdrop for hero section
  const featuredMovie = shows[0]

  // Handle both full URLs and relative paths for backdrop_path
  const getImageSrc = (backdropPath) => {
    if (!backdropPath) return '';
    // If it's already a full URL (starts with http), use it as is
    if (backdropPath.startsWith('http')) {
      return backdropPath;
    }
    // Otherwise, prepend the image_base_url
    return image_base_url + backdropPath;
  }

  return shows.length > 0 ? (
    <div className='relative overflow-hidden min-h-screen'>
      
      {/* Hero Section with Backdrop */}
      {featuredMovie && featuredMovie.backdrop_path && (
        <div className='relative h-96 mb-20'>
          <div 
            className='absolute inset-0 bg-cover bg-center bg-no-repeat'
            style={{
              backgroundImage: `url(${getImageSrc(featuredMovie.backdrop_path)})`,
            }}
          >
            <div className='absolute inset-0 bg-black bg-opacity-60'></div>
          </div>
          
          <div className='relative z-10 flex items-center justify-center h-full'>
            <div className='text-center text-white px-6'>
              <h1 className='text-4xl md:text-6xl font-bold mb-4'>Now Showing</h1>
              <p className='text-lg md:text-xl text-gray-200 max-w-2xl mx-auto'>
                Discover the latest movies and book your tickets for an unforgettable experience
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Movies Grid Section */}
      <div className='relative px-6 md:px-16 lg:px-40 xl:px-44 pb-60'>
        <BlurCircle top="150px" left="0px"/>
        <BlurCircle bottom="50px" right="50px"/>

        {!featuredMovie?.backdrop_path && (
          <h1 className='text-lg font-medium my-4'>Now Showing</h1>
        )}
        
        <div className='flex flex-wrap max-sm:justify-center gap-8'>
          {shows.map((movie)=> (
            <MovieCard movie={movie} key={movie._id}/>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-3xl font-bold text-center'>No movies available</h1>
    </div>
  )
}

export default Movies
