import React from 'react'
import HeroSection from '../components/HeroSection'
import FeaturedSection from '../components/FeaturedSection'
import TrailersSection from '../components/TrailersSection'
import MovieCard from '../components/MovieCard'
import APITestComponent from '../components/APITestComponent'
import { useAppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const { shows } = useAppContext()
  const navigate = useNavigate()

  return (
    <>
      {/* Temporary API Test Component - Remove after testing */}
      <APITestComponent />
      
      <HeroSection />
      <FeaturedSection />
      
      {/* Additional Movies Section */}
      <div className='px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden mb-20'>
        <div className='relative flex items-center justify-between pt-20 pb-10'>
          <p className='text-gray-300 font-medium text-lg'>More Movies</p>
        </div>

        <div className='flex flex-wrap max-sm:justify-center gap-8 mt-8'>
          {shows.slice(4).map((show)=>(
              <MovieCard key={show._id} movie={show}/>
          ))}
        </div>

        <div className='flex justify-center mt-20'>
          <button onClick={()=> {navigate('/movies'); scrollTo(0,0)}}
           className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer'>Show more</button>
        </div>
      </div>

      <TrailersSection />
    </>
  )
}

export default Home
