"use client";
import { IoIosClose, IoIosSearch } from "react-icons/io";
import RegistrationForm from "../../../components/RegistrationForm";

import {
    ColumnDef,
    ColumnFiltersState,
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

import { useState } from "react";
import Link from "next/link";

export function DataTable({ columns, data }) {
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(""); // state for the search input
    const [pagination, setPagination] = useState({
        pageSize: 5,
        pageIndex: 0
    });

    const table = useReactTable({
        data,
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
            return (
                row.getValue("emp_name").toLowerCase().includes(value.toLowerCase()) ||
                row.getValue("emp_id").toLowerCase().includes(value.toLowerCase())
            );
        },
    });

    const [isShow, setIsShow] = useState(false); // initially set to false

    return (
        <div className="w-full">
            <div className="option-seciton flex justify-between">
                <div className="flex border-2 items-center px-3 rounded-md mb-3">
                    <IoIosSearch className='text-gray-500 text-[30px]' />
                    <Input
                        placeholder="search by name or Emp ID..."
                        value={globalFilter}
                        onChange={(event) =>
                            setGlobalFilter(event.target.value)
                        }
                        className="searchbar max-w-sm border-none outline-none"
                    />
                </div>

                <div
                    className="w-fit bg-blue-500 rounded-sm h-fit p-2 text-white cursor-pointer"
                    onClick={() => setIsShow(true)} // show the registration form on click
                >
                    Create Employee
                </div>
            </div>

            <div className="rounded-md border min-h-[380px] relative overflow-clip shadow-xl">
                <Table>
                    <TableHeader className="bg-blue-300 text-black">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="text-black">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
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
            <div className="flex justify-between items-center p-4">
                <Button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                    Previous
                </Button>
                <span>
                    Page{' '}
                    <strong>
                        {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </strong>
                </span>
                <Button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                    Next
                </Button>
            </div>

            {isShow && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                    <div className="relative bg-white w-fit mt-5 cursor-pointer p-5 rounded shadow-lg">
                        <div className="absolute top-0 right-[20px] z-10 flex justify-end" onClick={() => { setIsShow(false) }}>
                            <button
                                onClick={() => setIsShow(false)}
                                className="mt-[23px] border-2 rounded-[50%] border-red-500"
                            >
                                <IoIosClose className='text-red-500 text-xl' />
                            </button>
                        </div>
                        <h1 className='text-2xl sticky font-semibold flex justify-center min-w-[400px]'>New Employee Registration </h1>
                        <div className="max-h-[500px] mt-[20px]">
                            <RegistrationForm setIsShow={setIsShow} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
