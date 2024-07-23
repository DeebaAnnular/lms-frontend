"use client"

import Image from 'next/image'
import React from 'react'

import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { FaRegCircleUser } from "react-icons/fa6";
import { capitalizeWords } from "../utils/index"

const Navbar = () => {
    const router = useRouter();
    const user = useSelector(state => state.user.userDetails)

    const handleLogout = () => {
        localStorage.clear()
        router.push('/')
    }

    return (
        <nav className='h-[70px] sticky top-0 flex gap-2 items-center justify-end px-5 w-full shadow-sm z-10 bg-[#F9F9F9] border-b-2 border-[#b6b6b650]'  >
            <div className='flex gap-4 items-center justify-center'>
                <div className='flex items-center justify-center gap-[5px]'>
                    <div className="logo h-[32px] w-[32px] ">
                         <FaRegCircleUser className='h-[32px] w-[32px] text-[#9CA3AF]' />
                    </div>
                    <div className='flex flex-col'>
                        <p className='text-[16px] font-semibold text-[#1F2937]'>{user.user_name ? capitalizeWords(user.user_name) : "user name"}</p>
                        <p className='text-[13px] text-[#6B7280]  '>{user.emp_id}</p>
                    </div>
                </div>


                <DropdownMenu>
                    <DropdownMenuTrigger style={{ outline: 0 }}>
                        <div className="logo h-[5px] w-[5px] p-2 relative object-contain">
                            <Image src='/imgs/drop-down.svg' alt='menu' layout="fill" objectFit="contain" className="h-[5px] object-contain text-[#9CA3AF]" />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>{user.work_email ? user.work_email : "Work Mail"}</DropdownMenuItem>
                        <DropdownMenuItem>Change Password</DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

        </nav>
    )
}

export default Navbar
