import Navbar from '../../components/navbar'
import CSidebar from '../../components/csidebar'
import React from 'react'
import Sidebar from '../../components/Sidebar'


const layout = ({ children }) => {

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

export default layout
