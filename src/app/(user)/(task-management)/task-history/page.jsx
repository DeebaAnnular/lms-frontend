"use client" 
 
 import React, { useEffect, useState } from 'react'
import { getWeeklyStatus } from '../../../../actions'
import { DataTable } from './data-table'
import { useSelector } from 'react-redux'

const Page = () => {
    const user = useSelector(state => state.user.userDetails)
    const [currUserStatus, setCurrUserStatus] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const response = await getWeeklyStatus()
            const allStatuses = response.weeklyStatuses
            setCurrUserStatus(allStatuses.filter(status => status.user_id === user.user_id))
        }
        fetchData()
    }, [])

    return (
        <div className='p-5 pt-3'>
            <h1 className='text-2xl font-bold'>Weekly Status</h1>
            <div className="container mx-auto py-5">
                <DataTable allData={currUserStatus} userId={user.user_id} />
            </div>
        </div>
    )
}

export default Page
