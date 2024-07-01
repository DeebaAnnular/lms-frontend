"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../../src/components/ui/dropdown-menu"

import { API } from "../config"
import React, { useEffect, useState } from 'react'

const LeaveSettings = ({ id }) => {
    const [earnedLeave, setEarnedLeave] = useState(null)
    const [sickLeave, setSickLeave] = useState(null)
    const [optionalLeave, setOptionalLeave] = useState(null)
    const [maternityLeave, setMaternityLeave] = useState(null)

    const [leaveBalances, setLeaveBalances] = useState({})

    const handleAddLeave = () => {
        const newLeaveBalances = {
            earned_leave: parseInt(earnedLeave),
            sick_leave: parseInt(sickLeave),
            optional_leave: parseInt(optionalLeave),
            maternity_leave: parseInt(maternityLeave)
        }

        setLeaveBalances(newLeaveBalances)

        const postData = {
            userId: parseInt(id),
            leaveBalances: newLeaveBalances
        }

        const fetchData = async () => {
            const res = await fetch(`${API}/leave/update-leave-balance`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            }) 
        }
        fetchData()
        setEarnedLeave(null)
        setSickLeave(null)
        setOptionalLeave(null)
        setMaternityLeave(null)
        alert("Leave balance updated")
    }

    return (
        <div>
            <div className='flex justify-around w-full'>
                <div className='flex flex-col gap-2'>
                    <div className='flex items-center '>
                        <p className='mr-[5px] font-bold'>Earned Leave :</p>
                        <DropdownMenu>
                            <DropdownMenuTrigger className='p-1 border-2 rounded-sm min-w-[300px]'>{earnedLeave !== null ? earnedLeave : "Select total leave"}</DropdownMenuTrigger>
                            <DropdownMenuContent className=' min-w-[300px]'>
                                <DropdownMenuLabel>Number of leaves</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setEarnedLeave(1)}>1</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setEarnedLeave(2)}>2</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setEarnedLeave(3)}>3</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setEarnedLeave(4)}>4</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setEarnedLeave(5)}>5</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setEarnedLeave(6)}>6</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className='flex items-center '>
                        <p className='mr-[5px] font-bold'>Sick Leave :</p>
                        <DropdownMenu>
                            <DropdownMenuTrigger className='p-1 border-2 rounded-sm min-w-[300px]'>{sickLeave !== null ? sickLeave : "Select total leave"}</DropdownMenuTrigger>
                            <DropdownMenuContent className=' min-w-[300px]'>
                                <DropdownMenuLabel>Number of leaves</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setSickLeave(1)}>1</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSickLeave(2)}>2</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSickLeave(3)}>3</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSickLeave(4)}>4</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSickLeave(5)}>5</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSickLeave(6)}>6</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className='flex flex-col gap-2'>
                    <div className='flex items-center '>
                        <p className='mr-[5px] font-bold'>Optional Leaves :</p>
                        <DropdownMenu>
                            <DropdownMenuTrigger className='p-1 border-2 rounded-sm min-w-[300px]'>{optionalLeave !== null ? optionalLeave : "Select total leave"}</DropdownMenuTrigger>
                            <DropdownMenuContent className=' min-w-[300px]'>
                                <DropdownMenuLabel>Number of leaves</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setOptionalLeave(1)}>1</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setOptionalLeave(2)}>2</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setOptionalLeave(3)}>3</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className='flex items-center '>
                        <p className='mr-[5px] font-bold'>Maternity Leave :</p>
                        <DropdownMenu>
                            <DropdownMenuTrigger className='p-1 border-2 rounded-sm min-w-[300px]'>{maternityLeave !== null ? maternityLeave : "Select total leave"}</DropdownMenuTrigger>
                            <DropdownMenuContent className=' min-w-[300px]'>
                                <DropdownMenuLabel>Number of leaves</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setMaternityLeave(0)}>0</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setMaternityLeave(180)}>180</DropdownMenuItem>
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
