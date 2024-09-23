import React from 'react'

const Welcome = () => {
  return (
    <div className='text-center text-lg md:text-xl font-extrabold mb-5'>
      <div className='px-2 md:px-4 lg:px-6'>
        <div className='text-2xl md:text-3xl lg:text-4xl'>
          <p>Welcome back!</p>
        </div>
        <div>
          <p className='text-sm md:text-base lg:text-lg'>
            Connect, create, and explore your world. Let's get started.
          </p>
        </div>
      </div>
      <div className='h-[1px] w-full bg-zinc-700 rounded-full mt-2 shadow-xl'></div>
    </div>


  )
}

export default Welcome