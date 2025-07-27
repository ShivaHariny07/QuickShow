import React from 'react'
import HeroSection from '../components/HeroSection'
import FeaturedSection from '../components/FeaturedSection'
import TrailersSection from '../components/TrailersSection'
import MovieCard from '../components/MovieCard'
import { useAppContext } from '../context/AppContext'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const { shows } = useAppContext()
  const navigate = useNavigate()

  return (
    <>
      <HeroSection />
      <FeaturedSection />
      
      {/* Additional Movies Section */}
      <div className='px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden'>
        <div className='relative flex items-center justify-between pt-20 pb-10'>
          <p className='text-gray-300 font-medium text-lg'>More Movies</p>
          <button onClick={()=> navigate('/movies')} className='group flex items-center gap-2 text-sm text-gray-300 cursor-pointer '>
              View All 
              <ArrowRight className='group-hover:translate-x-0.5 transition w-4.5 h-4.5'/>
            </button>
        </div>

        <div className='flex flex-wrap max-sm:justify-center gap-8 mt-8'>
          {shows.slice(4, 8).map((show)=>(
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
