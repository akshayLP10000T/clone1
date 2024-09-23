import React from 'react'
import { Outlet } from 'react-router-dom'
import Navigation from '../components/MainLayout/Navigation'
import getAllPost from '../hooks/GetAllPosts'
import GetSuggestedUsers from '../hooks/GetSuggestedUsers'

const Main = () => {
  getAllPost();
  GetSuggestedUsers();

  return (
    <div className='bg-zinc-900 min-h-screen w-full overflow-x-hidden relative text-white'>
      <div>
        <Navigation />
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  )
}

export default Main