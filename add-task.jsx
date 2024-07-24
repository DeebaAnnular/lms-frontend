"use client";
import { useState, useEffect } from "react";
import { IoIosClose } from "react-icons/io";
import { FaRegCircle } from "react-icons/fa";
import {
    postTask,
    getAllTask,
    getWeeklyStatus,
    editTask,
    getAllTaskById,
    deleteTask,
} from "../../../../actions";
import { useSelector } from "react-redux";
import Image from "next/image";
import { all } from "axios";

const Calendar = () => {
    const user = useSelector((state) => state.user.userDetails);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [days, setDays] = useState([]); 
    const [taskId, setTaskId] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [allTasks, setAllTasks] = useState([]);
    const [task, setTask] = useState("");
    const [time, setTime] = useState("");
    const [show, setShow] = useState(false);
    const [tasksForSelectedDate, setTasksForSelectedDate] = useState([]);
    const [currYear, setCurrYear] = useState();
    const [weeklyStatuses, setWeeklyStatuses] = useState();

    useEffect(() => {
        generateCalendar();
        fetchData();
    }, [currentDate,]);

    useEffect(() => {
        fetchWeeklyData();
        fetchalltask();
    }, []);

    const generateCalendar = () => {
        const year = currentDate.getFullYear();
        setCurrYear(currentDate.getFullYear());
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const tempDays = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            tempDays.push("");
        }
        for (let i = 1; i <= daysInMonth; i++) {
            tempDays.push(i);
        }
        setDays(tempDays);
    };

    const changeMonth = (direction) => {
        setCurrentDate(
            new Date(currentDate.setMonth(currentDate.getMonth() + direction))
        );
    };

    const changeYear = (event) => {
        const newYear = parseInt(event.target.value, 10);
        setCurrYear(newYear);
        const newDate = new Date(currentDate.setFullYear(newYear));
        setCurrentDate(newDate);
    };

    const yearOptions = [];
    for (let i = 1900; i <= 2100; i++) {
        yearOptions.push(i);
    }

     
     const [day, setDay] = useState()
     const dateStr = (day) => {
        return `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1) .toString() .padStart(2, "0")}-${day.toString().padStart(2, "0")}`
     }
    const [tasksForDate, setTasksForDate] = useState()

    const handleAddTask = (day) => {
        setShow(true);
        setDay(day)  
        setTaskId(dateStr(day)); 
        setSelectedDate(dateStr(day));

        // Filter tasks for the selected date 
        fetchData() 
        fetchalltask()
        const tasksForDate = allTasks.filter((task) => task.task_date === dateStr(day) ); 
        setTasksForSelectedDate(tasksForDate); 
    };
 

    const fetch = async (data) => {
        const response = await postTask(data);
        return response;
    };

    const fetchData = async () => {
        const response = await getAllTask();
        setAllTasks(response);
    };

    const fetchWeeklyData = async () => {
        const response = await getWeeklyStatus();
        setWeeklyStatuses(response.weeklyStatuses);
    };

    const fetchalltask = async () => {
        const res = await getAllTask();
        const taskData = res.map((data) => ({
            task_date: data.task_date,
            task_id: data.task_id,
            task_name: data.task_name,
            task_time: data.task_time,
            approved_status: data.approved_status,
        }));
        setAllTasks(taskData);
    };

    const submitTask = async (e) => {
        console.log("inside", day)
        e.preventDefault();
        const timeFormat = /^([01]\d|2[0-3]):([0-5]\d)$/;

        if (!time.match(timeFormat)) {
            alert('Time must be in the format "hh:mm:".');
            return;
        }
        const newTask = {
            task_date: selectedDate,
            task_name: task,
            task_time: time,
            user_id: user.user_id,
        };
        try {
            const res = await postTask(newTask);
            fetchData()
        } catch (error) {
            console.log("error", error);
        }

        // setShow(false);
        console.log("before",allTasks)
        fetchData()
        console.log("after", allTasks) 
        handleAddTask(day) 

        setTask("");
        setTime("");


    };

    const getStatusElement = (status) => {
        if (status === "approved") {
            return (
                <div className="w-full h-[70px] flex  rounded-md items-center bg-[#00b44b27]"></div>
            );
        } else if (status === "rejected") {
            return (
                <div className="w-full h-[70px] flex  rounded-md items-center bg-[#c8030329]"></div>
            );
        } else if (status === "pending") {
            return (
                <div className="w-full h-[70px] flex  rounded-md items-center bg-yellow-100"></div>
            );
        }
    };

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
            user_id: localStorage.getItem("user_id"),
        };

        const response = await editTask(taskId, req_body);
         
        setEditingTaskId(null);
        fetchData();
        fetchalltask();

    };

    const handleCancel = () => {
        setEditingTaskId(null);
    };

    const handleDelete = async (taskId) => {
        const response = await deleteTask(taskId); 
        fetchData();
        fetchalltask();
        console.log(day) 
        handleAddTask(day)
         console.log(tasksForSelectedDate)
    };

    const formatTime = (time) => {
        return time.slice(0, 5); // Extract the first 5 characters (HH:mm)
    };

    return (
        <div className="p-5 bg-white">
            <header className="flex justify-between items-center mb-4  bg-white">
                <div className="flex gap-3 items-center font-medium text-[18px]">
                    <div className=" flex items-center justify-center h-[40px] w-[40px] bg-[#D9D9D9] border-2 border-[#EAEBF1]">
                        <div
                            className=" w-[12px] h-[12px]    relative   object-contain"
                            onClick={() => changeMonth(-1)}
                        >
                            <Image
                                src="/imgs/left-arrow.svg"
                                alt="logo"
                                layout="fill"
                                objectFit="contain"
                                className=" h-[24px] pw-[24px] object-contian"
                            />
                        </div>
                    </div>

                    <p className="min-w-[200px] text-center">
                        {currentDate.toLocaleString("default", { month: "long" })},{" "}
                        {currYear}
                    </p>
                    <div className=" flex items-center justify-center h-[40px] w-[40px] bg-[#D9D9D9] border-2 border-[#EAEBF1]">
                        <div
                            className="logo h-[12px] relative w-[12px]  object-contain"
                            onClick={() => changeMonth(1)}
                        >
                            <Image
                                src="/imgs/right-arrow.svg"
                                alt="logo"
                                layout="fill"
                                objectFit="contain"
                                className=" h-[24px] w-[24px] object-contian"
                            />
                        </div>
                    </div>
                </div>

                <select
                    onChange={changeYear}
                    value={currentDate.getFullYear()}
                    className="ml-2 font-medium text-[18px] px-4 py-2 border rounded"
                >
                    {yearOptions.map((year) => (
                        <option key={year} value={year} className="focus:outline-none">
                            {year}
                        </option>
                    ))}
                </select>
            </header>

            <div className="bg-[#F9F9F9] p-3">
                <div className="grid grid-cols-7 gap-4 ">
                    <div className="flex justify-center font-semibold text-[#525865] text-[16px]">
                        Sunday
                    </div>
                    <div className="flex justify-center font-semibold text-[#525865] text-[16px]">
                        Monday
                    </div>
                    <div className="flex justify-center font-semibold text-[#525865] text-[16px]">
                        Tuesday
                    </div>
                    <div className="flex justify-center font-semibold text-[#525865] text-[16px]">
                        Wednesday
                    </div>
                    <div className="flex justify-center font-semibold text-[#525865] text-[16px]">
                        Thursday
                    </div>
                    <div className="flex justify-center font-semibold text-[#525865] text-[16px]">
                        Friday
                    </div>
                    <div className="flex justify-center font-semibold text-[#525865] text-[16px]">
                        Saturday
                    </div>
                    {days.map((day, index) => {
                        const dateStr = `${currentDate.getFullYear()}-${(
                            currentDate.getMonth() + 1
                        )
                            .toString()
                            .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
                        const taskForDate = allTasks.find(
                            (task) => task.task_date === dateStr
                        );
                        return (
                            <div
                                key={index}
                                className={`${day ? "rounded-md shadow-md overflow-hidden" : ""
                                    }`}
                                onClick={() => day && handleAddTask(day)}
                            >
                                <div
                                    className={`day-wrapper flex justify-between pt-1 px-2 ${day ? "bg-white" : ""
                                        }`}
                                    onClick={() => day && handleAddTask(day)}
                                >
                                    <p className="text-[14px] text-[#6E6EE1] font-medium">
                                        {day && day}
                                    </p>
                                </div>

                                <div
                                    className={` px-2 min-h-[80px] max-h-[80px] overflow-clip line-clamp-3 ${day ? "text-center bg-white" : ""
                                        }`}
                                >
                                    {day && (
                                        <ul>
                                            {taskForDate &&
                                                getStatusElement(taskForDate.approved_status)}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
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

                        <h2 className="text-xl font-bold text-center mt-4">Add Task</h2>
                        <form onSubmit={submitTask} className="space-y-4">
                            <div>
                                <label className="block">Task:</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded"
                                    value={task}
                                    onChange={(e) => setTask(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block">Time:</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded"
                                    value={time}
                                    placeholder="hh:mm"
                                    onChange={(e) => setTime(e.target.value)}
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Add
                                </button>
                            </div>
                        </form>
                        <h1 className="text-2xl font-bold text-center my-4">Tasks </h1>
                        <ul>
                            <div className="max-h-[200px] overflow-y-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50 sticky top-0 z-10">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Task Id
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Task Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Task Time
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Edit
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Delete
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white">
                                        {tasksForSelectedDate.map((task) => (
                                            <tr key={task.task_id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {task.task_id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {editingTaskId === task.task_id ? (
                                                        <input
                                                            type="text"
                                                            name="task_name"
                                                            value={editedTask.task_name}
                                                            onChange={handleInputChange}
                                                            className="border px-2 py-1"
                                                        />
                                                    ) : (
                                                        task.task_name
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {editingTaskId === task.task_id ? (
                                                        <input
                                                            type="text"
                                                            name="task_time"
                                                            value={formatTime(editedTask.task_time)}
                                                            onChange={handleInputChange}
                                                            className="border px-2 py-1"
                                                        />
                                                    ) : (
                                                        formatTime(task.task_time)
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {editingTaskId === task.task_id ? (
                                                        <>
                                                            <button
                                                                className="text-green-600 hover:text-green-900"
                                                                onClick={() => handleSave(task.task_id)}
                                                            >
                                                                Save
                                                            </button>
                                                            <button
                                                                className="text-gray-600 hover:text-gray-900 ml-2"
                                                                onClick={handleCancel}
                                                            >
                                                                Cancel
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button
                                                            className="text-blue-600 hover:text-blue-900"
                                                            onClick={() => handleEdit(task)}
                                                        >
                                                            Edit
                                                        </button>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <button
                                                        className="text-red-600 hover:text-red-900"
                                                        onClick={() => handleDelete(task.task_id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calendar;
