import React from 'react'
import SuggestedUsers from '../../components/MainLayout/SuggestedUsers'
import { Outlet } from 'react-router-dom'
import Feed from '../../components/MainLayout/Feed'

const Home = () => {
  return (
    <div className='flex justify-between px-3 py-5 md:px-16 md:py-12'>
      <div className='flex-1'>
        <Feed />
        <Outlet />
      </div>
      <div className='hidden lg:flex'>
          <SuggestedUsers />
      </div>
    </div>
  )
}

export default Home