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
import { useState, useEffect } from "react";
import { capitalizeWords } from "../../../utils/index";
import { useRouter } from "next/navigation";
import { getTasksTimeById } from "../../../actions";
import Tooltip from "../../../components/Tooltip"

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
  const [taskDetails, setTaskDetails] = useState([]);
  const [taskIds, setTaskIds] = useState([]);
  const [time, setTime] = useState({});
  const [selectedDate, setSelectedDate] = useState();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleTaskClick = (tasks, taskId, Day) => {
    setSelectedDate(Day);
    setTaskDetails(tasks);
    setTaskIds(taskId);
    setShow(true);
  };

  useEffect(() => {
    const fetchTaskTime = async (id) => {
      const data = await getTasksTimeById(id);
      setTime((prevTime) => ({ ...prevTime, [id]: data }));
    };

    if (taskIds.length > 0) {
      taskIds.forEach((id) => {
        if (!time[id]) {
          fetchTaskTime(id);
        }
      });
    }
  }, [taskIds]);
  const handleApprove = async (task_id) => {
    try {
      const response = await fetch(
        `https://lms-api.annularprojects.com:3001/api/task/approve_daily_task`,
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

  const handleReject = (task_id, user_id) => {
    setTaskIds(task_id); // Store the task ID for submission
    setIsModalOpen(true); // Open the modal
  };

  const handleSubmitRejection = async () => {
    const task_id = taskIds; // Use the stored task ID
    try {
        const response = await fetch(
            `https://lms-api.annularprojects.com:3001/api/task/reject_daily_task`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    rejectedStatus: "rejected",
                    rejectedById: localStorage.getItem("user_id"),
                    rejectReason: rejectionReason,
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
        setIsModalOpen(false); // Close the modal
        setRejectionReason(""); // Reset the reason
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
      accessorKey: "task_name",
      header: "Task Details",
      cell: ({ row }) => (
        <Tooltip content="click here to view task details">
          <div
            onClick={() =>
              handleTaskClick(
                row.original.task_name,
                row.original.task_id,
                row.original.day
              )
            }
            className="cursor-pointer text-blue-500 "
          >
            <p>View</p>
          </div>
        </Tooltip>
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
              <p
                className={
                  status === "approved"
                    ? "text-green-600 mr-8"
                    : status === "rejected"
                    ? "text-red-600 mr-8"
                    : ""
                }
              >
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
      return row
        .getValue("task_name")
        .some((taskName) =>
          taskName.toLowerCase().includes(value.toLowerCase())
        );
    },
  });

  return (
    <div className="w-full">
      <div className="rounded-none min-h-[380px] relative overflow-clip">
        <Table>
          <TableHeader className="bg-[#F7F7F7] hover:bg-none text-black">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-black border-none h-[60px] font-bold text-[16px] px-4"
                  >
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

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="text-[#667085]"
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
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded min-w-[300px] w-[600px] min-h-[500px] shadow-lg relative">
            <button
              onClick={() => setShow(false)}
              className="absolute top-2 right-2 text-red-500 text-xl"
            >
              <IoIosClose />
            </button>
            <h1 className="text-2xl font-bold text-center mb-4">
              {selectedDate} Tasks
            </h1>
            <Table>
              <TableHeader>
                <TableRow className="bg-[#F7F7F7]">
                  <TableHead className="p-0 px-3 text-[#333843]">
                    S.No
                  </TableHead>
                  <TableHead className="p-0 px-3 pl-5 text-[#333843]">
                    Task
                  </TableHead>
                  {/* <TableHead>Time</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="p-0 w-[50%]">
                    {taskIds &&
                      taskIds.map((id, index) => (
                        <p
                          key={index + 1}
                          className="py-2 px-3 pl-5 border-b text-[#667085]"
                        >
                          {index + 1}
                          {/* {fetchTaskTime(id)}
                                                {time[id] && <span>{` - ${time[id]}`}</span>} */}
                        </p>
                      ))}
                  </TableCell>
                  <TableCell className="p-0 w-[50%]">
                    {taskDetails &&
                      taskDetails.map((task, index) => (
                        <p
                          key={index + 1}
                          className="py-2 px-3  border-b text-[#667085]"
                        >
                          {capitalizeWords(task)}
                        </p>
                      ))}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="modal-content bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Enter Reason for Rejection</h2>
            <textarea 
                className="w-full h-24 border border-gray-300 rounded-md p-2 mb-4 resize-none"
                value={rejectionReason} 
                onChange={(e) => setRejectionReason(e.target.value)} 
                placeholder="Type your reason here..."
            />
            <div className="flex justify-end">
                <button 
                    className="bg-black text-white rounded-md px-4 py-2 mr-2"
                    onClick={handleSubmitRejection}
                >
                    Submit
                </button>
                <button 
                    className="bg-gray-300 text-black rounded-md px-4 py-2"
                    onClick={() => setIsModalOpen(false)}
                >
                    Cancel
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}