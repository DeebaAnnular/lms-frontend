"use client"
import React, { useEffect, useState } from 'react'
import { getWeeklyStatus } from '../../../../actions'
import { DataTable } from './data-table'
import { useSelector } from 'react-redux'

const Page = () => {
    const user =useSelector(state => state.user.userDetails)
    
    const [allStatus, setAllStatus] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const response = await getWeeklyStatus()
            const allStatuses = await response.weeklyStatuses
            setAllStatus(allStatuses)
        }
        fetchData()
    }, [])

 

    return (
        <div className='p-5 pt-3 max-h-[calc(100vh-100px)] overflow-y-auto'>
            <h1 className='text-2xl font-bold'>Weekly Status</h1>
            {/* You can render currUserStatus here */}
            <div className="container mx-auto py-5">
                {

                     <DataTable data={allStatus} userId = {user.user_id} />
                }

            </div>
        </div>
    )
}

export default Page
