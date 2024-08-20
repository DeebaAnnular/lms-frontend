"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { cn } from "../../../lib/utils"

import {capitalizeWords} from "../../../utils/index"


import Link from "next/link"
 

export const columns = [
    {
        accessorKey: "Index",
        header: "S.No",
        cell: ({ row }) => {
            return (
                <p>{row.index + 1}</p>
            )
        },
    },
    {
        accessorKey: "emp_id",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className='text-[16px] font-bold text-[#333843]'
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Emp ID
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => { 
            const url = row.original.user_id

            return (
                <Link className="text-blue-500 " href={`/admin/emp/${url}`}>{capitalizeWords(row.original.emp_id)}</Link>
            )
        },
        // Add sorting function for emp_id
        sortingFn: (rowA, rowB) => {
            const numA = parseInt(rowA.original.emp_id.replace(/\D/g, ''), 10);
            const numB = parseInt(rowB.original.emp_id.replace(/\D/g, ''), 10);
            return numA - numB;
        },
    },
    {
        accessorKey: "emp_name",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className='text-[16px] font-bold text-[#333843]'
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Emp Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        // cell: ({ row }) => { 
        //     const url = row.original.user_id

        //     return (
        //         <Link className="text-blue-500 underline" href={`/admin/emp/${url}`}>{capitalizeWords(row.original.emp_name)}</Link>
        //     )
        // },
        // Add sorting function for emp_name
        sortingFn: (rowA, rowB) => {
            return rowA.original.emp_name.localeCompare(rowB.original.emp_name);
        },
    },

    {
        accessorKey: "work_email",
        header: "Company Email"
    },
    {
        accessorKey: "contact_number",
        header: "Contact Number"
    },
    {
        accessorKey: "work_location",
        header: "Location"
    },
    {
        accessorKey:"role",
        header:"Role"
    },
    {
        accessorKey: "active_status",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className='text-[16px] font-bold text-[#333843]'
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return (

                <p className={cn(' w-[80px] p-2 flex items-center justify-center text-[#DC3545] rounded-sm ', { "text-[#058821]": row.original.active_status })}>{row.original.active_status ? "Active" : "Inactive"}</p>
            )
        },
    },


]



// user_id: 4,
//     emp_id: 'AT0010',
//     emp_name: 'dora',
//     gender: 'F',
//     date_of_joining: '2024-04-01T18:30:00.000Z',
//     contact_number: '1234567890',
//     work_location: 'chennai',
//     active_status: 1,
//     designation: 'frontend developer',
//     personal_email: 'dora@gmail.com',
//     work_email: 'dora@annular.com',
//     created_at: '2024-06-27T04:43:36.000Z',
//     updated_at: '2024-06-27T04:43:36.000Z'