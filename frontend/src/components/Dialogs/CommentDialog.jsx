import React from 'react'
import { BsThreeDots } from 'react-icons/bs'
import { RxCross2 } from 'react-icons/rx'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Comment from './Comment'

const CommentDialog = ({ data }) => {
  const { selectedPost } = useSelector(store=>store.post)

  return (
    <div className={`bg-zinc-800 w-full h-screen top-0 left-0 ${!data.showCommentDialog && "hidden"} fixed`}>
      <div className='bg-white text-black gap-2 w-[80vw] md:max-h-[50vh] max-h-[90vh] flex flex-col h-fit overflow-hidden rounded-2xl -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 absolute items-center'>
        <div className='flex justify-between gap-5 w-full md:max-h-[50vh] max-h-[90vh] flex-col md:flex-row'>
          <img className='flex-1 object-cover object-center md:max-h-[50vh] max-h-[40vh]' src={selectedPost?.image} alt="img" />
          <div className='py-2 md:pr-5 px-5 flex-1 w-full overflow-y-auto flex flex-col h-full'>
            <div className='flex-1'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <Link to={"/"}>
                    <img src={selectedPost?.author?.profilePicture} className='h-14 w-14' alt="img" />
                  </Link>
                  <div>
                    <p className='leading-5'>{selectedPost?.author?.username}</p>
                    <p className='leading-5'>{selectedPost?.author?.bio}</p>
                  </div>
                </div>
                <BsThreeDots className='cursor-pointer' size={30} onClick={() => data.setShowDialog(true)} />
              </div>
              <div className='h-[1px] bg-gray-700 w-full rounded-full mt-2 shadow-md'></div>
            </div>
            <div className='overflow-y-auto max-h-[30vh]'>
              {
                selectedPost?.comments.map((comment) => {
                  return <Comment key={comment?._id} comment={comment} />
                })
              }
            </div>
            <form className='flex gap-3 items-center mt-3 flex-1' onSubmit={(e)=> data.commentHandler(e)}>
              <input
                type="text"
                placeholder='Comment...'
                className='w-full px-2 py-2 border-2 border-gray-400 rounded-md'
                name='comment'
                value={data.comment}
                onChange={(e) => data.commentChangeHandler(e)}
              />
              {
                data.comment && <button type='submit' className='border-2 h-fit py-2 border-gray-400 rounded-md px-4 hover:bg-gray-400 transition-all duration-200'>Post</button>
              }
            </form>
          </div>
        </div>
      </div>
      <RxCross2 color='#fff' size={45} className='absolute right-0 top-0 m-3 cursor-pointer' onClick={() => data.setShowCommentDialog(!data.showCommentDialog)} />
    </div>
  )
}

export default CommentDialog