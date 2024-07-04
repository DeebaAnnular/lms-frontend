"use client"

import React, { useActionState, useEffect, useState } from 'react';
import LeaveForm from '../../../components/leave-form';

import { getEmp_leave_balence } from '../../../actions';

const Page = () => {

    const [leave_balence, setLeave_balence] = useState([])
    console.log(leave_balence)
    
    const fetchLeaveBalanceById = async () => {
        const resData = await getEmp_leave_balence(localStorage.getItem("user_id") || null)
        setLeave_balence([resData])
    }

    useEffect(() => {
        // const fetchData = async () => {
        //     const resData = await getEmp_leave_balence(localStorage.getItem("user_id") || null)
        //     setLeave_balence([resData])
        // }
        fetchLeaveBalanceById ()
    }, [])



    return (

        <div className='apply-leave-container w-full p-10'>
            <div className="leave-balance-cards flex items-center justify-between gap-3">
                {leave_balence.map((item, index) => {

                    return (
                        <div key={index} className='flex w-full gap-4 justify-between w-fll'>
                            <div className="border-2  flex-1 flex flex-col rounded-md shadow-sm items-center p-2 mb-4">
                                <p className='text-[30px]'>{item.sick_leave}</p>
                                <p>Sick Leave</p>
                            </div>
                            <div className="border-2  flex-1 flex flex-col rounded-md shadow-sm items-center p-2 mb-4">
                                <p className='text-[30px]'>{item.earned_leave}</p>
                                <p>Earned Leave</p>
                            </div>
                            <div className="border-2  flex-1 flex flex-col rounded-md shadow-sm items-center p-2 mb-4">
                                <p className='text-[30px]'>{item.optional_leave}</p>
                                <p>Optional Leave</p>
                            </div>
                        </div>


                    );
                })}
            </div>
            <div className="form-container w-full border-2 p-4 rounded-md shadow-lg">
                <p className='text-2xl font-bold mb-6'>Leave Application</p>
                <LeaveForm fetchLeaveBalanceById  = {fetchLeaveBalanceById } />
            </div>
        </div>
    );
};

export default Page;
