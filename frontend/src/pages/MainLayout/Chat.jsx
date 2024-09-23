import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedUser } from '../../redux/authSlice';
import { FaRocketchat } from 'react-icons/fa';
import Messages from '../../components/MainLayout/Messages';
import { toast } from 'react-toastify';
import axios from 'axios';
import { setMessages } from '../../redux/chatSlice.js';

const Chat = () => {
  const { user, suggestedusers, selectedUser } = useSelector(store=>store.auth);
  const { onlineUsers, messages } = useSelector(store=> store.chat);
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");

  const messageHandler = async (e, receiverId)=>{
    e.preventDefault();

    try {
      const res = await axios.post(`http://localhost:8000/api/v1/message/send/${receiverId}`, {message}, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,

      });

      if(res.data.success){
        dispatch(setMessages([...messages, res.data.newMessage]));
        setMessage("");
      }

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    return ()=>{
      dispatch(setSelectedUser(null));
    }
  }, [])

  return (
    <div className='w-full h-screen flex p-5'>
      <div className='lg:min-w-[20%] max-w-[15%]'>
        <h2 className='text-xl font-bold mb-2 text-center'>{user?.username}</h2>
        <div className='h-[1px] w-full bg-zinc-600 mb-3'></div>
        <div className='flex flex-col gap-1'>
          {
            suggestedusers?.map((suggestedUser)=>{
              const isOnline = onlineUsers.includes(suggestedUser?._id)

              return (
                <div onClick={()=> dispatch(setSelectedUser(suggestedUser))} className={`hover:bg-zinc-700 ${(selectedUser?._id === suggestedUser?._id) && "bg-zinc-700"} transition-all duration-300 rounded-md flex flex-col lg:flex-row gap-2 items-center cursor-pointer px-2 py-2`}>
                  <img className='lg:w-14 lg:h-14 w-8 h-8' src={suggestedUser?.profilePicture} alt="img" />
                  <div className='flex flex-col items-center justify-center'>
                    <p className='lg:text-lg font-bold text-sm text-center'>{suggestedUser?.username}</p>
                    <p className={`text-gray-600 leading-3 text-xs ${isOnline ? "text-green-600" : "text-red-600"}`}>{isOnline ? "Online" : "Offline"}</p>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
      <div className='flex-1'>
          {
            selectedUser ? (
              <div className='flex flex-col px-6 h-full'>
                <div>
                  <div className='flex items-center gap-5'>
                  <img className='lg:w-20 lg:h-20 w-12 h-12' src={selectedUser?.profilePicture} alt="img" />
                  <p className='lg:text-3xl font-extrabold text-xl'>{selectedUser?.username}</p>
                  </div>
                  <div className='h-[1px] w-full bg-zinc-700 mt-2'></div>
                </div>
                <Messages />
                <form className='flex sm:gap-3 items-end w-full sm:flex-row flex-col' onSubmit={(e)=> messageHandler(e, selectedUser?._id)}>
                  <input value={message} onChange={(e)=>setMessage(e.target.value)} className='bg-gray-700 w-[80%] mb-5 px-5 py-2 rounded-md outline-none' type="text" placeholder='Message...' />
                  <button className='bg-gray-700 mr-6 sm:items-end rounded-md hover:bg-gray-800 mb-5 px-5 py-2' type='submit'>Send</button>
                </form>
              </div>
            ) : (
              <div className='flex items-center justify-center w-full h-full flex-col'>
                <FaRocketchat size={60} />
                <h2 className='text-2xl font-bold'>Start Conversation</h2>
                <h3 className='text-xl font-md'>Select user to start conversation</h3>
              </div>
            )
          }
      </div>
    </div>
  )
}

export default Chat