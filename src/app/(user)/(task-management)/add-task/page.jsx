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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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
    const [currDayStatus, setCurrDayStatus] = useState()


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
        return `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`
    } 

    const handleTimeChange = (e) => {
        let value = e.target.value;
        
        // Remove all non-digit characters
        value = value.replace(/\D/g, '');
        
        // Limit the length to 4 characters
        if (value.length > 4) {
            value = value.slice(0, 4);
        }
        
        // Add colon after hours
        if (value.length > 2) {
            value = value.slice(0, 2) + ':' + value.slice(2);
        }
        
        // Ensure hours are between 00 and 23
        let hours = parseInt(value.slice(0, 2));
        if (hours > 23) {
            value = '23' + value.slice(2);
        }
    
        // Ensure minutes are between 00 and 59
        if (value.length > 2) {
            let minutes = parseInt(value.slice(3, 5));
            if (minutes > 59) {
                value = value.slice(0, 3) + '59';
            }
        }
        
        // Do not accept "00:00"
        if (value === '00:00') {
            value = '';
        }
        
        setTime(value); // Update state
        return value; // Return the formatted time
    };
    const handleAddTask = (day) => {
        const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const today = new Date();
        const thirtyDaysBefore = new Date(today);
        thirtyDaysBefore.setDate(today.getDate() - 30);
        const thirtyDaysAfter = new Date(today);
        thirtyDaysAfter.setDate(today.getDate() + 30);
    
        if (selectedDate >= thirtyDaysBefore && selectedDate <= thirtyDaysAfter) {
            setShow(true);
            setDay(day);
            setTaskId(dateStr(day));
            setSelectedDate(dateStr(day));
    
            // Filter tasks for the selected date
            fetchData();
            fetchalltask();
            const tasksForDate = allTasks.filter((task) => task.task_date === dateStr(day));
    
            if (tasksForDate.length > 0) {
                console.log(allTasks);
                const singleTask = tasksForDate.filter((task) => task.task_date === dateStr(day))[0];
                setCurrDayStatus(singleTask.approved_status);
            }
    
            setTasksForSelectedDate(tasksForDate);
        } else {
            // alert('You can only add tasks for dates within 30 days from today.');
            toast.error('You can only add tasks for dates within 30 days from today.');
        }
    };
    

    const fetch = async (data) => {
        const response = await postTask(data);
        return response;
    };

    const fetchData = async () => {
        const response = await getAllTask(user.user_id);
        setAllTasks(response);
    };

    const fetchWeeklyData = async () => {
        const response = await getWeeklyStatus();
        setWeeklyStatuses(response.weeklyStatuses);
    };

    const fetchalltask = async () => {
        const res = await getAllTask(user.user_id);
        const taskData = res.map((data) => ({
            user_id: data.user_id,
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
        if (task.trim() === "" || task.length < 5 || task.length > 50) {
            alert('Task name must be between 5 and 50 characters.');
            return;
        }

        // Use the same time formatting logic here
        const formattedTime = handleTimeChange({ target: { value: time } });

        if (!formattedTime.match(timeFormat)) {
            alert('Time must be in the format "hh:mm:".');
            return;
        } 
        
        const newTask = {
            task_date: selectedDate,
            task_name: task,
            task_time: formattedTime, // Use formatted time
            user_id: user.user_id,
        };
        try {
            const res = await postTask(newTask);

            //success code
            const response = await getAllTask(user.user_id);
            const tasksForDate = response.filter((task) => task.task_date === dateStr(day));
            console.log(tasksForDate.filter(item => item.user_id == 2))
            setTasksForSelectedDate(tasksForDate);
            fetchData()

        } catch (error) {
            console.log("error", error);
        }

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
        if (name === "task_time") {
            // Remove non-digit characters and limit to 4 characters
            let formattedValue = value.replace(/\D/g, '').slice(0, 4);
            
            // Add colon after hours if applicable
            if (formattedValue.length > 2) {
                formattedValue = formattedValue.slice(0, 2) + ':' + formattedValue.slice(2);
            }

            // Ensure hours are between 00 and 23
            let hours = parseInt(formattedValue.slice(0, 2));
            if (hours > 23) {
                formattedValue = '23' + formattedValue.slice(2);
            }

            // Ensure minutes are between 00 and 59
            if (formattedValue.length > 2) {
                let minutes = parseInt(formattedValue.slice(3, 5));
                if (minutes > 59) {
                    formattedValue = formattedValue.slice(0, 3) + '59';
                }
            }

            // Do not accept "00:00"
            if (formattedValue === '00:00') {
                formattedValue = '';
            }

            // Update the state with the formatted value
            setEditedTask((prevTask) => ({ ...prevTask, [name]: formattedValue }));
        } else {
            setEditedTask((prevTask) => ({ ...prevTask, [name]: value }));
        }
    };

    const handleSave = async (taskId) => {

        const req_body = {
            task_name: editedTask.task_name,
            task_time: editedTask.task_time,
            task_date: selectedDate,
            user_id: localStorage.getItem("user_id"),
            approved_status: "pending"
        };

        const res = await editTask(taskId, req_body);

        setEditingTaskId(null);
        const response = await getAllTask(user.user_id);
        const tasksForDate = response.filter((task) => task.task_date === dateStr(day));
        setTasksForSelectedDate(tasksForDate);


    };

    const handleCancel = () => {
        setEditingTaskId(null);
    };

    const handleDelete = async (taskId) => {
        const res = await deleteTask(taskId);
        const response = await getAllTask(user.user_id);
        const tasksForDate = response.filter((task) => task.task_date === dateStr(day));
        setTasksForSelectedDate(tasksForDate);
    };

    const formatTime = (time) => {
        return time.slice(0, 5); // Extract the first 5 characters (HH:mm)
    };

    const closeModal = async () => {
        const response = await getAllTask(user.user_id);
        setAllTasks(response);
        setShow(false);
        setCurrDayStatus('pending');
        setTask(""); // Reset task to empty string
        setTime(""); // Reset time to empty string
    };

    return (
        <div className="p-5 bg-white">
            <ToastContainer/>
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
                <div className="flex space-x-4">
    <div className="flex items-center space-x-2">
        <span className=" bg-yellow-200 rounded-full text-yellow-200"><FaRegCircle /></span>
        <p>Pending</p>
    </div>
    <div className="flex items-center space-x-2">
        <span className="bg-green-300 rounded-full text-green-300"><FaRegCircle /></span>
        <p>Approved</p>
    </div>
    <div className="flex items-center space-x-2">
        <span className="bg-red-400 rounded-full text-red-400"><FaRegCircle /></span>
        <p>Rejected</p>
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
                    <div className="bg-white border-2 h-fit md:max-h-[550px] md:max-w-[850px] p-6 rounded shadow-lg relative">
                        <button onClick={closeModal}
                            className="absolute top-2 right-2 text-red-500 text-xl border border-red-500 rounded-full"
                        >
                            <IoIosClose />
                        </button>


                        {currDayStatus != 'approved' && (<form onSubmit={submitTask} className="space-y-4">
                            <h2 className="text-xl font-bold text-center mt-4">Add Task</h2>
                            <div className="flex flex-row gap-3">
                                <div className="w-full">
                                    <label className="block">Task:</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded"
                                        value={task}
                                        minLength={5}
                                        maxLength={50}
                                        onChange={(e) => setTask(e.target.value)}
                                    />
                                </div>

                                <div className="w-full">
                                    <label className="block">Time:</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded"
                                        value={time}
                                        placeholder="hh:mm"
                                        onChange={handleTimeChange}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="text-white bg-[#134572] px-4 py-2 rounded"
                                >
                                    Add
                                </button>
                            </div>
                        </form>)} 
                        <ul>
                            <div className="max-h-[200px] mt-2 w-full overflow-y-auto">
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

                                            {currDayStatus != 'approved' && (<th className="px-6 py-3 text-left text-xs text-center font-medium text-gray-500 uppercase tracking-wider">
                                                Action
                                            </th>)}




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
                                                            className="border px-2 py-1 w-[80%] border-1"
                                                        />
                                                    ) : (
                                                        task.task_name
                                                    )}
                                                </td>
                                                <td className="px-4 py-4  whitespace-nowrap text-sm text-gray-500">
                                                    {editingTaskId === task.task_id ? (
                                                        <input
                                                            type="text"
                                                            name="task_time"
                                                            value={formatTime(editedTask.task_time)}
                                                            onChange={handleInputChange}
                                                            className=" px-2 py-1 w-[80%] border-1"

                                                        />
                                                    ) : (
                                                        formatTime(task.task_time)
                                                    )}
                                                </td>
                                                {currDayStatus != 'approved' && (<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 ">
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
                                                        currDayStatus !== 'approved' && (
                                                            <div className="flex gap-4 w-full justify-center">
                                                                <button
                                                                    className="text-blue-600 hover:text-blue-900"
                                                                    onClick={() => handleEdit(task)}
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    className="text-red-600 hover:text-red-900"
                                                                    onClick={() => handleDelete(task.task_id)}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        ))}
                                                </td>)}

                                                {/* {currDayStatus != 'approved' && (<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <button
                                                        className="text-red-600 hover:text-red-900"
                                                        onClick={() => handleDelete(task.task_id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>)} */}
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
