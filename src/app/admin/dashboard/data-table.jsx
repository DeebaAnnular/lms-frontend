"use client";
import { IoIosClose, IoIosSearch } from "react-icons/io";
import RegistrationForm from "../../../components/feedData/RegistrationForm";

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
import Image from "next/image";

export function DataTable({ columns, data }) {

    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(""); // state for the search input
     
    const table = useReactTable({
        data,
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
            globalFilter, 
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
            <div className=" bg-white mb-2 p-2 py-4 flex items-center justify-between">

                <div className="flex border border-[#DCDCDC] items-center px-3 h-full  ">
                    <IoIosSearch className='text-[#B1A8A8] text-[30px]' />
                    <Input
                        placeholder="Search by Name or Emp ID..."
                        value={globalFilter}
                        onChange={(event) =>
                            setGlobalFilter(event.target.value)
                        }
                        className="searchbar max-w-sm text-[#B1A8A8] placeholder:text-[#B1A8A8] text-[15px] border-none outline-none"
                    />
                </div>

                <div
                    className="w-fit bg-[#A6C4F0] rounded-sm h-fit p-2 text-black cursor-pointer"
                    onClick={() => setIsShow(true)} // show the registration form on click
                >
                    Add Employee
                </div>

            </div>

            <div className="p-2 py-4  min-h-[380px] relative overflow-clip ">
                <Table>
                    <TableHeader className="bg-[#f7f7f7]  h-[60px] text-[#333843]">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="text-[16px] font-bold text-[#333843]">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody className='text-[#667085]'>
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
            {/* <div className="flex justify-between items-center p-4">

                <span > 
                    <p>
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </p>
                </span>
             
                <div className='flex gap-3 items-center font-medium text-[18px]'>

                    <div className=' flex items-center justify-center h-[40px] w-[40px] bg-[#D9D9D9] border-2 border-[#EAEBF1]' onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                        <div className=" w-[12px] h-[12px]    relative   object-contain"  >

                            <Image src='/imgs/left-arrow.svg' alt='logo' layout="fill" objectFit="contain" className=" h-[24px] pw-[24px] object-contian" />

                        </div>
                    </div>
 
                    <div className=' flex items-center justify-center h-[40px] w-[40px] bg-[#D9D9D9] border-2 border-[#EAEBF1]' onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        <div className="logo h-[12px] relative w-[12px]  object-contain"   >

                            <Image src='/imgs/right-arrow.svg' alt='logo' layout="fill" objectFit="contain" className=" h-[24px] w-[24px] object-contian" />

                        </div>
                    </div>

                </div>

            </div> */}

            {isShow && (
                <div className="fixed inset-0 flex items-center  justify-center z-20 bg-gray-800 bg-opacity-75">
                    <div className="relative bg-white w-fit   cursor-pointer p-10 rounded shadow-lg">
                        <div className="absolute top-0 right-[20px] z-10 flex justify-end" onClick={() => { setIsShow(false) }}>
                            <button
                                onClick={() => setIsShow(false)}
                                className="mt-[23px] border-2 rounded-[50%] border-[#373857]"
                            >
                                <IoIosClose className='text-[#373857] text-xl' />
                            </button>
                        </div>
                        <h1 className='text-2xl sticky font-semibold flex justify-center min-w-[400px]'>Employee Registration </h1>
                        <div className="max-h-[500px] mt-[20px] Z-20">
                            <RegistrationForm setIsShow={setIsShow} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
