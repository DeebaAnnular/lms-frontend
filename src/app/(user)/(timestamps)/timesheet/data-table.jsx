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
import { Input } from "../../../../components/ui/input";
import { useState } from "react";
import { capitalizeWords, convertDate } from "../../../../utils/index";
import { ArrowUpDown, EditIcon, DeleteIcon } from "lucide-react";
import { cn } from "../../../../lib/utils";

import { editTask, deleteTask, getAllTaskById, submitWeeklyTimeSheet } from "../../../../actions";

export function DataTable({ allData, userId, startDate, endDate }) {
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [pagination, setPagination] = useState({
        pageSize: 5,
        pageIndex: 0,
    });

    const [data, setData] = useState(allData)

    const [show, setShow] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);


    // edit function
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

    const handleSubmit = async () => {
         const data = {
            userId: localStorage.getItem("user_id"),
            fromDate: startDate,
            toDate: endDate, 
         }
         const response = await submitWeeklyTimeSheet(data)
         alert("Timesheet submitted successfully")
         console.log(response)
    }

    const columns = [
        {
            accessorKey: "day",
            header: "Date",
        },
        {
            accessorKey: "task_id",
            header: "Task ID",
            cell: ({ row }) => {
                return row.original.task_id.map((id) => (
                    <div key={id} className="flex justify-between py-2">
                        <p>{id}</p>
                    </div>
                ));
            },
        },


        {
            accessorKey: "task_name",
            header: "Tasks",
            cell: ({ row }) => {
                return row.original.task_name.map((taskName, index) => (
                    <div key={row.original.task_id[index]}>
                        <p className="flex justify-between py-2">
                            {capitalizeWords(taskName)}

                            {/* here is the option to delete and edit the task */}
                            <span className="flex gap-3">
                                <EditIcon onClick={() => handleEditButton({
                                    task_id: row.original.task_id[index],
                                    task_name: taskName
                                }, row.original.day)} />
                                <DeleteIcon onClick={() => {
                                    handleDeleteTask(row.original.task_id[index])
                                }} />
                            </span>
                        </p>
                    </div>
                ));
            },
        },
        {
            accessorKey: "total_hours_per_day",
            header: "Total Hours",
            cell: ({ row }) => {
                const hours = (parseFloat(row.original.total_hours_per_day)).toFixed(2);
                return <p>{hours} hours</p>;
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
        onPaginationChange: setPagination,
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
                                        <TableCell key={cell.id} className=''>
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
                                    placeholder="hh:mm:ss"
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
            <div className="w-full flex justify-end mt-2">
                <Button className='px-3 py-2 bg-green-400 rounded-md' onClick={handleSubmit}>
                    Submit
                </Button>
            </div>
        </div>
    );
}
