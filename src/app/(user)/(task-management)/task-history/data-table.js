"use client";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../../../components/ui/table";

import { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { convertDateStringWithHifn } from "../../../../utils";
import { useRouter } from 'next/navigation';

export function DataTable({ data, userId }) {
    const router = useRouter();
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);

    // Filter data by user ID
    const filteredData = data.filter(item => item.user_id === parseInt(userId));

    const handleClick = (row) => {
        console.log("invoked");
         if (typeof window !== 'undefined') {
            console.log("Setting local storage values...");
            localStorage.setItem("from_date", convertDateStringWithHifn(row.original.from_date));
            localStorage.setItem("to_date", convertDateStringWithHifn(row.original.to_date));
            localStorage.setItem("week_id", row.original.week_id);
             
        } 
            router.replace('/viewreport');
         
    };

    const columns = [
        {
            accessorKey: "week_id",
            header: "Week ID",
        },
        {
            accessorKey: "user_name",
            header: "User Name",
        },
        {
            accessorKey: "from_date",
            header: "From Date",
            cell: ({ row }) => {
                return <p>{new Date(row.original.from_date).toLocaleDateString()}</p>;
            },
        },
        {
            accessorKey: "to_date",
            header: "To Date",
            cell: ({ row }) => {
                return <p>{new Date(row.original.to_date).toLocaleDateString()}</p>;
            },
        },
        {
            header: "View Report",
            cell: ({ row }) => (
                <Button type="submit" onClick={() => handleClick(row)}>
                    View Report
                </Button>
            ),
        },
    ];

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
        globalFilterFn: (row, columnId, value) => {
            return row.getValue("user_name").toLowerCase().includes(value.toLowerCase());
        },
    });

    return (
        <div className="w-full">
            <div className="rounded-md border min-h-[380px] relative overflow-clip shadow-xl">
                <Table>
                    <TableHeader className="bg-blue-300 text-black">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="text-black">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
