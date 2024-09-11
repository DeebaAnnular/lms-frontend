"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '../../../../components/ui/button';
import { DataTable } from './data-table';
import { getAllTaskById } from '../../../../actions';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Page = () => {
    const user = useSelector(state => state.user.userDetails);

    const getCurrentMonthDates = () => {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return {
            start: firstDay.toISOString().split('T')[0],
            end: lastDay.toISOString().split('T')[0]
        };
    };

    const currentMonthDates = getCurrentMonthDates();

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [startDateError, setStartDateError] = useState('');
    const [endDateError, setEndDateError] = useState('');
    const [tasks, setTasks] = useState([]);
    const [effectiveStartDate, setEffectiveStartDate] = useState('');
    const [effectiveEndDate, setEffectiveEndDate] = useState('');

    const getData = async () => {
        let valid = true;

        // Reset error messages
        setStartDateError('');
        setEndDateError('');

        // If startDate or endDate is empty, use current month's dates
        const start = startDate || currentMonthDates.start;
        const end = endDate || currentMonthDates.end;

        setEffectiveStartDate(start);
        setEffectiveEndDate(end);

        // Fetch data
        if (valid) {
            try {
                const data = await getAllTaskById(user.user_id, start, end);
                if (data && data.tasks.length > 0) {
                    setTasks(data.tasks);
                } else {
                    setTasks([]);
                    toast.info("No tasks found for the selected date range.");
                }
            } catch (error) {
                console.error("Error fetching tasks:", error);
                toast.error("Failed to fetch tasks. Please try again.");
                setTasks([]);
            }
        }
    };

    const handleDateChange = (e, type) => {
        const date = e.target.value;
        const regex = /^\d{4}-\d{2}-\d{2}$/; // Format YYYY-MM-DD
        const year = date.split('-')[0]; // Extract the year

        if (regex.test(date) && year.length === 4) { // Check if year is 4 digits
            if (type === 'start') {
                setStartDate(date);
                setStartDateError(''); // Clear error when a valid date is selected
            } else if (type === 'end') {
                setEndDate(date);
                setEndDateError(''); // Clear error when a valid date is selected
            }
        }
    };

    return (
        <div className='overflow-hidden bg-[#F9F9F9]'>
            <ToastContainer />
            <div className='bg-white p-3 rounded-none'>
                <div className='mt-4'>
                    <div className="flex justify-between items-start gap-4">
                        <div className='flex flex-col gap-2'>
                            <div className="active:border-none flex items-center gap-2">
                                <p className='text-[13px] font-medium'>Start Date:</p>
                                <input
                                    type="date"
                                    className='w-[180px] text-[#99A0B0] text-xs px-4 py-2 border'
                                    value={startDate}
                                    onChange={(e) => handleDateChange(e, 'start')}
                                />
                            </div>
                            {startDateError && <p className="text-red-500 text-sm">{startDateError}</p>}
                        </div>

                        <div className='flex flex-col gap-2'>
                            <div className="flex items-center gap-2">
                                <p className='text-[13px]  font-medium'>To Date:</p>
                                <input
                                    type="date"
                                    className='w-[180px] border text-xs text-[#99A0B0] text-date_color px-4 py-2'
                                    value={endDate}
                                    onChange={(e) => handleDateChange(e, 'end')}
                                />
                            </div>
                            {endDateError && <p className="text-red-500 text-sm">{endDateError}</p>}
                        </div>

                        <div className="setDate-button mt-6">
                            <Button
                                onClick={getData}
                                className="text-white hover:text-[#A6C4F0] hover:bg-[#134572] bg-[#134572] font-bolder font-sans text-[12px] py-1 px-3"
                            >
                                Get Timesheet
                            </Button>
                        </div>
                    </div>

                    <div className="mx-auto py-5 px-0">
                        {tasks.length > 0 ? (
                            <DataTable 
                                allData={tasks} 
                                userId={user.user_id} 
                                startDate={effectiveStartDate} 
                                endDate={effectiveEndDate}
                                setStartDate={setStartDate}
                                setEndDate={setEndDate}
                            />
                        ) : (
                            <p className="text-center text-sm text-gray-500">No records found</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;