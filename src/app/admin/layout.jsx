'use client'
import Navbar from '../../components/navbar'
import Sidebar from '../../components/asidebar'
import React from 'react'
import AuthRoute from '../../HOC/AuthRoute'


const Layout = ({ children }) => {

    return (
        <div className='w-full flex'>
            <Sidebar />
            <main className='w-full flex flex-col'>
                <Navbar  />
                <div className='p-5 bg-[#FBF9F9] w-full'>
                    {children}
                </div>
                 
            </main>
        </div>


    )
}


export default AuthRoute(Layout, ['admin', 'approver'] )

