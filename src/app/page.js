"use client";
import React, { useState } from 'react';
import { IoIosEyeOff, IoIosEye } from "react-icons/io";
import { useRouter } from 'next/navigation' 

//redux
import { useDispatch, useSelector } from 'react-redux';
import { setUserDetails } from '../store/slices/userSlice';
import { API } from '../config';


const Signin = () => { 
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [errors, setErrors] = useState({});
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });

    const router = useRouter(); // Initialize useRouter for client-side routing
    const dispatch = useDispatch();
    const userDetail = useSelector(state => state.user.userDetails) 

    const handlePasswordToggle = () => {
        setPasswordVisible(!passwordVisible);
    }

    const handleChange = (e) => {
        const { id, value } = e.target;
        setLoginData((prev) => ({ ...prev, [id]: value }));
    }

    const handleSubmit = async () => {
        const loginErrors = {};
        if (!loginData.email) loginErrors.email = "Email is required";
        if (!loginData.password) loginErrors.password = "Password is required";

        if (Object.keys(loginErrors).length > 0) {
            setErrors(loginErrors);
        } else {
            try {
                const response = await fetch(`${API}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(loginData)
                });
                if (!response.ok) {
                    alert("Invalid data");
                    throw new Error('Network response was not ok');
                }


                const data = await response.json(); 
                
                dispatch( setUserDetails(data)) ;

                
                if(typeof window !== 'undefined')  {
                    localStorage.setItem("user_name", data.emp_name);
                localStorage.setItem("jwt", data.token);
                localStorage.setItem("user_id", data.user_id);
                localStorage.setItem("user-role", data.user_role);
                localStorage.setItem("work_email", data.email);
                localStorage.setItem("work_email", data.work_email) 

                } 

                if (data.user_role === 'admin' || data.user_role === 'approver') { 
                    router.push('/admin/dashboard');
                } else {
                    router.push('/dashboard')
                }


            } catch (error) {
                console.error('Error:', error); 
            }
        }
    }

    return (
        <main className='overflow-hidden'>
            <div className='h-screen flex items-center justify-center'>
                <div className='border border-gray-300 rounded-xl w-[350px] h-[350px] shadow-[10px_10px_15px_rgba(0,0,0,0.1)] overflow-hidden'>
                    <div className="mx-7 my-3 flex justify-center bg-white">
                        <img className='w-30 h-20 ' src='/imgs/logo2.png' alt="Annular_logo" />
                    </div>
                    <div className='flex justify-center transform -translate-y-3 mt-8'>
                        <h1 className='text-gray-600 text-2xl font-bold'>Login</h1>
                    </div>
                    <div className='mx-7 flex flex-col relative top-2'>
                        <input className='outline-none border-b-2 border-gray-500 p-1.5' type="text" id="email" required value={loginData.email} placeholder='Enter your Email' onChange={handleChange} />
                        {errors.email && <p className='text-red-500 text-sm'>{errors.email}</p>}
                        <div className='relative'>
                            <input className='outline-none border-b-2 border-gray-500 p-1.5 my-5 w-full' required type={passwordVisible ? "text" : "password"} id="password" value={loginData.password} placeholder='Enter Password' onChange={handleChange} />
                            <span className='absolute top-1/2 right-3 text-xl -translate-y-1 text-gray-500 cursor-pointer' onClick={handlePasswordToggle}>{passwordVisible ? <IoIosEye /> : <IoIosEyeOff />}</span>
                        </div>
                        {errors.password && <p className='text-red-500 text-sm'>{errors.password}</p>}
                        <button className="bg-blue-400 h-[35px] text-md t" onClick={handleSubmit}>Login</button>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Signin;
