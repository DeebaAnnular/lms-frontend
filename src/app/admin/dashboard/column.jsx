"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { cn } from "../../../lib/utils"



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
        accessorKey: "emp_id",
        header: "Id",
    },
    {
        accessorKey: "emp_name",
        header: "Name",
        cell: ({ row }) => {
            console.log(row.original)
            const url = row.original.user_id

            return (
                <Link href={`/admin/emp/${url}`}>{row.original.emp_name}</Link>
            )
        },
    },

    {
        accessorKey: "work_email",
        header: "company Email"
    },
    {
        accessorKey: "contact_number",
        header: "Number"
    },
    {
        accessorKey: "work_location",
        header: "Location"
    },
    {
        accessorKey: "active_status",
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
            return (

                <p className={cn(' w-[80px] p-2 flex items-center justify-center text-white rounded-sm bg-red-500', { "bg-green-500": row.original.active_status })}>{row.original.active_status ? "Active" : "Inactive"}</p>
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
