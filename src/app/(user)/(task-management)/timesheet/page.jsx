"use client";
import React, { useState } from 'react';
import { Button } from '../../../../components/ui/button';
import { DataTable } from './data-table';
import { getAllTaskById } from '../../../../actions';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Page = () => {
    const user = useSelector(state => state.user.userDetails);

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [tasks, setTasks] = useState([]);

    const getData = async () => {
        if (startDate && endDate) {
            const data = await getAllTaskById(user.user_id, startDate, endDate);
            setTasks(data.tasks);
        }
    };

    const handleDateChange = (e, type) => {
        const date = e.target.value;
        const regex = /^\d{4}-\d{2}-\d{2}$/; // Format YYYY-MM-DD
        const year = date.split('-')[0]; // Extract the year

        if (regex.test(date) && year.length === 4) { // Check if year is 4 digits
            if (type === 'start') {
                setStartDate(date);
            } else if (type === 'end') {
                setEndDate(date);
            }
        }
    };

    return (
        <div className='overflow-hidden bg-[#F9F9F9]'>
            <ToastContainer />
            <div className='bg-white p-3 rounded-none'>
                <div className='mt-4'>
                    <div className="flex justify-between items-center">
                        <div className='flex gap-2'>
                            <div className="active:border-none flex items-center gap-2">
                                <p className='text-[15px] font-medium'>Start Date:</p>
                                <input
                                    type="date"
                                    className='w-[180px] text-[#99A0B0] px-4 py-2 border'
                                    value={startDate}
                                    onChange={(e) => handleDateChange(e, 'start')}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <p className='text-[15px] font-medium'>To Date:</p>
                                <input
                                    type="date"
                                    className='w-[180px] border text-[#99A0B0] text-date_color px-4 py-2'
                                    value={endDate}
                                    onChange={(e) => handleDateChange(e, 'end')}
                                />
                            </div>
                        </div>

                        <div className="setDate-button">
                            <Button
                                onClick={getData}
                                className="text-white bg-[#134572] font-bolder font-sans text-[15px] py-2 px-6"
                            >
                                Get Timesheet
                            </Button>
                        </div>
                    </div>

                    <div className="mx-auto py-5 px-0">
                        {tasks.length > 0 ? (
                            <DataTable allData={tasks} userId={user.user_id} startDate={startDate} setEndDate={setEndDate} setStartDate={setStartDate} endDate={endDate} />
                        ) : (
                            <p className="text-center text-gray-500">No records found</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;