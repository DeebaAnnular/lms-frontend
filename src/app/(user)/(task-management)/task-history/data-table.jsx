"use client";
import { useState } from "react";
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
import { Input } from "../../../../components/ui/input";  
import Link from "next/link";
import { convertDateStringWithHifn } from "../../../../utils"; 
import { useSelector } from "react-redux";
import { PiGreaterThanLight } from "react-icons/pi";
import { PiLessThan } from "react-icons/pi";

export function DataTable({ allData }) {
    const user = useSelector((state) => state.user.userDetails); 
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [userNameFilter, setUserNameFilter] = useState("");
    const [pagination, setPagination] = useState({
        pageSize: 6, // Set default page size to 6
        pageIndex: 0,
    });

    const handleUserNameFilterChange = (e) => {
        setUserNameFilter(e.target.value);
        setGlobalFilter(e.target.value);
    };

    const handleClick = (week_id, emp_id, from_date, to_date) => {
        localStorage.setItem("emp_id", emp_id);
        localStorage.setItem("week_id", week_id);
        localStorage.setItem("from_date", convertDateStringWithHifn(from_date));
        localStorage.setItem("to_date", convertDateStringWithHifn(to_date));
    };

    const columns = [
        {
            accessorKey: "serial_number",
            header: "S.No",
            cell: ({ row }) => {
                return <p>{row.index + 1}</p>;
            },
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
                <Link
                    variant="outlined"
                    onClick={() => handleClick(row.original.week_id, row.original.user_id, row.original.from_date, row.original.to_date)}
                    href="viewreport"
                >
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
            pagination,
        },
    });

    const totalPages = table.getPageCount();
    const pageIndex = pagination.pageIndex;
    const pageSize = pagination.pageSize;
    const totalRows = allData.length;

    // Calculate the range of rows being displayed
    const startRow = pageIndex * pageSize + 1;
    const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);

    return (
        <div className="w-full p-6">
            <div className="overflow-clip">
                <Table>
                    <TableHeader className="bg-[#F7F7F7] hover:bg-none text-black">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} isHeader>
                                {headerGroup.headers.map((header) => (
                                    <TableHead 
                                        key={header.id} 
                                        className="text-black text-[16px] font-bold p-6 border-none"
                                    >
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
                                        <TableCell className="p-6 text-[#667085]" key={cell.id}>
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

            {/* Pagination Info */}
            <div className="flex justify-between mt-5">
                <div className="text-[#667085] ml-5">
                    Showing {startRow}-{endRow} of {totalRows}
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center">
                    <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="p-1 bg-[#F0F0F2] text-black border rounded-none disabled:opacity-50"
                    >
                        <span className="text-black">Previous</span>
                    </button>

                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="p-1 px-3 ml-2 bg-[#F0F0F2] border rounded-none disabled:opacity-50"
                    >
                        <span className="text-gray-500">Next</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

