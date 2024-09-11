"use client";
import { IoIosClose, IoIosSearch } from "react-icons/io";
import RegistrationForm from "../../../components/feedData/RegistrationForm";
import { MdDelete } from "react-icons/md";
import { deleteTask } from "../../../actions";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

export function DataTable({ columns, setEmp_list, data }) {
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [isShow, setIsShow] = useState(false);

    const handleDelete = async (userId) => {
        console.log("userid", userId);
        try {
            await deleteTask(userId);
            setEmp_list(prevList => prevList.filter(emp => emp.user_id !== userId));
            toast.success("Employee deleted successfully");
        } catch (error) {
            console.error("Error deleting employee:", error);
            toast.error("Failed to delete employee");
        }
    };

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
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

    return (
        <div className="w-full">
            <div className="bg-white mb-2 p-2 py-2  flex items-center justify-between">
                <div className="flex border border-[#DCDCDC] items-center w-[30%] h-full">
                    <IoIosSearch className='text-[#B1A8A8] ml-2 text-[20px]' />
                    <Input
                        placeholder="Search by Emp Name or ID"
                        value={globalFilter}
                        onChange={(event) => setGlobalFilter(event.target.value)}
                        className="searchbar max-w-sm text-black placeholder:text-[#B1A8A8] text-[13px] border-none outline-none"
                    />
                </div>

                <div
                    className="w-fit border bg-[#134572] rounded-sm h-fit p-2 text-xs text-white cursor-pointer hover:text-[#A6C4F0] hover:bg-[#134572]"
                    onClick={() => setIsShow(true)}
                >
                    Add Employee
                </div>
            </div>

            <div className="p-2 py-4 relative overflow-clip">
                <Table>
                    <TableHeader className="bg-[#f7f7f7] h-[60px] text-[14px] text-[#333843]">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="text-[13px] font-bold text-[#333843]">
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
                                        <TableCell 
                                        className="text-[12px] p-1.5"  
                                            key={cell.id} 
                                            style={{
                                                paddingLeft: cell.column.id === 'emp_id' || cell.column.id === 'emp_name' ? '38px' : '30px',
                                                width: cell.column.id === 'contact_number' ? '200px' : '',
                                                ...(cell.column.id === 'contact_number' && {
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                })
                                            }}
                                            title={cell.column.id === 'contact_number' ? cell.getValue() : undefined}
                                        >
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
                                    No records found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {isShow && (
                <div className="fixed inset-0 flex items-center justify-center z-20 bg-gray-800 bg-opacity-75 py-10">
                    <div className="relative bg-white w-fit p-10 rounded shadow-lg max-h-[calc(100vh-70px)] overflow-y-auto">
                        <div className="absolute top-0 right-[20px] z-10 cursor-pointer flex justify-end" onClick={() => { setIsShow(false) }}>
                            <button
                                onClick={() => setIsShow(false)}
                                className="mt-[23px] border-2 rounded-[50%] border-red-600"
                            >
                                <IoIosClose className='text-red-600 text-lg' />
                            </button>
                        </div>
                        <h1 className='text-xl sticky font-semibold cursor-default flex justify-center min-w-[400px]'>Employee Registration</h1>
                        <div className="max-h-[500px]   mt-[20px] Z-20">
                            <RegistrationForm setIsShow={setIsShow} setEmp_list={setEmp_list} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}