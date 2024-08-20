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
    return (
        <div className=' pt-2  '>
          
            {/* Timesheet table */}
            <div className="container bg-white  mx-auto py-5">
                {
                      tasks &&   <DataTable  allData={tasks} />
                }
             
            </div>

            


        </div>
    )
}

export default Page
