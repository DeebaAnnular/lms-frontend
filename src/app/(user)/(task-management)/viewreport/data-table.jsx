// data-table.js
"use client";
import { IoIosClose, IoIosSearch } from "react-icons/io";
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
} from "../../../../components/ui/table";

import { Button } from "../../../../components/ui/button";
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";
import { capitalizeWords, convertDate } from "../../../../utils/index";
import { ArrowUpDown, EditIcon, DeleteIcon } from "lucide-react";
import { cn } from "../../../../lib/utils";

import { editTask, deleteTask, getAllTaskById, submitWeeklyTimeSheet } from "../../../../actions";

export function DataTable({ allData, userId, startDate, endDate }) {
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [data, setData] = useState(allData)
    const [show, setShow] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);
    const router = useRouter()

    useEffect(() => {
        localStorage.removeItem('from_date')
        localStorage.removeItem('to_date')
        localStorage.removeItem('week_id')
    }, [])

    // Edit function
    const sumbitEditedTask = async (id, editedTask) => {
        const response = await editTask(id, editedTask);
        const updatedData = await getAllTaskById(localStorage.getItem("user_id"), startDate, endDate)
        setData(updatedData.tasks)
    };

    const handleEditButton = (task, task_date) => {
        setCurrentTask({ ...task, task_date: convertDate(task_date), user_id: localStorage.getItem("user_id") });
        setShow(true);
    };

    const handleDeleteTask = async (id) => {
        const response = await deleteTask(id);
        const updatedData = await getAllTaskById(localStorage.getItem("user_id"), startDate, endDate)
        setData(updatedData.tasks)
    }; 



    const columns = [
        {
            accessorKey: "day",
            header: "Date",
        },
        {
            accessorKey: "total_hours_per_day",
            header: "Total Hours",
            cell: ({ row }) => {
                const hours = (parseFloat(row.original.total_hours_per_day)).toFixed(2);
                return <p className="text-xs">{hours} hours</p>;
            },
        },
        {
            accessorKey: "approved_status",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="text-[13px]"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >  
                        Status
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                if (row.original.approved_status === "pending") {
                    return (
                        <p className={cn('w-[80px] p-2 flex items-center justify-center rounded-sm text-gray-500')}>
                            Pending
                        </p>
                    );
                } else if (row.original.approved_status === "approved") {
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
    ];

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
            return row.getValue("task_name").some(taskName =>
                taskName.toLowerCase().includes(value.toLowerCase())
            );
        },
    });

    return (
        <div className="w-full">
            <div className="bg-white min-h-[380px] p-3">
                <Table>
                    <TableHeader className="bg-[#F7F7F7] hover:bg-none text-black">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="text-black text-[13px] text-xs font-medium  px-3">
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
                                <TableRow key={row.id} className="text-xs p-2" data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="p-3 text-xs  text-[#667085]">
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

            {show && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-lg relative">
                        <button
                            onClick={() => setShow(false)}
                            className="absolute top-2 right-2 text-red-500 text-xl"
                        >
                            <IoIosClose />
                        </button>
                        <h1 className="text-2xl font-bold text-center mb-4">Edit Task</h1>
                        <form className="space-y-4">
                            <div>
                                <label className="block">Task Name:</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded"
                                    value={currentTask ? currentTask.task_name : ""}
                                    onChange={(e) => setCurrentTask({ ...currentTask, task_name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block">Time:</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded"
                                    placeholder="hh:mm"
                                    value={currentTask ? currentTask.task_time : ""}
                                    onChange={(e) => setCurrentTask({ ...currentTask, task_time: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                    onClick={() => {
                                        sumbitEditedTask(currentTask.task_id, currentTask);
                                        setShow(false);
                                    }}
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
