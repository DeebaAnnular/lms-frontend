"use client"
import React, { useState, useEffect } from 'react'
 


import { DataTable } from './datatable';
import { getAllTaskByIdAdmin } from '../../../actions';



const Page = () => { 

   
    const week_id=localStorage.getItem("week_id");
    const from_date=localStorage.getItem("from_date");
    const to_date=localStorage.getItem("to_date");
    
    
    //data fetching on submitting date
    const [tasks, setTasks] = useState() 

    
    const getData = async () => { 
       const data = await getAllTaskByIdAdmin(localStorage.getItem('week_id'),from_date,to_date)   
       setTasks(data.tasks) 
    }

    useEffect( () => {
        getData()
    },[])
 console.log("tasks", tasks)
    return (
        <div className='p-5 pt-2'>
            <div className="title  ">
                <p className='text-[22px] font-bold'>Timesheet</p>
            </div>

           

            {/* Timesheet table */}
            <div className="container mx-auto py-5">
                {
                      tasks &&   <DataTable  allData={tasks} />
                }
             
            </div>

            


        </div>
    )
}

export default Page
