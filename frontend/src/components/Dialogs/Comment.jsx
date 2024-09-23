import React from 'react'

const Comment = ({ comment }) => {
  return (
    <div className='my-2 flex items-center'>
        <img src={comment?.author?.profilePicture} alt="img" className='h-8 w-8' />
        <p className='font-bold'>{comment?.author?.username} <span className='font-normal pl-1'>{comment?.text}</span></p>
    </div>
  )
}

export default Comment