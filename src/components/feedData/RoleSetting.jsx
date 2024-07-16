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

import {change_user_role, getEmp_detail_by_id} from '../../actions'
import { useSelector } from 'react-redux'
import { capitalizeWords } from '../../utils'

const RoleSetting =  () => {
    const user = useSelector(state => state.user.userDetails)
    const user_id = user.user_id
     

    useEffect( () => {
        const fetchUser = async ( ) => {
            const resData =await  getEmp_detail_by_id(user_id)
            setRole(resData.role) 
        }

        fetchUser()
    })


    const handleRole = async (str) =>{
        setRole(str)
      const userRole = {
        userId:user_id,
        newRole : str
      } 

      const res = await change_user_role(userRole)

    }
 
    const [role, setRole] = useState('Employee')
    return (
        <div>
            <div className='flex items-center '>
                <p className='mr-[5px] font-bold'>Employee Role :</p>
                <DropdownMenu>
                    <DropdownMenuTrigger className='p-1 border-2 rounded-sm min-w-[300px]'> {role !== null ? capitalizeWords(role) : "Select the role"}</DropdownMenuTrigger>
                    <DropdownMenuContent className=' min-w-[300px]'>
                        <DropdownMenuLabel>Employee Role</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleRole("admin")}>Admin</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRole("approver")}>Approver</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRole("employee")}>Employee</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}

export default RoleSetting
