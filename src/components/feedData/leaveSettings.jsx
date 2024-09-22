"use client";
import React, { useEffect, useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { API } from "../../config";
import { RiArrowDropDownLine } from "react-icons/ri";
import { toast } from "react-toastify";

const LeaveSettings = ({ id, gender }) => {
    const [earnedLeave, setEarnedLeave] = useState(null);
    const [sickLeave, setSickLeave] = useState(null);
    const [optionalLeave, setOptionalLeave] = useState(null);
    const [maternityLeave, setMaternityLeave] = useState(null);

    const [tempEarnedLeave, setTempEarnedLeave] = useState(null);
    const [tempSickLeave, setTempSickLeave] = useState(null);
    const [tempOptionalLeave, setTempOptionalLeave] = useState(null);
    const [tempMaternityLeave, setTempMaternityLeave] = useState(null);
    const [submitname, setsubmitname] = useState("");

    useEffect(() => {
        const fetchLeaveBalances = async () => {
            const res = await fetch(`${API}/leave/leave-balance/${id}`);
            const data = await res.json();
            
            if(data.sick_leave || data.earned_leave || data.optional_leave) {
                setsubmitname("Update Leave");
            } else {
                setsubmitname("Add Leave");
            }
            if (data) {
                setEarnedLeave(data.earned_leave !== undefined ? parseFloat(data.earned_leave) : null);
                setSickLeave(data.sick_leave !== undefined ? parseFloat(data.sick_leave) : null);
                setOptionalLeave(data.optional_leave !== undefined ? parseFloat(data.optional_leave) : null);
                setMaternityLeave(data.maternity_leave !== undefined ? parseFloat(data.maternity_leave) : null);
            }
        };
        fetchLeaveBalances(); 
    }, []);

    const handleAddLeave = () => {
        const newLeaveBalances = {
            earned_leave: parseFloat(tempEarnedLeave !== null ? tempEarnedLeave : earnedLeave),
            sick_leave: parseFloat(tempSickLeave !== null ? tempSickLeave : sickLeave),
            optional_leave: parseFloat(tempOptionalLeave !== null ? tempOptionalLeave : optionalLeave),
            maternity_leave: parseFloat(tempMaternityLeave !== null ? tempMaternityLeave : maternityLeave),
        };

        const postData = {
            userId: parseInt(id),
            leaveBalances: newLeaveBalances,
        };

        const fetchData = async () => {
            await fetch(`${API}/leave/update-leave-balance`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });
        };
        fetchData();
        setEarnedLeave(newLeaveBalances.earned_leave);
        setSickLeave(newLeaveBalances.sick_leave);
        setOptionalLeave(newLeaveBalances.optional_leave);
        setMaternityLeave(newLeaveBalances.maternity_leave);

        const fetchLeaveBalancess = async () => {
            const res = await fetch(`${API}/leave/leave-balance/${id}`);
            const data = await res.json();

            if(data.sick_leave || data.earned_leave || data.optional_leave) {
                toast.success("Leave balance updated successfully");
            } else {
                setsubmitname("Update Leave");
                toast.success("Leave allocated successfully")
            }
        }
        fetchLeaveBalancess();
    };

    const formatValue = (value) => {
        return value !== null ? parseFloat(value).toFixed(1) : "Select";
    };

    const renderDropdown = (value, tempValue, setter, options) => (
        <DropdownMenu>
            <DropdownMenuTrigger className='w-[40] h-full flex items-center justify-between'>
                <span className="text-sm">
                    {formatValue(tempValue !== null ? tempValue : value)}
                </span>
                <RiArrowDropDownLine />
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-full'>
                <DropdownMenuSeparator />
                {options.map((optionValue) => (
                    <DropdownMenuItem key={optionValue} onClick={() => setter(optionValue)}>
                        <div className='flex justify-between items-center w-full'>
                            <span>{optionValue.toFixed(1)}</span>
                        </div>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );

    return (
        <div className='w-full'>
            <div className='flex gap-9 overflow-x-auto mb-5 ml-6'>
                <div className='flex flex-col items-center w-full'>
                    <div className='p-1 border-2 rounded-sm w-full h-[85px] flex flex-col items-center justify-center'>
                        <p className='mb-2 text-sm'>Earned Leave</p>
                        {renderDropdown(earnedLeave, tempEarnedLeave, setTempEarnedLeave, [0, 1, 2, 3, 4, 5, 6])}
                    </div>
                </div>

                <div className='flex flex-col items-center w-full'>
                    <div className='p-1 border-2 rounded-sm w-full h-[85px] flex flex-col items-center justify-center'>
                        <p className='mb-2 text-sm'>Sick Leave</p>
                        {renderDropdown(sickLeave, tempSickLeave, setTempSickLeave, [0, 1, 2, 3, 4, 5, 6])}
                    </div>
                </div>

                <div className='flex flex-col items-center w-full'>
                    <div className='p-1 border-2 rounded-sm w-full h-[85px] flex flex-col items-center justify-center'>
                        <p className='mb-2 text-sm'>Optional Holiday</p>
                        {renderDropdown(optionalLeave, tempOptionalLeave, setTempOptionalLeave, [0, 1, 2, 3])}
                    </div>
                </div>

                {gender === 'F' && (
                    <div className='flex flex-col items-center w-full'>
                        <div className='p-1 border-2 rounded-sm w-full h-[85px] flex flex-col items-center justify-center'>
                            <p className='mb-2 text-sm'>Maternity Leave</p>
                            {renderDropdown(maternityLeave, tempMaternityLeave, setTempMaternityLeave, [0, 180])}
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-white relative flex flex-col items-end">
                <div className='mt-3 ml-3'>
                    <button className='bg-[#134572] hover:text-[#A6C4F0] hover:bg-[#134572] w-[200px] h-[40px] mt-7 px-[20px] py-[10px] text-white text-[14px] font-bold rounded-[5px] border-none cursor-pointer' onClick={handleAddLeave}>
                        {submitname}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LeaveSettings;