"use client"
import React, { useState, useEffect } from 'react'
 
import { Button } from '../../../../components/ui/button'

import { DataTable } from './data-table';
import { getAllTaskById } from '../../../../actions'
import { useSelector } from 'react-redux';

const Page = () => { 

    const user = useSelector(state => state.user.userDetails) 

    //date input process
    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()
    
    //data fetching on submitting date
    const [tasks, setTasks] = useState() 
    const getData = async () => { 
       const data = await getAllTaskById(user.user_id, startDate, endDate)   
       setTasks(data.tasks) 
        
    } 
    return (
        <div className='p-5 pt-2 max-h-[calc(100vh-100px)] overflow-y-auto'>
            <div className="title  ">
                <p className='text-[22px] font-bold'>Timesheet</p>
            </div>

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
            </div>

            {/* Timesheet table */}
            <div className="container mx-auto py-5">
                {
                      tasks && <DataTable  allData={tasks} userId={user.user_id} startDate={startDate} endDate={endDate}/>
                }
             
            </div>

            


        </div>
    )
}

export default Page
