"use client"

import { useEffect, useState } from 'react';
import { getEmp_detail, getEmp_detail_by_id, getLeave_history_by_id } from '../../../actions/index';
import LeaveHistoryOfUser from '../../../components/leave-history-of-user/LeaveHistoryOfUser'

const page = () => {


    const user_id = localStorage.getItem("user_id") || null
    const [resData, setResData] = useState([]) 

    useEffect(() => {
        const fetchData = async () => { 
            const resData = await getEmp_detail_by_id(user_id) 
            setResData(resData)
        };

        fetchData();
    }, []);


    const user = resData[0]
    console.log("after")
    console.log(user)

    const date_of_joining = user?.date_of_joining.split(':')[0]
    return (
        <div className="content-sextion w-full flex gap-5 flex-col p-5 h-[calc(100vh-70px)] overflow-x-auto overscroll-y-none">

            <div className="personal-data w-full bg-white rounded-md px-5 py-3 shadow-md" style={{ backgroundColor: 'rgb(247, 249, 253)' }}>


                <div className='flex gap-5 '>

                     <div className='flex flex-row w-full justify-around'>
                        <div className='h-full flex flex-col  '>
                            <p className='pb-[10px]'> <span className='font-bold'>Emp Id :</span>  {user?.emp_id}</p>
                            <p className='pb-[10px]'> <span className='font-bold'>Name :</span>  {user?.emp_name}</p>
                            <p className='pb-[10px]'> <span className='font-bold'>Gender :</span>  {user?.gender}</p>


                        </div>
                        <div className='h-full flex flex-col '>
                            <p className='pb-[10px]'> <span className='font-bold'>Designation :</span>  {user?.designation}</p>
                            <p className='pb-[10px]'> <span className='font-bold'>Date of Joining :</span>  {date_of_joining?.split('T')[0]}</p>
                            <p className='pb-[10px]'> <span className='font-bold'>Work Location :</span>  {user?.work_location}</p>
                        </div>
                        <div className='h-full flex flex-col '>
                            <p className='pb-[10px]'> <span className='font-bold'>Contact :</span>  {user?.contact_number}</p>
                            <p className='pb-[10px]'> <span className='font-bold'>Work Location :</span>  {user?.work_location}</p>
                        </div>


                    </div> 

                </div>



            </div>

            <LeaveHistoryOfUser />

        </div>

    )
}

export default page