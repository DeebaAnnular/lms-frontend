'use client'
import Navbar from '../../components/navbar'
import CSidebar from '../../components/csidebar'
import React from 'react' 

import AuthRoute from '../../HOC/AuthRoute'

const Layout = ({ children }) => {

    return (
        <div className='h-screen w-full overflow-y-hidden'>
        <div className=' h-full w-full flex items-center justify-center'>
            <div className='w-[23%] h-full'> <CSidebar /></div>
            <div className='w-[87%] h-full flex flex-col item-center justify-center'>
                <div className=' h-[10%] w-full'><Navbar  /></div>
                <div className=' h-[90%] overflow-y-scroll w-full bg-[#FBF9F9] p-5'>{children}</div>
            </div>
            </div> 

        </div>


    )
}

export default AuthRoute(Layout, ['employee'] )