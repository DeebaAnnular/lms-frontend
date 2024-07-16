'use client'
import Navbar from '../../components/navbar'
import CSidebar from '../../components/csidebar'
import React from 'react' 

import AuthRoute from '../../HOC/AuthRoute'

const Layout = ({ children }) => {

    return (
        <div className='flex'>
            <CSidebar />
            <main className='w-full flex flex-col'>
                <Navbar />
                {children}
            </main>
        </div>


    )
}

export default AuthRoute(Layout, ['employee'] )