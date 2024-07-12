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
} from "../../../components/ui/table";

import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { cn } from "../../../lib/utils";
import { useRouter } from "next/navigation";


import Link from "next/link";
import { convertDateStringWithHifn } from "../../../utils";



  

export function DataTable({ allData }) {
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [pagination, setPagination] = useState({
        pageSize: 5,
        pageIndex: 0,
    });

    // const dispatch = useDispatch();

    const handleClick = (week_id,emp_id,from_date, to_date) => {
       
        console.log("user-id",week_id)
        localStorage.setItem("emp_id",emp_id);
        localStorage.setItem("week_id",week_id);
        localStorage.setItem("from_date", convertDateStringWithHifn(from_date)); 
        localStorage.setItem("to_date",convertDateStringWithHifn(to_date));
        // console.log("fromdate-admin-timesheet",localStorage.getItem('from_date'));
     
    
        // console.log("localstoragedata:",localStorage.getItem('week_id'));
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
                );
            },
            cell: ({ row }) => {
                if (row.original.status === "pending") {
                    return (
                        <p className={cn('w-[80px] p-2 flex items-center justify-center rounded-sm text-gray-500')}>
                            Pending
                        </p>
                    );
                } else if (row.original.status === "approved") {
                    return (
                        <p className={cn('w-[80px] p-2 flex items-center justify-center rounded-sm text-green-500')}>
                            Approved
                        </p>
                    );
                } else {
                    return (
                        <p className={cn('w-[80px] p-2 flex items-center justify-center rounded-sm text-red-500')}>
                            Rejected
                        </p>
                    );
                }
            },
        },
        {
            header: "View Report",
            cell: ({ row }) => (
                <Link variant="outlined"  onClick={() => handleClick(row.original.week_id,row.original.user_id, row.original.from_date, row.original.to_date)} href="viewreport" >
                    View Report
                </Link>
            ),
        },
    ];

    const table = useReactTable({
        data: allData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onPaginationChange: setPagination,
        state: {
            sorting,
            columnFilters,
            globalFilter,
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
