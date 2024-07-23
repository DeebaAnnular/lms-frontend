"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "../ui/button"
import { cn } from "../../lib/utils"

import Link from "next/link"
import { capitalizeWords, replaceUnderscore } from "../../utils"

// Function to format date
const formatDate = (dateString) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

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
        accessorKey: "from_date",
        header: "From Date",
        cell: ({ row }) => {
            return (
                <p>{formatDate(row.original.from_date)}</p>
            )
        },
    },
    {
        accessorKey: "to_date",
        header: "To Date",
        cell: ({ row }) => {
            return (
                <p>{formatDate(row.original.to_date)}</p>
            )
        },
    },
    {
        accessorKey: "leave_type",
        header: "Leave Type",
        cell: ({ row }) => {
            return (
                <p>{capitalizeWords(replaceUnderscore( row.original.leave_type))}</p>
            )
        },
    },
    {
        accessorKey: "total_days",
        header: "Total Days",
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className='text-[16px] font-bold'
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
                        className={cn(' w-[80px] p-2 flex items-center justify-center rounded-sm text-gray-500')}
                    >
                        Pending
                    </p>
                )
            } else if(row.original.status === "approved") {
                return (
                    <p
                        className={cn(' w-[80px] p-2 flex items-center justify-center rounded-sm text-green-500')}
                    >
                        Approved
                    </p>
                )
            } else {
                return (
                    <p
                        className={cn(' w-[80px] p-2 flex items-center justify-center rounded-sm text-red-500')}
                    >
                        Rejected
                    </p>
                )
            }
        },
    },
]
 