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
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
        }
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
                    const errorData = await response.json();
                    setErrors({
                        email:"",
                        password:"Invalid email or password"
                    });
                    return;
                }

                const data = await response.json();

                dispatch(setUserDetails(data));


                if (typeof window !== 'undefined') {
                    localStorage.setItem("user_name", data.emp_name);
                    localStorage.setItem("jwt", data.token);
                    localStorage.setItem("user_id", data.user_id);
                    localStorage.setItem("emp_id", data.emp_id)
                    localStorage.setItem("user_type", data.user_role);
                    localStorage.setItem("work_email", data.email);
                    localStorage.setItem("work_email", data.work_email)
                    console.log(data)
                    const userData = {
                        user_name: data.emp_name,
                        emp_id: data.emp_id,
                        token: data.token,
                        user_id: data.user_id,
                        user_role: data.user_role,
                        work_email: data.email,
                    }
                    dispatch(setUserDetails(data));
                    console.log(userData)

                }

                if (data.user_role === 'admin' || data.user_role === 'approver') {
                    router.push('/admin/dashboard');
                } else {
                    router.push('/dashboard')
                }


            } catch (error) {
                console.error('Error:', error);
                setErrors({
                    email: "An error occurred. Please try again.",
                    password: "An error occurred. Please try again."
                });
            }
        }
    }

    return (
        <main className='overflow-hidden  bg-[#D4DBE2]' >
            <div className='h-screen flex items-center justify-center'>
                <div className=' bg-white py-5 flex items-center flex-col  rounded-[31px] w-[400px] min-h-[500px] shadow-[10px_10px_15px_rgba(0,0,0,0.1)] overflow-hidden'>


                    <div>
                        <div className="mx-7  flex justify-center bg-white">
                            <img className='w-40 min-h-30 ' src='/imgs/logo2.png' alt="Annular_logo" />
                        </div>
                        {/* <div className='flex justify-center transform -translate-y-3 mt-8'>
                        <h1 className='text-gray-600 text-2xl font-bold'>Login</h1>
                    </div> */}
                       
                    </div>

                    <div className='w-[80%] mt-[3rem] flex flex-col gap-5 relative top-2'>
                        <div>
                            <label htmlFor="" className='ml-3 mb- text-[16px] '>Username</label>
                            <input 
                                className='outline-none w-full  bg-[#F0F5F9] rounded-md border-gray-500 p-1.5 px-3' 
                                type="text" 
                                id="email" 
                                required 
                                value={loginData.email} 
                                placeholder='Enter your Email' 
                                onChange={handleChange}  
                                onKeyDown={handleKeyDown}
                            />
                            {errors.email && <p className='text-red-500 text-xs mt-1'>{errors.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="" className='ml-3 mb-2 text-[16px] '>Password</label>
                             <div className='flex items-center overflow-clip bg-[#F0F5F9] rounded-md pr-2'>
                                <input 
                                    className='outline-none  w-full bg-[#f0f5f9] p-1.5 px-3' 
                                    required  
                                    type={passwordVisible ? "text" : "password"} 
                                    id="password" 
                                    value={loginData.password} 
                                    placeholder='Enter Password' 
                                    onChange={handleChange}  
                                    onKeyDown={handleKeyDown}
                                />
                                <span className='flex  my-auto h-full items-center text-xl  text-gray-500 bg-[#F0F5F9] cursor-pointer' onClick={handlePasswordToggle}>{passwordVisible ? <IoIosEye /> : <IoIosEyeOff />}</span>
                            </div>

                        </div>
                        {errors.password && <p className='text-red-500 text-xs mt-1'>{errors.password}</p>}

                    </div>
                    <button className="bg-[#134572] mt-[4rem] text-white rounded-md h-[35px] w-[80%] text-md " onClick={handleSubmit}>Login</button>
                    
                </div>
                
            </div>
            
        </main>
    );
}

export default Signin;