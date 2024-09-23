import React, { useRef, useState } from 'react'
import { BsThreeDots } from 'react-icons/bs';
import { RxCross2 } from 'react-icons/rx'
import { useDispatch, useSelector } from 'react-redux'
import { readFileAsDataUrl } from '../../utils';
import { toast } from 'react-toastify';
import axios from 'axios';
import { setPosts } from '../../redux/postSlice.js'

const CreatePost = ({ createPostDialogOpen, setCreatePostDialogOpen }) => {
  const { user } = useSelector(store => store.auth);
  const imageRef = useRef(null);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, isLoading] = useState(false);
  const dispatch = useDispatch();
  const { posts } = useSelector(store=> store.post);

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setFile(file)
      const dataURI = await readFileAsDataUrl(file);
      setSelectedImage(dataURI);
    };
  };

  const postHandler = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("caption", caption);
    if(selectedImage) data.append("image", file);

    if (loading) toast.warn("Please wait, we are processing")
    else {
      try {
        isLoading(true)
        const res = await axios.post('http://localhost:8000/api/v1/post/addpost', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        });

        if(res.data.success){
          dispatch(setPosts([res.data.post, ...posts]))
          toast.success(res.data.message);
          setCaption("");
          setFile("");
          setSelectedImage("");
          setCreatePostDialogOpen(false);
        }

      } catch (error) {
        toast.error(error.response.data.message);
      }
      finally{
        isLoading(false);
      }
    }
  }

  return (
    <div className={`fixed bg-zinc-800 w-full h-screen z-20 top-0 left-0 ${!createPostDialogOpen && "hidden"}`}>

      <div className='bg-white py-3 text-black gap-2 w-fit flex h-fit rounded-2xl -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 absolute items-center px-3 flex-col max-w-[90vw]'>
        <div className='justify-between flex items-center w-full'>
          <div className='flex items-center gap-3'>
            <img src={user?.profilePicture} className='h-10 w-10' alt="yourProfilePicture" />
            <span className='font-bold'>{user?.username}</span>
          </div>
        </div>
        <form onSubmit={(e) => postHandler(e)} className='flex flex-col items-center w-full overflow-hidden max-h-[80vh] flex-1'>
          <textarea className='md:w-96 w-full outline-none border-2 p-2 border-gray-400 rounded-md mt-2 resize-none' name="caption" id="caption" placeholder='Caption...' value={caption} onChange={(e) => setCaption(e.target.value)}></textarea>
          <input onChange={fileChangeHandler} accept='image/*' type="file" name="image" id="image" ref={imageRef} className='hidden' />
          {
            selectedImage && (
              <div className='md:max-w-[35vw] max-w-[80vw] max-h-[50vh] mt-3 flex-1 overflow-auto'>
                <img src={selectedImage} alt="img" className='object-cover rounded-md object-center' />
              </div>
            )
          }
          <span onClick={() => imageRef.current.click()} className='bg-gray-300 leading-4 text-center w-full cursor-pointer py-2 mt-3 rounded-full hover:bg-gray-400 duration-300 transition-all'>Click here to select image</span>
          {
            selectedImage && <button onClick={(e) => postHandler(e)} className='bg-zinc-700 text-white w-full mt-3 py-1 rounded-md' type='submit'>{loading ? "Please Wait..." : "Post"}</button>
          }
        </form>
      </div>
      <RxCross2 color='#fff' size={40} className='absolute right-0 top-0 m-3 cursor-pointer' onClick={() => setCreatePostDialogOpen(!createPostDialogOpen)} />
    </div>
  )
}

export default CreatePost