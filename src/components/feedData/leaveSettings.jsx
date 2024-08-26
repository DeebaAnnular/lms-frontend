"use client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { API } from "../../config";
import React, { useEffect, useState } from 'react';
import { RiArrowDropDownLine } from "react-icons/ri";
import { toast,ToastContainer } from "react-toastify";


const LeaveSettings = ({ id, gender }) => {
    const [earnedLeave, setEarnedLeave] = useState(null);
    const [sickLeave, setSickLeave] = useState(null);
    const [optionalLeave, setOptionalLeave] = useState(null);
    const [maternityLeave, setMaternityLeave] = useState(null);

    const [tempEarnedLeave, setTempEarnedLeave] = useState(null);
    const [tempSickLeave, setTempSickLeave] = useState(null);
    const [tempOptionalLeave, setTempOptionalLeave] = useState(null);
    const [tempMaternityLeave, setTempMaternityLeave] = useState(null);

    useEffect(() => {
        const fetchLeaveBalances = async () => {
            const res = await fetch(`${API}/leave/leave-balance/${id}`);
            const data = await res.json();

            if (data) {
                setEarnedLeave(data.earned_leave !== undefined ? data.earned_leave : null);
                setSickLeave(data.sick_leave !== undefined ? data.sick_leave : null);
                setOptionalLeave(data.optional_leave !== undefined ? data.optional_leave : null);
                setMaternityLeave(data.maternity_leave !== undefined ? data.maternity_leave : null);
            }
        };
        fetchLeaveBalances();
    }, []);

    const handleAddLeave = () => {
        const newLeaveBalances = {
            earned_leave: parseInt(tempEarnedLeave !== null ? tempEarnedLeave : earnedLeave),
            sick_leave: parseInt(tempSickLeave !== null ? tempSickLeave : sickLeave),
            optional_leave: parseInt(tempOptionalLeave !== null ? tempOptionalLeave : optionalLeave),
            maternity_leave: parseInt(tempMaternityLeave !== null ? tempMaternityLeave : maternityLeave),
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
        // alert("Leave balance updated"); 

        const fetchLeaveBalancess = async () => {
            const res = await fetch(`${API}/leave/leave-balance/${id}`);
            const data = await res.json();

            if(data.sick_leave || data.earned_leave || data.optional_leave)
            {
                toast.success("Leave balance updated succesffully");
            }
            else
            {
                toast.success("Leave allocated successfully")
            }
        }
        fetchLeaveBalancess();
       
    };

    return (
        <div className='w-full'>
            <div className='flex gap-9 overflow-x-auto mb-5 ml-6'>
                <div className='flex flex-col items-center w-full'>
                    <div className='p-1 border-2 rounded-sm w-full h-[85px] flex flex-col items-center justify-center'>
                        <p className='font-bold mb-2'>Earned Leave</p>
                        <DropdownMenu>
                            <DropdownMenuTrigger className='w-[40] h-full flex items-center justify-between'>
                                <span>{tempEarnedLeave !== null ? tempEarnedLeave : (earnedLeave !== null ? earnedLeave : "Select")}</span>
                                <RiArrowDropDownLine />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className='w-full'>
                                <DropdownMenuSeparator />
                                {[0,1, 2, 3, 4, 5, 6].map((value) => (
                                    <DropdownMenuItem key={value} onClick={() => setTempEarnedLeave(value)}>
                                        <div className='flex justify-between items-center w-full'>
                                            <span>{value}</span>
                                        </div>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className='flex flex-col items-center w-full'>
                    <div className='p-1 border-2 rounded-sm w-full h-[85px] flex flex-col items-center justify-center'>
                        <p className='font-bold mb-2'>Sick Leave</p>
                        <DropdownMenu>
                            <DropdownMenuTrigger className='w-[40] h-full flex items-center justify-between'>
                                <span>{tempSickLeave !== null ? tempSickLeave : (sickLeave !== null ? sickLeave : "Select")}</span>
                                <RiArrowDropDownLine />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className='w-full'>
                                <DropdownMenuSeparator />
                                {[0,1, 2, 3, 4, 5, 6].map((value) => (
                                    <DropdownMenuItem key={value} onClick={() => setTempSickLeave(value)}>
                                        <div className='flex justify-center items-center w-full'>
                                            <span>{value}</span>
                                        </div>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className='flex flex-col items-center w-full'>
                    <div className='p-1 border-2 rounded-sm w-full h-[85px] flex flex-col items-center justify-center'>
                        <p className='font-bold mb-2'>Optional Holiday</p>
                        <DropdownMenu>
                            <DropdownMenuTrigger className='w-[40] h-full flex items-center justify-between'>
                                <span>{tempOptionalLeave !== null ? tempOptionalLeave : (optionalLeave !== null ? optionalLeave : "Select")}</span>
                                <RiArrowDropDownLine />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className='w-full'>
                                <DropdownMenuSeparator />
                                {[0,1, 2, 3].map((value) => (
                                    <DropdownMenuItem key={value} onClick={() => setTempOptionalLeave(value)}>
                                        <div className='flex justify-between items-center w-full'>
                                            <span>{value}</span>
                                        </div>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {gender === 'F' && (
                    <div className='flex flex-col items-center w-full'>
                        <div className='p-1 border-2 rounded-sm w-full h-[85px] flex flex-col items-center justify-center'>
                            <p className='font-bold mb-2'>Maternity Leave</p>
                            <DropdownMenu>
                                <DropdownMenuTrigger className='w-[40] h-full flex items-center justify-between'>
                                    <span>{tempMaternityLeave !== null ? tempMaternityLeave : (maternityLeave !== null ? maternityLeave : "Select")}</span>
                                    <RiArrowDropDownLine />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className='w-full'>
                                    <DropdownMenuSeparator />
                                    {[0,180].map((value) => (
                                        <DropdownMenuItem key={value} onClick={() => setTempMaternityLeave(value)}>
                                            <div className='flex justify-between items-center w-full'>
                                                <span>{value}</span>
                                            </div>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-white relative flex flex-col items-end">
                <div className='mt-3 ml-3'>
                    <button className='bg-[#134572] w-[213px] h-[45px] mt-7 px-[20px] py-[10px] text-white text-[16px] font-bold rounded-[5px] border-none cursor-pointer' onClick={handleAddLeave}>
                        Add Leave
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LeaveSettings;