"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "../ui/button"
import { cn } from "../../lib/utils"



import Link from "next/link"

export const columns = [
    {
        accessorKey: "Index",
        header: "No",
        cell: ({ row }) => {
            return (
                <p>{row.index + 1}</p>
            )
        },
    },
    {
        accessorKey: "user_id",
        header: "Id",
    },

    {
        accessorKey: "emp_name",
        header: "Name",
        cell: ({ row }) => { 
            const url = row.original.user_id

            return (
                <Link href={`/admin/emp/${url}`}>{row.original.emp_name}</Link>
            )
        },
    },

    {
        accessorKey: "from_date",
        header: "From Date"
    },
    {
        accessorKey: "to_date",
        header: "To Date"
    },
    {
        accessorKey: "leave_type",
        header: "Leave Type"
    },
     
    {
        accessorKey: "total_days",
        header: "Total Days"
    },

    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => { 

            if (row.original.status === "pending") { 
                return (
                    <p
                        className={cn(' w-[80px] p-2 flex items-center justify-center rounded-sm text-gray-500',)}
                    >
                        Pending
                    </p>
                )
            }else if(row.original.status === "approved"){
                return (
                    <p
                        className={cn(' w-[80px] p-2 flex items-center justify-center  rounded-sm text-green-500',)}
                    >
                        Approved
                    </p>
                )
            }else{
                return (
                    <p
                        className={cn(' w-[80px] p-2 flex items-center justify-center  rounded-sm text-red-500',)}
                    >
                        Rejected
                    </p>
                )

            }

        },
    },


]



// user_id: 4,
//     emp_id: 'AT0010',
//     emp_name: 'dora',
//     gender: 'F',
//     date_of_joining: '2024-04-01T18:30:00.000Z',
//     to_date: '1234567890',
//     work_location: 'chennai',
//     active_status: 1,
//     designation: 'frontend developer',
//     personal_email: 'dora@gmail.com',
//     from_date: 'dora@annular.com',
//     created_at: '2024-06-27T04:43:36.000Z',
//     updated_at: '2024-06-27T04:43:36.000Z'
