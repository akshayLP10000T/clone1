import React, { useState } from 'react'
import { toast } from 'react-toastify';
import axios from 'axios';
import { Link, replace, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuthUser } from '../../redux/authSlice.js'

const Form = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const valueHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const loginHandler = async (e) => {
    e.preventDefault();

    setLoading(true);
    if (loading) {
      toast.success("Please Wait...");
    }

    try {
      const res = await axios.post('http://localhost:8000/api/v1/user/login', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        
        toast.success(res.data.message);
        setFormData({
          email: "",
          password: "",
        });

        navigate("/", {
          replace: true
        })
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form className='space-y-6' onSubmit={(e) => loginHandler(e)}>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-400"
          >
            Email Address
          </label>
          <input
            type="email"
            name="email"
            className="w-full px-4 py-2 mt-2 text-white bg-zinc-700 border border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500 md:px-6"
            value={formData.email}
            onChange={valueHandler}
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-400"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            className="w-full px-4 py-2 mt-2 text-white bg-zinc-700 border border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500 md:px-6"
            value={formData.password}
            onChange={valueHandler}
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-4 focus:ring-blue-500 md:px-6"
        >
          {loading ? "Please Wait..." : "Log In"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-400">
        Don't have an account?{" "}
        <Link to={"/register"} replace={true} className="text-blue-500 hover:underline">
          Create One!
        </Link>
      </p>

    </>
  )
}

export default Form