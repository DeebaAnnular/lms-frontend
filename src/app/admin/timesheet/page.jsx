"use client"
import React, { useEffect, useState } from 'react'
import { getWeeklyStatus } from '../../../actions'
import { DataTable } from './data-table'
import { useSelector } from 'react-redux'


const Page = () => {
    const user = useSelector(state => state.user.userDetails)
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
        <div className='w-full'>
             
            {/* You can render currUserStatus here */}
            <div className=" mx-auto">
                {

                    <DataTable allData={allStatus} userId = {user.user_id} />
                }

            </div>
        </div>
    )
}

export default Page
