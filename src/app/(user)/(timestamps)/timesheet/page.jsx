"use client"
import React, { useState, useEffect } from 'react'
 
import { Button } from '../../../../components/ui/button'

import { DataTable } from './data-table';
import { getAllTaskById } from '../../../../actions'

const Page = () => { 

    //date input process
    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()
    
    //data fetching on submitting date
    const [tasks, setTasks] = useState() 
    const getData = async () => { 
       const data = await getAllTaskById(localStorage.getItem('user_id'), startDate, endDate)   
       setTasks(data.tasks) 
        
    }
 console.log("tasks", tasks)
    return (
        <div className='p-5 pt-2'>
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
                      tasks && <DataTable  allData={tasks} userId={localStorage.getItem('user_id')} startDate={startDate} endDate={endDate}/>
                }
             
            </div>

            


        </div>
    )
}

export default Page
