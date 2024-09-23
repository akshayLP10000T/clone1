import React, { useState } from 'react'
import GetUserProfile from '../../hooks/GetUserProfile'
import { useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { FaHeart, FaComment } from "react-icons/fa";

const Profile = () => {
  const params = useParams();
  const userId = params.id;

  GetUserProfile(userId);

  const { userProfile, user } = useSelector(store => store.auth);
  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const [isFollowing, setIsFollowing] = useState(true)
  const [activeTab, setActiveTab] = useState("posts");

  const displayingPosts = activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks;

  return (
    <div className='w-full h-full p-4'>
      <div className='flex w-full items-center gap-3 justify-center flex-wrap'>
        <img className='w-32 h-32 border-8 border-zinc-700 rounded-full' src={userProfile?.profilePicture} alt="img" />
        <div>
          <p className='font-extrabold text-2xl'>{userProfile?.username}</p>
          <p className='text-gray-600'>{userProfile?.bio || "Bio here..."}</p>
        </div>
        <div>
          {
            isLoggedInUserProfile ? <div className='flex flex-wrap items-center gap-2 justify-center'>
              <Link to={"/account/edit"} className='bg-blue-500 px-4 ml-5 py-2 rounded-md hover:bg-blue-600'>Edit Profile</Link>
            </div> :
              isFollowing ? <button className='border-blue-500 px-4 ml-5 py-2 rounded-md border-2 hover:border-blue-600'>Unfollow</button> : <button className='bg-blue-500 px-4 ml-5 py-2 rounded-md hover:bg-blue-600'>Follow</button>
          }
        </div>
      </div>
      <div className='flex w-full items-center justify-center mt-6 gap-8 font-bold text-center'>
        <div>
          <p>Posts</p>
          <p>{userProfile?.posts.length}</p>
        </div>
        <div>
          <p>Following</p>
          <p>{userProfile?.following.length}</p>
        </div>
        <div>
          <p>Followers</p>
          <p>{userProfile?.followers.length}</p>
        </div>
      </div>
      <div className='w-full h-[1px] bg-gray-700 mt-3'></div>
      <div className='flex w-full justify-center text-xl gap-9 uppercase mt-2'>
        <span className={`${activeTab === "posts" && "font-bold text-blue-600"} cursor-pointer`} onClick={() => setActiveTab("posts")}>
          posts
        </span>
        <span className={`${activeTab === "saved" && "font-bold text-blue-600"} cursor-pointer`} onClick={() => setActiveTab("saved")}>
          saved
        </span>
      </div>
      <div className='grid lg:grid-cols-3 gap-6 sm:grid-cols-2'>
        {
          displayingPosts?.map((post) => {

            return (
              <div key={post?._id} className='relative group cursor-pointer'>
                <img src={post?.image} alt="img" className='rounded-sm my-2 w-full aspect-square object-cover' />
                <div className='hover:bg-black hover:opacity-40 opacity-0 transition-all duration-300 absolute w-full h-full top-0 right-0'>
                <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-6 items-center'>
                  <div className='flex gap-2 items-center'>
                    <FaHeart size={30} />
                    <span>{post?.likes.length}</span>
                  </div>
                  <div className='flex gap-2 items-center'>
                    <FaComment size={30} />
                    <span>{post?.comments.length}</span>
                  </div>
                </div>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default Profile