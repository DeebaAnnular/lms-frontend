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
    const [startDateError, setStartDateError] = useState('');
    const [endDateError, setEndDateError] = useState('');

    const [tasks, setTasks] = useState([]);

    const getData = async () => {
        let valid = true;

        // Reset error messages
        setStartDateError('');
        setEndDateError('');

        // Validate start date
        if (!startDate) {
            setStartDateError('Start date is required.');
            valid = false;
        }

        // Validate end date
        if (!endDate) {
            setEndDateError('End date is required.');
            valid = false;
        }

        // If both dates are valid, fetch data
        if (valid) {
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
                                <p className='text-[15px] font-medium'>Start Date:</p>
                                <input
                                    type="date"
                                    className='w-[180px] text-[#99A0B0] px-4 py-2 border'
                                    value={startDate}
                                    onChange={(e) => handleDateChange(e, 'start')}
                                />
                            </div>
                            {startDateError && <p className="text-red-500 text-sm">{startDateError}</p>} {/* Error message for start date */}
                        </div>

                        <div className='flex flex-col gap-2'>
                            <div className="flex items-center gap-2">
                                <p className='text-[15px] font-medium'>To Date:</p>
                                <input
                                    type="date"
                                    className='w-[180px] border text-[#99A0B0] text-date_color px-4 py-2'
                                    value={endDate}
                                    onChange={(e) => handleDateChange(e, 'end')}
                                />
                            </div>
                            {endDateError && <p className="text-red-500 text-sm">{endDateError}</p>} {/* Error message for end date */}
                        </div>

                        <div className="setDate-button mt-6">
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
