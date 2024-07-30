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

import { change_user_role, getEmp_detail_by_id } from '../../actions'
import { useSelector } from 'react-redux'
import { capitalizeWords } from '../../utils'

const RoleSetting = () => {
    const user = useSelector(state => state.user.userDetails)
    const user_id = user.user_id

    const [role, setRole] = useState(null)

    useEffect(() => {
        const fetchUser = async () => {
            const resData = await getEmp_detail_by_id(user_id)
            setRole(resData.role || null)
        }
        fetchUser()
    }, [user_id])

    const handleRole = async (str) => {
        setRole(str)
        const userRole = {
            userId: user_id,
            newRole: str
        }
        await change_user_role(userRole)
    }

    return (
        <div className="flex flex-col gap-2 w-full">
            <label className="font-bold">User Role</label>
            <DropdownMenu className="min-w-[356px]">
                <DropdownMenuTrigger className="p-2 border rounded w-full min-w-[356px] h-[45px]">
                    {role ? capitalizeWords(role) : "Select the role"}
                    
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full min-w-[356px]">
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleRole("admin")}>Admin</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRole("approver")}>Approver</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRole("employee")}>Employee</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default RoleSetting

