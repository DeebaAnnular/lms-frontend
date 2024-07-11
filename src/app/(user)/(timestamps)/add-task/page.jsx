"use client";

import { useState, useEffect } from 'react';
import { IoIosClose } from 'react-icons/io';

import { postTask, getAllTask } from '../../../../actions';
import { formatDate } from '../../../../utils';

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [days, setDays] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [taskId, setTaskId] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [task, setTask] = useState('');
    const [time, setTime] = useState('');
    const [show, setShow] = useState(false);

    useEffect(() => {
        generateCalendar();
    }, [currentDate]);

    // Generating calendar
    const generateCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const tempDays = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            tempDays.push('');
        }
        for (let i = 1; i <= daysInMonth; i++) {
            tempDays.push(i);
        }
        setDays(tempDays);
    };

    const changeMonth = (direction) => {
        setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + direction)));
    };

    const changeYear = (event) => {
        const newYear = parseInt(event.target.value, 10);
        const newDate = new Date(currentDate.setFullYear(newYear));
        setCurrentDate(newDate);
    };

    const yearOptions = [];
    for (let i = 1900; i <= 2100; i++) {
        yearOptions.push(i);
    }

    const formatApiDate = (date) => {
        return date.toString().split('T')[0];
    }

    const handleAddTask = (day) => {
        setShow(true);
        const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        setTaskId(dateStr);
        setSelectedDate(dateStr);
    };

    const fetch = async (data) => {
        const response = await postTask(data);
        return response;
    };

    const [allTasks, setAllTasks] = useState([]);
    const fetchData = async () => {
        const response = await getAllTask();
        setAllTasks(response);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const submitTask = async (e) => {
        e.preventDefault();
        const timeFormat = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
        if (!time.match(timeFormat)) {
            alert('Time must be in the format "hh:mm:ss".');
            return;
        }
        const newTask = {
            task_date: selectedDate,
            task_name: task,
            task_time: time,
            user_id: localStorage.getItem('user_id'),
        };
        try {
            const res = await postTask(newTask);
            console.log(res);
        } catch (error) {
            console.log("error", error);
        }
        setShow(false);
        setTask('');
        setTime('');
        fetchData();
    };

    return (
        <div className="px-12 pt-2">
            <header className="flex justify-between items-center mb-4">
                <button onClick={() => changeMonth(-1)} className="px-2 py-1 bg-gray-200 rounded">Previous</button>
                <h1 className="flex items-center">
                    {currentDate.toLocaleString('default', { month: 'long' })}
                    <select onChange={changeYear} value={currentDate.getFullYear()} className="ml-2 px-2 py-1 border rounded">
                        {yearOptions.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </h1>
                <button onClick={() => changeMonth(1)} className="px-2 py-1 bg-gray-200 rounded">Next</button>
            </header>

            <div className="grid grid-cols-7 gap-4">
                <div className="flex justify-center font-bold">Sun</div>
                <div className="flex justify-center font-bold">Mon</div>
                <div className="flex justify-center font-bold">Tue</div>
                <div className="flex justify-center font-bold">Wed</div>
                <div className="flex justify-center font-bold">Thu</div>
                <div className="flex justify-center font-bold">Fri</div>
                <div className="flex justify-center font-bold">Sat</div>
                {days.map((day, index) => {
                    const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                    return (
                        <div key={index}  >
                            <div
                                className={`day-wrapper flex justify-between px-3  ${day ? 'bg-gray-300' : ''}`}
                                onClick={() => day && handleAddTask(day)}
                            >
                                <p>{day && day}</p>
                                <p>{day && "+"}</p>
                            </div>
                            <div className={`day  min-h-[80px] max-h-[80px] overflow-clip line-clamp-3 ${day ? 'text-center p-2 bg-gray-100' : ''}`}>
                                {day && (
                                    <ul>
                                        {allTasks
                                            .filter(
                                                (task) =>
                                                    formatApiDate(task.task_date) === dateStr &&
                                                    task.user_id == localStorage.getItem('user_id')
                                            )
                                            .map((task) => (
                                                <li key={task.id} clas> {task.task_name}</li>
                                            ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    );
                })}
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
                        <h1 className="text-2xl font-bold text-center mb-4">Add Task</h1>
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
                                    placeholder="hh:mm:ss"
                                    onChange={(e) => setTime(e.target.value)}
                                />
                            </div>
                            <div className="flex justify-end">
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calendar;
