"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"

import { API } from "../../config"
import React, { useEffect, useState } from 'react'

const LeaveSettings = ({ id }) => {
    const [earnedLeave, setEarnedLeave] = useState(null)
    const [sickLeave, setSickLeave] = useState(null)
    const [optionalLeave, setOptionalLeave] = useState(null)
    const [maternityLeave, setMaternityLeave] = useState(null)

    const [tempEarnedLeave, setTempEarnedLeave] = useState(null)
    const [tempSickLeave, setTempSickLeave] = useState(null)
    const [tempOptionalLeave, setTempOptionalLeave] = useState(null)
    const [tempMaternityLeave, setTempMaternityLeave] = useState(null)

    useEffect(() => {
        const fetchLeaveBalances = async () => {
            console.log("user-sree", id);
            console.log("get url", `${API}/leave/leave-balance/${id}`)
            const res = await fetch(`${API}/leave/leave-balance/${id}`)
            const data = await res.json()

            if (data) {
                setEarnedLeave(data.earned_leave !== undefined ? data.earned_leave : null)
                setSickLeave(data.sick_leave !== undefined ? data.sick_leave : null)
                setOptionalLeave(data.optional_leave !== undefined ? data.optional_leave : null)
                setMaternityLeave(data.maternity_leave !== undefined ? data.maternity_leave : null)
            }
        }
        fetchLeaveBalances()
    }, [id])

    const handleAddLeave = () => {
        const newLeaveBalances = {
            earned_leave: parseInt(tempEarnedLeave !== null ? tempEarnedLeave : earnedLeave),
            sick_leave: parseInt(tempSickLeave !== null ? tempSickLeave : sickLeave),
            optional_leave: parseInt(tempOptionalLeave !== null ? tempOptionalLeave : optionalLeave),
            maternity_leave: parseInt(tempMaternityLeave !== null ? tempMaternityLeave : maternityLeave)
        }

        const postData = {
            userId: parseInt(id),
            leaveBalances: newLeaveBalances
        }

        const fetchData = async () => {
            await fetch(`${API}/leave/update-leave-balance`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            })
        }
        fetchData()
        setEarnedLeave(newLeaveBalances.earned_leave)
        setSickLeave(newLeaveBalances.sick_leave)
        setOptionalLeave(newLeaveBalances.optional_leave)
        setMaternityLeave(newLeaveBalances.maternity_leave)
        alert("Leave balance updated")
    }

    return (
        <div>
            <div className='flex justify-around w-full'>
                <div className='flex flex-col gap-2'>
                    <div className='flex items-center'>
                        <p className='mr-[5px] font-bold'>Earned Leave :</p>
                        <DropdownMenu>
                            <DropdownMenuTrigger className='p-1 border-2 rounded-sm min-w-[300px] ml-2'>
                                {tempEarnedLeave !== null ? tempEarnedLeave : (earnedLeave !== null ? earnedLeave : "Select total leave")}
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className='min-w-[300px]'>
                                <DropdownMenuLabel>Number of leaves</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {[1, 2, 3, 4, 5, 6].map((value) => (
                                    <DropdownMenuItem key={value} onClick={() => setTempEarnedLeave(value)}>{value}</DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className='flex items-center'>
                        <p className='mr-[5px] font-bold'>Sick Leave :</p>
                        <DropdownMenu>
                            <DropdownMenuTrigger className='p-1 border-2 rounded-sm min-w-[300px] ml-7'>
                                {tempSickLeave !== null ? tempSickLeave : (sickLeave !== null ? sickLeave : "Select total leave")}
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className='min-w-[300px]'>
                                <DropdownMenuLabel>Number of leaves</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {[1, 2, 3, 4, 5, 6].map((value) => (
                                    <DropdownMenuItem key={value} onClick={() => setTempSickLeave(value)}>{value}</DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className='flex flex-col gap-2'>
                    <div className='flex items-center'>
                        <p className='mr-[5px] font-bold'>Optional Leaves :</p>
                        <DropdownMenu>
                            <DropdownMenuTrigger className='p-1 border-2 rounded-sm min-w-[300px] ml-2'>
                                {tempOptionalLeave !== null ? tempOptionalLeave : (optionalLeave !== null ? optionalLeave : "Select total leave")}
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className='min-w-[300px]'>
                                <DropdownMenuLabel>Number of leaves</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {[1, 2, 3].map((value) => (
                                    <DropdownMenuItem key={value} onClick={() => setTempOptionalLeave(value)}>{value}</DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className='flex items-center'>
                        <p className='mr-[5px] font-bold'>Maternity Leave :</p>
                        <DropdownMenu>
                            <DropdownMenuTrigger className='p-1 border-2 rounded-sm min-w-[300px] ml-2'>
                                {tempMaternityLeave !== null ? tempMaternityLeave : (maternityLeave !== null ? maternityLeave : "Select total leave")}
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className='min-w-[300px]'>
                                <DropdownMenuLabel>Number of leaves</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {[0, 180].map((value) => (
                                    <DropdownMenuItem key={value} onClick={() => setTempMaternityLeave(value)}>{value}</DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            <div className='flex justify-end w-full'>
                <p onClick={() => handleAddLeave()} className='p-2 w-[200px] mt-[20px] rounded-sm text-center float right-0 bg-blue-300 cursor-pointer'>Add Leaves</p>
            </div>
        </div>
    )
}

export default LeaveSettings
