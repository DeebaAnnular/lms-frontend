import { IoIosClose } from "react-icons/io";
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
import { useState } from "react";
import { capitalizeWords } from "../../../utils/index";
import { useRouter } from "next/navigation";

export function DataTable({ allData, userId, startDate, endDate }) {
    const [data, setData] = useState(allData);
    const router = useRouter();
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [pagination, setPagination] = useState({
        pageSize: 5,
        pageIndex: 0,
    });

    const [show, setShow] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);

    const handleApprove = async (task_id) => {
        try {
            const response = await fetch(
                `http://localhost:3000/api/task/approve_daily_task`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        approvedStatus: "approved",
                        approvedById: localStorage.getItem("user_id"),
                        taskIds: task_id,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to approve daily task");
            }

            // Update data in state
            const updatedData = data.map((item) => {
                if (item.task_id === task_id) {
                    return {
                        ...item,
                        approved_status: "approved",
                    };
                }
                return item;
            });
            setData(updatedData);

            // router.push("/admin/timesheet");

        } catch (error) {
            console.error("Error approving daily task:", error);
        }
    };

    const handleReject = async (task_id, user_id) => {
        const rejectComment = window.prompt("Enter your rejection comment");

        try {
            const response = await fetch(
                `http://localhost:3000/api/task/reject_daily_task`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        rejectedStatus: "rejected",
                        rejectedById: user_id,
                        rejectReason: rejectComment,
                        taskIds: task_id,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to reject daily task");
            }

            // Update data in state
            const updatedData = data.map((item) => {
                if (item.task_id === task_id) {
                    return {
                        ...item,
                        approved_status: "rejected",
                    };
                }
                return item;
            });
            setData(updatedData);

            // Optional: Navigate after action
            // router.push("/admin/timesheet");

        } catch (error) {
            console.error("Error rejecting daily task:", error);
        }
    };

    const columns = [
        {
            accessorKey: "day",
            header: "Date",
        },
        {
            accessorKey: "task_id",
            header: "Task ID",
            cell: ({ row }) => (
                <div>
                    {row.original.task_id.map((id) => (
                        <p key={id}>{id}</p>
                    ))}
                </div>
            ),
        },
        {
            accessorKey: "task_name",
            header: "Tasks",
            cell: ({ row }) => (
                <div>
                    {row.original.task_name.map((taskName, index) => (
                        <p key={row.original.task_id[index]}>
                            {capitalizeWords(taskName)}
                        </p>
                    ))}
                </div>
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
            accessorKey: "actions",
            header: () => <span className="float-right mr-[44px]">Actions</span>,
            cell: ({ row }) => {
                const status = row.original.approved_status;

                return (
                    <div className="flex justify-end">
                        {status === "pending" ? (
                            <>
                                <Button
                                    className="px-1 py-0 bg-green-400 rounded-md mr-3 text-xs"
                                    onClick={() => handleApprove(row.original.task_id)}
                                >
                                    Approve
                                </Button>
                                <Button
                                    className="px-1 py-0 bg-red-600 rounded-md text-xs"
                                    onClick={() =>
                                        handleReject(
                                            row.original.task_id,
                                            localStorage.getItem("user_id")
                                        )
                                    }
                                >
                                    Reject
                                </Button>
                            </>
                        ) : (
                            <p className={status === "approved" ? "text-green-600 mr-8" : status === "rejected" ? "text-red-600 mr-8" : ""}>
                                {capitalizeWords(status)}
                            </p>
                        )}
                    </div>
                );
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
            return row.getValue("task_name").some((taskName) => taskName.toLowerCase().includes(value.toLowerCase()));
        },
    });

    return (
        <div className="w-full">
            <div className="rounded-none  min-h-[380px] relative overflow-clip">
                <Table>
                    <TableHeader className="bg-[#F7F7F7] hover:bg-none text-black">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="text-black border-none h-[60px] font-bold text-[16px] px-4">
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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

            {show && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-lg relative">
                        <button onClick={() => setShow(false)} className="absolute top-2 right-2 text-red-500 text-xl">
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
                                    onChange={(e) =>
                                        setCurrentTask({
                                            ...currentTask,
                                            task_name: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block">Time:</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded"
                                    value={currentTask ? currentTask.task_time : ""}
                                    onChange={(e) =>
                                        setCurrentTask({
                                            ...currentTask,
                                            task_time: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                    onClick={() => {
                                        // sumbitEditedTask(
                                        //     currentTask.task_id,
                                        //     currentTask
                                        // );
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
