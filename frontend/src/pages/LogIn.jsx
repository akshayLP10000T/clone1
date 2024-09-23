import React from 'react'
import Welcome from '../components/LogIn/Welcome'
import Form from '../components/LogIn/Form'

const LogIn = () => {
  return (
    <div className='relative bg-zinc-900 w-full h-screen text-gray-200 flex items-center justify-center px-10 py-5'>
      <div className=' flex flex-col bg-zinc-800 px-7 py-5 rounded-md'>
        <Welcome />
        <Form />
      </div>
    </div>
  )
}

export default LogIn