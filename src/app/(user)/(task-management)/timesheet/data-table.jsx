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
import { useEffect, useState } from "react";
import { capitalizeWords, convertDate } from "../../../../utils/index";
import { ArrowUpDown, EditIcon, DeleteIcon } from "lucide-react";
import { cn } from "../../../../lib/utils";
import { editTask, deleteTask, getAllTaskById, submitWeeklyTimeSheet, getTaskById, getAllTask } from "../../../../actions";
import { all } from "axios";
import { IoIosClose } from "react-icons/io";

export function DataTable({ allData, userId, startDate, endDate }) {
    console.log(allData)
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [pagination, setPagination] = useState({
        pageSize: 5,
        pageIndex: 0,
    });

    const [data, setData] = useState(allData);

    useEffect(() => {
        setData(allData);
    }, [allData]);
     
    const [currentTask, setCurrentTask] = useState({
        task_name: "",
        task_time: "",
    });

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

    //pop functions 
    const [selectedDay, setSelectedDay] = useState()
    const [selectedDate, setSeletedDate] = useState()
    const [taskForDate, setTaskForDate] = useState()
    const [show, setShow] = useState(false);
    const [currDayStatus, setCurrDayStatus] = useState()

    const handleTaskView = async (day) => {
        setShow(true)
        setSelectedDay(day)
        setSeletedDate(convertDate(day))
        const response = await getAllTask(userId)
        const tasksList = response.filter((task) => task.task_date === convertDate(day));
        setTaskForDate(tasksList)

        if (tasksList.length > 0) {
            const singleTask = tasksList.filter((task) => task.task_date === convertDate(day))[0]
            setCurrDayStatus(singleTask.approved_status)
            setCurrDayStatus(singleTask.approved_status)
        } 
    }
     
    //   edit task modal

    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editedTask, setEditedTask] = useState({
        task_name: "",
        task_time: "",
    });

    const handleEdit = (task) => {
        setEditingTaskId(task.task_id);
        setEditedTask({ task_name: task.task_name, task_time: task.task_time });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedTask((prevTask) => ({ ...prevTask, [name]: value }));
    };

    const handleSave = async (taskId) => {
        const req_body = {
            task_name: editedTask.task_name,
            task_time: editedTask.task_time,
            task_date: selectedDate,
            userId: localStorage.getItem("userId"),
        };

        const res = await editTask(taskId, req_body);

        setEditingTaskId(null);
        const response = await getAllTask(userId);
        const tasksList = response.filter((task) => task.task_date === convertDate(selectedDay));
        setTaskForDate(tasksList);
    };

    const handleCancel = () => {
        setEditingTaskId(null);
    };

    const handleDelete = async (taskId) => {
        const res = await deleteTask(taskId);
        const response = await getAllTask(userId);
        const tasksList = response.filter((task) => task.task_date === convertDate(selectedDay));
        setTaskForDate(tasksList);
    };

    const formatTime = (time) => {
        return time.slice(0, 5); // Extract the first 5 characters (HH:mm)
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
                <span style={{ color: "#1A51D7" }} className="cursor-pointer" onClick={() => { handleTaskView(row.original.day) }} >
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
        <div className="w-full h-full overflow-hidden flex flex-col static">
            <div className="rounded-none overflow-y-auto">
                <Table>
                    <TableHeader className="bg-[#F7F7F7] hover:bg-none text-black">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} isHeader>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="text-black border-none h-[60px] font-bold text-[16px]">
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
            <div className="flex-1" />
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-end mt-5"> 
                <div>
                    <Button
                        className="bg-black w-[140px] h-[40px] flex items-center justify-center text-white rounded-lg border-none text-[14px] font-medium"
                        onClick={() => handleSubmit()}
                    >
                        Submit Timesheet
                    </Button>
                </div>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    className="bg-transparent border-none"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    className="bg-transparent border-none"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
