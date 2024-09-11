"use client"
import React, { useState, useEffect } from 'react'

import { Button } from '../../../../components/ui/button'

import { DataTable } from './data-table';
import { getAllTaskById } from '../../../../actions'
import { useSelector } from 'react-redux';
import { convertDateStringWithHifn } from '../../../../utils';

const Page = () => {

    const user = useSelector(state => state.user.userDetails)

    const [week_id, setWeek_id] = useState()
    const [from_date, setFrom_date] = useState()
    const [to_date, setTo_date] = useState()

    //data fetching on submitting date
    const [tasks, setTasks] = useState()

    const getData = async () => { 
     
        const data = await getAllTaskById(user.user_id, localStorage.getItem('from_date'), localStorage.getItem('to_date'))
        setTasks(data.tasks)
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setWeek_id(localStorage.getItem("week_id"))
            setFrom_date(localStorage.getItem('from_date'))
            setTo_date(localStorage.getItem('to_date'))
        }
        getData()
    }, [])

    return (
        <div className=' pt-2 '>
            <div className="title  mb-2 ">
                <p className='text-[18px] font-bold'>Timesheet</p>
            </div>
            {/* 
            <div className="date-inputs flex justify-between items-center mt-2">
                <div className="start-date flex items-center gap-2">
                    <p>Start Date</p>
                    <input type="date" className='w-[200px] border-2 border-gray-400 px-2 py-1 rounded-md' onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="to-date flex items-center gap-2">
                    <p>to Date</p>
                    <input type="date" className='w-[200px] border-2 border-gray-400 px-2 py-1 rounded-md' onChange={(e) => setEndDate(e.target.value)} />
                </div>
                <div className="setDate-button">
                    <Button onClick = { () => getData()}>Get Timesheet</Button>
                </div>
            </div> */}

            {/* Timesheet table */}
            <div className=" mx-auto ">
                {
                    tasks && <DataTable allData={tasks} week_Id={week_id} startDate={from_date} endDate={to_date} />
                }

            </div>




        </div>
    )
}

export default Page
