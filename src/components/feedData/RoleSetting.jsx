"use client"

import React, { useEffect, useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu"

const RoleSetting = () => {

    const [role, setRole] = useState('Employee')
    return (
        <div>
            <div className='flex items-center '>
                <p className='mr-[5px] font-bold'>Employee Role :</p>
                <DropdownMenu>
                    <DropdownMenuTrigger className='p-1 border-2 rounded-sm min-w-[300px]'> {role !== null ? role : "Select the role"}</DropdownMenuTrigger>
                    <DropdownMenuContent className=' min-w-[300px]'>
                        <DropdownMenuLabel>Employee Role</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setRole('Admin')}>Admin</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setRole('Approver')}>Approver</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setRole('User')}>User</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}

export default RoleSetting
