'use client'
import Navbar from '../../components/navbar'
import Sidebar from '../../components/asidebar'
import React from 'react'
import AuthRoute from '../../HOC/AuthRoute'
import '../../app/globals.css';


const Layout = ({ children }) => {

    return (
<div className='h-screen w-full overflow-y-hidden custom-scrollbar'>
            <div className=' h-full w-full flex items-center justify-center ' >
                <div className='w-[20%] h-full'> <Sidebar /></div>
                <div className='w-[80%] h-full flex flex-col item-center justify-center'>
                    <div className=' h-[10%] w-full'><Navbar  /></div>
                    <div className=' h-[90%] overflow-y-scroll w-full bg-[#FBF9F9] p-5'>{children}</div>
                </div>
                </div> 

        </div>


    )
}


export default AuthRoute(Layout, ['admin', 'approver'] )

