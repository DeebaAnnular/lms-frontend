"use client"
import React, { useState, useEffect } from 'react'
import { getAllTask } from '../../../../actions'
import { API } from '../../../../config'
import { convertDateString } from '../../../../utils'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '../../../../components/ui/input'
import { Label } from '../../../../components/ui/label'
import { Button } from '../../../../components/ui/button'

import { DataTable } from './data-table';
import { get } from 'http'

const Page = () => { 

    //date input process
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    
    //data fetching on submitting date
    const [tasks, setTasks] = useState() 
    const getData = () => { 
        console.log("clicked")
        const fetchData = async () => {
            const res = await fetch(`${API}/task/weekly/${localStorage.getItem('user_id')}?fromDate=${startDate}&toDate=${endDate}`)  
            const data = await res.json()
            setTasks(data.tasks) 
        }
         fetchData()     
    }
 
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
                      tasks && <DataTable  data={tasks}/>
                }
             
            </div>


        </div>
    )
}

export default Page
