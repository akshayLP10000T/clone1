import React, { useEffect } from 'react'
import SignUp from './pages/SignUp'
import LogIn from './pages/LogIn'
import Main from './pages/Main'
import Home from './pages/MainLayout/Home'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Profile from './pages/MainLayout/Profile'
import EditProfile from './components/MainLayout/EditProfile'
import Chat from './pages/MainLayout/Chat'
import { io } from 'socket.io-client'
import { useDispatch, useSelector } from 'react-redux'
import { setSocket } from './redux/socketSlice.js'
import { setOnlineUsers } from './redux/chatSlice.js';

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/:id/profile",
        element: <Profile />
      },
      {
        path: "/account/edit",
        element: <EditProfile />
      },
      {
        path: "/chat",
        element: <Chat />
      }
    ]
  },
  {
    path: "/register",
    element: <SignUp />
  },
  {
    path: "/login",
    element: <LogIn />
  }
])

const App = () => {
  const {user} = useSelector(store => store.auth);
  const { socket } = useSelector(store=>store.socketio);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const socketio = io('http://localhost:8000', {
        query: {
          userId: user?._id
        },
        withCredentials: true,
        transports: ['websocket']
      });

      dispatch(setSocket(socketio));

      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      }

    }
    else if(socket) {
      socket?.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch])

  return (
    <RouterProvider router={browserRouter} />
  )
}

export default App