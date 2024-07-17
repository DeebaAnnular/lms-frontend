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
} from "../../../components/ui/table";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import Link from "next/link";
import { convertDateStringWithHifn } from "../../../utils";
import { useSelector } from "react-redux";

export function DataTable({ allData }) {
    const user = useSelector((state) => state.user.userDetails);
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [userNameFilter, setUserNameFilter] = useState("");
    const [pagination, setPagination] = useState({
        pageSize: 5,
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
            globalFilter,
            pagination,
        },
        globalFilterFn: (row, columnId, value) => {
            const searchValue = value.toLowerCase();
            const userNameMatch = row.getValue("user_name").toLowerCase().includes(searchValue);
            const dateMatch = new Date(row.getValue("from_date")).toLocaleDateString().includes(searchValue) ||
                new Date(row.getValue("to_date")).toLocaleDateString().includes(searchValue);
            return userNameMatch || dateMatch;
        },
    });

    return (
        <div className="w-full">
            <div className="mb-4 flex space-x-4 items-center justify-normal">
                <label htmlFor="userNameFilter">Search by User Name</label>
                <Input
                    placeholder="Search by User Name"
                    value={userNameFilter}
                    onChange={handleUserNameFilterChange}
                    className="max-w-[200px]"
                />
            </div>
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

            {/* Pagination Controls */}
            <div className="flex items-center justify-between mt-4">
                <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="px-4 py-2 border rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span>
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </span>
                <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="px-4 py-2 border rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}