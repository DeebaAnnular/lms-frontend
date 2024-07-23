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
import { editTask, deleteTask, getAllTaskById, submitWeeklyTimeSheet, getTaskById } from "../../../../actions";

export function DataTable({ allData, userId, startDate, endDate }) {
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [pagination, setPagination] = useState({
        pageSize: 5,
        pageIndex: 0,
    });

    const [data, setData] = useState(allData);
    const [show, setShow] = useState(false);
    const [currentTask, setCurrentTask] = useState({
        task_name: "",
        task_time: "",
    });

    const sumbitEditedTask = async (id, editedTask) => {
        const response = await editTask(id, editedTask);
        const updatedData = await getAllTaskById(localStorage.getItem("user_id"), startDate, endDate);
        setData(updatedData.tasks);
    };

    const handleEditButton = async (task, task_date) => {
        const fetchedTask = await getTaskById(task.task_id);
        if (fetchedTask) {
            setCurrentTask({
                ...fetchedTask,
                task_date: convertDate(task_date),
                user_id: localStorage.getItem("user_id"),
            });
            setShow(true);
        } else {
            alert("Failed to fetch task details");
        }
    };

    const handleDeleteTask = async (id) => {
        const response = await deleteTask(id);
        const updatedData = await getAllTaskById(localStorage.getItem("user_id"), startDate, endDate);
        setData(updatedData.tasks);
    };

    const handleSubmit = async () => {
        const data = {
            userId: localStorage.getItem("user_id"),
            fromDate: startDate,
            toDate: endDate,
        };
        const response = await submitWeeklyTimeSheet(data);
        alert("Timesheet submitted successfully");
    };

    const validateTime = (time) => {
        const regex = /^([0-1]\d|2[0-3]):([0-5]\d)$/;
        return regex.test(time);
    };

    const columns = [
        {
            accessorKey: "s_no",
            header: "S.No",
            cell: ({ row }) => row.index + 1,
        },
        {
            accessorKey: "day",
            header: "Date",
            cell: ({ row }) => (
                <span style={{ color: "#1A51D7" }} className="cursor-pointer">
                    {row.original.day}
                </span>
            ),
        },
        {
            accessorKey: "total_hours_per_day",
            header: "Total Hours",
            cell: ({ row }) => {
                const totalHours = parseFloat(row.original.total_hours_per_day);
                const hours = Math.floor(totalHours);
                const minutes = Math.round((totalHours - hours) * 60);
                return <p>{`${hours}h ${minutes}m`}</p>;
            },
        },
        {
            accessorKey: "approved_status",
            header: ({ column }) => {
                return (
                    <p
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Status
                    </p>
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
        <div className="w-full h-screen overflow-hidden flex flex-col static">
            <div className="rounded-none h-[40rem] overflow-y-auto">
                <Table>
                    <TableHeader className="bg-[#F7F7F7] hover:bg-none text-black">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} isHeader >
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="text-black border-none p-6 font-bold text-[16px]">
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
                                <TableRow className="text-[#667085]" key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="pl-4">
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

            <div className={`modal ${show ? "block" : "hidden"}`}>
                <div className="modal-box">
                    <h2 className="font-bold text-lg">Edit Task</h2>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (validateTime(currentTask.task_time)) {
                                sumbitEditedTask(currentTask.task_id, currentTask);
                                setShow(false);
                            } else {
                                alert("Invalid time format");
                            }
                        }}
                    >
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Task Name</span>
                            </label>
                            <input
                                type="text"
                                className="input input-bordered"
                                value={currentTask.task_name}
                                onChange={(e) =>
                                    setCurrentTask({ ...currentTask, task_name: e.target.value })
                                }
                                required
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Task Time</span>
                            </label>
                            <input
                                type="text"
                                className="input input-bordered"
                                value={currentTask.task_time}
                                onChange={(e) =>
                                    setCurrentTask({ ...currentTask, task_time: e.target.value })
                                }
                                required
                            />
                        </div>
                        <div className="modal-action">
                            <Button type="submit">Save</Button>
                            <Button onClick={() => setShow(false)}>Cancel</Button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="flex justify-end mt-4 p-4">
                <Button onClick={handleSubmit} className="bg-black text-white rounded-none px-10">
                    Submit
                </Button>
            </div>
        </div>
    );
}
