"use client"
import React, { useEffect, useState } from 'react'
import { getWeeklyStatus } from '../../../actions'
import { DataTable } from './data-table'


const Page = () => {
    const [allStatus, setAllStatus] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const response = await getWeeklyStatus()
            const allStatuses = await response.weeklyStatuses
            setAllStatus(allStatuses)
        }
        fetchData()
    }, [])

    console.log(allStatus)

    return (
        <div className='p-5 pt-3'>
            <h1 className='text-2xl font-bold'>Weekly Status</h1>
            {/* You can render currUserStatus here */}
            <div className="container mx-auto py-5">
                {

                    allStatus.length > 0 &&  <DataTable allData={allStatus} userId = {localStorage.getItem('user_id')} />
                }

            </div>
        </div>
    )
}

export default Page
