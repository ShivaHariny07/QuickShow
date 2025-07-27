import React from 'react'
import HeroSection from '../components/HeroSection'
import FeaturedSection from '../components/FeaturedSection'
import TrailersSection from '../components/TrailersSection'
import MovieCard from '../components/MovieCard'

const Home = () => {
  return (
    <>
      <HeroSection />
      <MovieCard />
      <FeaturedSection />
      <TrailersSection />
    </>
  )
}

export default Home
