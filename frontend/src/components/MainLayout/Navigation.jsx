import React, { useState } from 'react'
import { RiMenu3Fill } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import { FaHome, FaSearch, FaCompass, FaHeart, FaRocketchat, FaPlus } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '../../redux/authSlice';
import CreatePost from '../../pages/MainLayout/CreatePost';
import { setPosts, setSelectedPost } from '../../redux/postSlice';

const Navigation = () => {
  const { user } = useSelector(store => store.auth);
  const [open, setOpen] = useState(false);
  const [createPostDialogOpen, setCreatePostDialogOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const navigationItems = [
    {
      icon: <FaHome size={25} />,
      text: "Home",
    },
    {
      icon: <FaSearch size={25} />,
      text: "Search",
    },
    {
      icon: <FaCompass size={25} />,
      text: "Explore,"
    },
    {
      icon: <FaRocketchat size={25} />,
      text: "Messages",
    },
    {
      icon: <FaHeart />,
      text: "Notifications",
    },
    {
      icon: <FaPlus size={25} />,
      text: "Create",
    },
    {
      icon: <img className='h-10' src={user?.profilePicture} alt="yourProfile" />,
      text: "Profile",
    },
    {
      icon: <MdLogout size={25} />,
      text: "Log out",
    }
  ]

  const logOutHandler = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/v1/user/logout', {
        withCredentials: true
      });

      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setPosts(null));
        dispatch(setSelectedPost(null));
        navigate("/login", {
          replace: true,
        });

        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  const navigationHanler = (text) => {
    if (text === "Home"){ setOpen(false); navigate("/")}
    else if (text === "Create"){ setOpen(false); setCreatePostDialogOpen(true)}
    else if (text === "Profile"){ setOpen(false); navigate(`/${user?._id}/profile`)}
    else if (text === "Log out") logOutHandler()
    else if (text === "Messages"){ setOpen(false); navigate("/chat")}
  }

  return (
    <>
      <div className={`bottom-0 right-0 overflow-hidden fixed`}>
        <div className={`cursor-pointer bg-gray-300 p-2 rounded-t-full rounded-bl-full m-9 ${open && "hidden"} absolute bottom-0 right-0 ${!open && "z-50"}`}>
          <RiMenu3Fill onClick={() => setOpen(!open)} size={40} color='#000' />
        </div>
        <div className={`bg-gray-300 max-w-[40vw] m-9 p-2 rounded-t-full rounded-bl-full transition-all duration-700 ${!open && "ml-[100%] h-40"} text-black`}>
          <div className='flex flex-wrap relative flex-col items-center'>
            {
              navigationItems.map((item, index) => {
                return (
                  <div onClick={() => navigationHanler(item.text)} key={index} className='flex flex-wrap items-center justify-center flex-col gap-1 cursor-pointer hover:bg-gray-400 p-1 rounded-xl transition-all duration-500'>
                    {item.icon}
                    <span className='md:text-lg'>{item.text}</span>
                  </div>
                )
              })
            }
            <RxCross2 className='cursor-pointer hover:bg-zinc-400 transition-all duration-500 rounded-md' onClick={() => setOpen(!open)} size={40} color='#000' />
          </div>
        </div>
      </div>

      <div className={`${!createPostDialogOpen && "hidden"}`}>
        <CreatePost createPostDialogOpen={createPostDialogOpen} setCreatePostDialogOpen={setCreatePostDialogOpen} />
      </div>
    </>

  )
}

export default Navigation