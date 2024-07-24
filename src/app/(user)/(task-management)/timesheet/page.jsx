"use client";
import React, { useState } from 'react';
import { Button } from '../../../../components/ui/button';
import { DataTable } from './data-table';
import { getAllTaskById } from '../../../../actions';
import { useSelector } from 'react-redux';

const Page = () => {
    const user = useSelector(state => state.user.userDetails);

    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();

    const [tasks, setTasks] = useState();
    const getData = async () => {
        const data = await getAllTaskById(user.user_id, startDate, endDate);
        setTasks(data.tasks);
    };

    return (

        <div  className=' overflow-hidden  bg-[#F9F9F9]' >

            <div className='bg-white p-3 rounded-none'>
                <div className='mt-4 '>
                    {/* date inputs */}
                    <div className="flex  justify-between items-center">
                        <div className='flex gap-2 '>
                            <div className=" active:border-none flex items-center gap-2">
                                <p className='text-[15px] font-medium'>Start Date : </p>
                                <input
                                    type="date"
                                    className='w-[180px] text-[#99A0B0] px-4 py-2 border'
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                            <div className="  flex items-center gap-2">
                                <p className='text-[15px] font-medium'>To Date : </p>
                                <input
                                    type="date"
                                    className='w-[180px] border text-[#99A0B0] text-date_color px-4 py-2'
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="setDate-button">
                            <Button
                                onClick={getData}
                                className="bg-[#A6C4F0]  font-bolder font-sans text-[15px] py-2 px-6 text-black"
                            >
                                Get Timesheet
                            </Button>
                        </div>
                    </div>

                    <div className=" mx-auto py-5 px-0 ">
                        {tasks && <DataTable allData={tasks} userId={user.user_id} startDate={startDate} endDate={endDate} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;
