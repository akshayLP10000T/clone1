import axios from 'axios';
import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify';
import { setAuthUser } from '../../redux/authSlice';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const { user } = useSelector(store => store.auth);
  const [bio, setBio] = useState(user?.bio);
  const [username, setUsername] = useState(user?.username);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const editProfileHandler = async ()=>{
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("bio", bio);
      formData.append("username", username);

      const res = await axios.post(`http://localhost:8000/api/v1/user/profile/edit`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });

      if(res.data.success){
        const updatedData = {
          ...user,
          bio: res.data.user?.bio,
          username: res.data.user?.username,
        };

        dispatch(setAuthUser(updatedData));
        navigate(`/${user?._id}/profile`);
        toast.success(res.data.message);
      }

    } catch (error) {
    
      toast.error(error.response.data.message);
    }
    finally{
      setLoading(false);
    }
  }

  return (
    <div className='w-full h-screen flex flex-col items-center p-9 gap-12'>
      <div className='flex md:w-[70%] w-[90%] bg-gray-800 rounded-xl px-5 py-3 items-center justify-between'>
        <div className='flex gap-5 items-center'>

          <img className='h-24 w-24 border-8 border-zinc-700 rounded-full' src={user?.profilePicture} alt="img" />
          <div>
            <p className=' font-bold text-2xl'>{user?.username}</p>
            <p className='text-gray-500 font-bold text-md'>{user?.bio || "Bio here..."}</p>
          </div>
        </div>
      </div>
      <div className='md:w-[70%] w-[90%]'>
        <h2 className='text-2xl font-bold'>Personal Information</h2>
        <div className='flex flex-col gap-2 w-full'>

          <input value={username} onChange={(e)=> setUsername(e.target.value)} className='w-full bg-gray-800 px-6 py-2 rounded-md outline-none' type="text" placeholder='Username' />
          <textarea value={bio} placeholder='Bio here...' onChange={(e) => setBio(e.target.value)} className='w-full bg-gray-800 px-6 py-2 rounded-md outline-none' name="bio" id="bio"></textarea>
        </div>
      </div>
      <button onClick={editProfileHandler} className='bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-md'>{loading ? "Please Wait..." : "Submit"}</button>
    </div>
  )
}

export default EditProfile