import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import GetAllMessages from '../../hooks/GetAllMessages'

const Messages = () => {
    GetAllMessages();
    const { selectedUser } = useSelector(store => store.auth);
    const { messages } = useSelector(store=>store.chat);

    return (
        <div className='overflow-y-auto flex-1 p-4'>
            <div className='flex justify-center'>
                <div className='flex flex-col items-center justify-center'>

                    <img className='w-9 h-9' src={selectedUser?.profilePicture} alt="img" />
                    <span className='text-lg'>{selectedUser?.username}</span>
                    <Link className='bg-gray-600 px-5 py-2 rounded-md hover:bg-gray-700'>View Profile</Link>
                </div>
            </div>

            <div className='flex flex-col gap-3 mt-2'>
                {
                    messages && messages.map((message) => {
                        return (
                            <div className={`flex`} key={message?._id}>
                                <div>
                                    
                                </div>
                            </div>
                        )
                    })
                }
            </div>

        </div>
    )
}

export default Messages