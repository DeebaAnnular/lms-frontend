import Navbar from '../../components/navbar'
import Sidebar from '../../components/asidebar'
import React from 'react'


const layout = ({ children }) => {

    return (
        <div className='flex'>
            <Sidebar />
            <main className='w-full flex flex-col'>
                <Navbar  />
                <div className='h-[calc(100vh-70px)] overflow-y-auto'>
                    {children}
                </div>
                 
            </main>
        </div>


    )
}

export default layout

