import React, { useState } from 'react'
import { toast } from 'react-toastify';
import axios from 'axios'
import { Link, replace, useNavigate } from 'react-router-dom';

const Form = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: ""
  });

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const valueHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const registerHandler = async (e) => {
    e.preventDefault();

    setLoading(true);
    if (loading) {
      toast.success("Please Wait...");
    }

    try {
      const res = await axios.post('http://localhost:8000/api/v1/user/register', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          gender: ""
        });

        navigate("/login", {
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
      <form className='space-y-6' onSubmit={(e) => registerHandler(e)}>
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-400"
          >
            Username
          </label>
          <input
            type="name"
            name="username"
            className="w-full px-4 py-2 mt-2 text-white bg-zinc-700 border border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500 md:px-6"
            value={formData.username}
            onChange={valueHandler}
          />
        </div>
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
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-400"
          >
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            className="w-full px-4 py-2 mt-2 text-white bg-zinc-700 border border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500 md:px-6"
            value={formData.confirmPassword}
            onChange={valueHandler}
          />
        </div>
        <div>
          <label htmlFor="gender">Gender:</label>
          <select name="gender" value={formData.gender} onChange={valueHandler} className='text-white bg-zinc-800 ml-3 border-2 border-zinc-500 rounded-md focus:ring-zinc-500 outline-none'>
            <option value="" disabled>Select Gender</option>
            <option value="male">male</option>
            <option value="female">female</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-4 focus:ring-blue-500 md:px-6"
        >
          {loading ? "Please Wait..." : "Sign Up"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-400">
        Already have an account?{" "}
        <Link to={"/login"} replace={true} className="text-blue-500 hover:underline">
          Log in
        </Link>
      </p>

    </>
  );
}

export default Form;
