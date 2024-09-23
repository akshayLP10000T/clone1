import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setMessages } from '../redux/chatSlice.js';
import { toast } from 'react-toastify';

const GetAllMessages = ()=>{
    const dispatch = useDispatch();
    const { selectedUser } = useSelector(store=> store.auth);

    useEffect(()=>{
        const fetchAllMessages = async ()=>{
            try {
                console.log(selectedUser?._id);
                const res = await axios.get(`http://localhost:8000/api/v1/message/all/${selectedUser?._id}`, {
                    withCredentials: true,
                });

                if(res.data.success){
                    dispatch(setMessages(res.data.messages));
                }
            } catch (error) {
                toast.error(error.response.data.message)
            }
        }

        fetchAllMessages();
    }, [dispatch, selectedUser])
};

export default GetAllMessages;