"use client"

import { ColumnDef } from "@tanstack/react-table"

// Asset table columns
export const column = [
    
    {
        accessorKey: "asset_type",
        header: "Asset Type",
    },
    {
        accessorKey: "asset_no",
        header: "Asset No",
    },
    {
        accessorKey: "brand_name",
        header: "Brand Name",
    },
    {
        accessorKey: "device_serial_number",
        header: "Device S.No",
    },
    {
        accessorKey: "asset_status",
        header: "Asset Status",
        cell: ({ row }) => {
            return (
                <p className='w-[80px] p-2 flex items-center justify-center text-[#DC3545] rounded-sm'>
                    {row.original.asset_status ? "Active" : "Inactive"}
                </p>
            )
        },
    },
    {
        accessorKey: "ram",
        header: "RAM",
    },
    {
        accessorKey: "rom",
        header: "ROM",
    },
    {
        accessorKey: "operational_status",
        header: "operational status",
    },
    {
        accessorKey: "comments",
        header: "Comments",
    },
]
