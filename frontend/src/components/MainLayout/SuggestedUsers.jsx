import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';

const SuggestedUsers = () => {
  const { user } = useSelector(store => store.auth);
  const { suggestedusers } = useSelector(store => store.auth);
  const navigate = useNavigate();

  return (
    <div className='min-w-[20vw] ml-9'>
      <div className='flex gap-2 items-center mb-10'>
        <img className='h-12 w-12' src={user?.profilePicture} alt="img" />
        <div>
          <p className='font-bold text-lg leading-4'>{user?.username}</p>
          <p className='text-gray-400'>{user?.bio || "Bio here..."}</p>
        </div>
      </div>

      <div>
        <p className='mb-2 font-bold'>Suggested for you</p>
      </div>

      <div className='flex flex-col gap-2'>
        {
          suggestedusers?.map((user) => {
            return (<div key={user?._id} className='flex justify-between items-center'>

              <div className='flex gap-2 items-center'>
                <img onClick={()=>navigate(`/${user?._id}/profile`)} className='h-12 w-12 cursor-pointer' src={user?.profilePicture} alt="img" />
                <div>
                  <p className='font-bold text-lg leading-4'>{user?.username}</p>
                  <p className='text-gray-400'>{user?.bio || "Bio here..."}</p>
                </div>
              </div>

              <button className='text-blue-500 font-extrabold'>Follow</button>
            </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default SuggestedUsers