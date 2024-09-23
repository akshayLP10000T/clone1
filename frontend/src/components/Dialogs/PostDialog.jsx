import React, { useState } from 'react'
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import { setPosts } from '../../redux/postSlice.js'

const PostDialog = ({showDialog, setShowDialog, postData}) => {
  const { user } = useSelector(store=>store.auth);
  const { posts } = useSelector(store=>store.post);
  const dispatch = useDispatch()
  const [deleting, setDeleting] = useState(false);

  const deleteHandler = async () =>{
    try {
      setDeleting(true)
      const res = await axios.delete(`http://localhost:8000/api/v1/post/delete/${postData?._id}`, {
        withCredentials: true,
      });

      if(res.data.success){
        const updatedPostData = posts.filter((postItem)=>postItem?._id !== postData?._id)
        dispatch(setPosts(updatedPostData));

        toast.success(res.data.message);
        setShowDialog(false)
      }
    } catch (error) {
        toast.error(error.response.data.message);
    }
    finally{
      setDeleting(false)
    }
  }

  return (

    <div className={`fixed bg-zinc-800 w-full h-screen z-30 top-0 left-0 ${!showDialog && "hidden"}`}>
        <div className='bg-white py-3 text-black gap-2 flex flex-col w-[80vw] h-fit rounded-2xl -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 absolute items-center'>
            <button className='text-red-600 font-bold text-2xl hover:bg-gray-200 w-fit px-6 py-2 rounded-lg transition-all duration-200'>Unfollow</button>
            <button className='hover:bg-gray-200 font-bold w-fit px-6 py-2 rounded-lg transition-all duration-200'>Add To Favourite</button>
            {
              (user?._id === postData?.author?._id) && <button onClick={deleteHandler} className='font-bold text-2xl hover:bg-gray-200 w-fit px-6 py-2 rounded-lg transition-all duration-200'>{deleting ? "Deleting..." : "Delete"}</button>
            }
            <RxCross2 color='#000' size={25} className='absolute right-0 top-0 m-3 cursor-pointer' onClick={()=>setShowDialog(!showDialog)} />
        </div>
    </div>
  )
}

export default PostDialog