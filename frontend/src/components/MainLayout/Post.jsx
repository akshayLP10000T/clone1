import React, { useState } from 'react'
import { BsThreeDots } from "react-icons/bs";
import PostDialog from '../Dialogs/PostDialog';
import { FaRegHeart, FaHeart, FaComment, FaRegBookmark } from 'react-icons/fa';
import { IoIosSend } from "react-icons/io";
import CommentDialog from '../Dialogs/CommentDialog';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import { setPosts, setSelectedPost } from '../../redux/postSlice';
import { useNavigate } from 'react-router-dom';

const Post = ({ post }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [comment, setComment] = useState("");
  const { user } = useSelector(store=>store.auth);
  const [liked, setLiked] = useState(post?.likes.includes(user?._id) || false);
  const [postLikes, setPostLikes] = useState(post?.likes.length);
  const { posts } = useSelector(store=> store.post);
  const [comments, setComments] = useState(post?.comments);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const commentChangeHandler = (e)=>{
    const text = e.target.value;
    if(text.trim()){
      setComment(text);
    }
    else{
      setComment("")
    }

  }

  const likeOrDislikeHandler = async ()=>{
    try {
      const action = liked? 'dislike' : 'like'
      const res = await axios.get(`http://localhost:8000/api/v1/post/${post?._id}/${action}`, {
        withCredentials: true,
      });
      const updatedLikes = liked ? postLikes -1 : postLikes + 1;
      
      if(res.data.success){
        const updatedPostData = posts.map(p=> {
          return p._id === post._id ? {
            ...p,
            likes: liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
          } : p
        });
        
        dispatch(setPosts(updatedPostData));
        setPostLikes(updatedLikes)
        setLiked(!liked);

        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.reponse.data.message);
    }
  }

  const commentHandler = async (e)=>{
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:8000/api/v1/post/${post?._id}/comment`, {text: comment}, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      if(res.data.success){
        const updatedCommentData = [...comments, res.data.comment];
        setComments(updatedCommentData);

        const updatedPostData = posts.map((p)=>{
          return p?._id === post?._id ? {...p, comments: updatedCommentData} : p
        });

        dispatch(setPosts(updatedPostData));
        dispatch(setSelectedPost(post));
        setComment("");
        toast.success(res.data.message)
      }

    } catch (error) {
      toast.error(error.reponse.data.message);
    }
  }

  const forCommentDialog = {
    comment: comment,
    commentChangeHandler: commentChangeHandler,
    showCommentDialog: showCommentDialog,
    setShowCommentDialog: setShowCommentDialog,
    showDialog: showDialog,
    setShowDialog: setShowDialog,
    commentHandler: commentHandler,
  }

  const navigateProfile = ()=>{
    navigate(`/${post?.author?._id}/profile`);
  }

  return (
    <>
      <div className='w-full flex flex-col gap-3 max-w-fit'>
        <div className='flex gap-2 items-center jutify-between'>
          <div className='flex gap-2 items-center flex-1 cursor-pointer' onClick={navigateProfile}>
            <img className='h-10 w-10' src={post?.author?.profilePicture} alt="img" />
            <p className='text-lg'>{post?.author?.username}</p>
            {
              (post?.author?._id === user?._id) &&
            <span className='ml-1 text-black bg-gray-200 px-2 rounded-md cursor-pointer hover:underline'>author</span>
            }
          </div>
          <div className='cursor-pointer' onClick={() => setShowDialog(!showDialog)}>
            <BsThreeDots size={30} />
          </div>
        </div>
        <div>
          <img className='rounded-md aspect-square object-cover' src={post?.image} alt="img" />
        </div>

        <div className='flex items-center justify-between'>
          <div className='flex gap-3'>
            {
              liked ? <FaHeart onClick={likeOrDislikeHandler} size={24} className='cursor-pointer text-red-500 hover:text-gray-400' /> : <FaRegHeart onClick={likeOrDislikeHandler} size={24} className='cursor-pointer hover:text-gray-400' />
            }
            
            <FaComment onClick={(e)=> {
              dispatch(setSelectedPost(post))
              setShowCommentDialog(true)
              }} size={24} className='cursor-pointer hover:text-gray-400' />
            <IoIosSend size={24} className='cursor-pointer hover:text-gray-400' />
          </div>
          <div>
            <FaRegBookmark size={24} className='cursor-pointer hover:text-gray-400' />
          </div>
        </div>
        <div>
          <span>{postLikes} likes</span>

          <p>
            <span className='font-bold'>{post?.author?.username}: </span>
            {post?.caption}
          </p>

          <span className='text-gray-400 hover:underline cursor-pointer' onClick={(e)=> {
            dispatch(setSelectedPost(post))
            setShowCommentDialog(true)
            }}>view all {comments.length} comments</span>

        </div>
        <form className='flex gap-3' onSubmit={(e)=> commentHandler(e)}>
          <input
            type="text"
            value={comment}
            onChange={(e)=> commentChangeHandler(e)}
            placeholder='Comment'
            className='bg-transparent border-2 border-gray-400 outline-gray-500 rounded-md px-4'
          />
          {
            comment && <button onClick={(e)=>commentHandler(e)} type='submit' className='border-2 border-gray-400 rounded-md px-2 hover:bg-gray-400 transition-all duration-200'>Post</button>
          }
        </form>
      </div>

      <div className={`${!showDialog && "hidden"}`}>
        <PostDialog showDialog={showDialog} setShowDialog={setShowDialog} postData={post} />
      </div>
      <div className={`${!showCommentDialog && 'hidden'}`}>
          <CommentDialog data={forCommentDialog}  />
      </div>
    </>
  )
}

export default Post