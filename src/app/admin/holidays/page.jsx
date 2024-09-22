"use client"
import React, { useState, useEffect } from 'react';
import { Button } from "../../../components/ui/button";
import { format, isValid, parse } from "date-fns";
import { ArrowUpDown } from "lucide-react";
import { MdDelete } from "react-icons/md";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { capitalizeWords } from "../../../utils";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Page = () => {
  const [date, setDate] = useState("");
  const [leaveType, setLeaveType] = useState("");
  const [description, setDescription] = useState("");
  const [holidays, setHolidays] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'ascending' });
  const [errors, setErrors] = useState({
    date: '',
    leaveType: '',
    description: ''
  });

  const sortedHolidays = [...holidays].sort((a, b) => {
    const isAsc = sortConfig.direction === 'ascending';
    if (sortConfig.key === 'date') {
      return isAsc ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
    } else if (sortConfig.key === 'leaveType') {
      return isAsc ? a.holiday_type.localeCompare(b.holiday_type) : b.holiday_type.localeCompare(a.holiday_type);
    }
    return 0;
  });

  const handleDateSelect = (e) => {
    const input = e.target.value;
    
    // Allow empty input
    if (input === "") {
      setDate("");
      setErrors(prev => ({ ...prev, date: '' }));
      return;
    }

    // Validate the input format
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(input)) {
      setErrors(prev => ({ ...prev, date: 'Invalid date format' }));
      return;
    }

    // Parse the date and check if it's valid
    const parsedDate = parse(input, 'yyyy-MM-dd', new Date());
    if (!isValid(parsedDate)) {
      setErrors(prev => ({ ...prev, date: 'Invalid date' }));
      return;
    }

    // If all checks pass, update the state
    setDate(input);
    setErrors(prev => ({ ...prev, date: '' }));
  };

  const handleLeaveTypeChange = (e) => {
    setLeaveType(e.target.value);
    setErrors(prev => ({ ...prev, leaveType: '' }));
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    setErrors(prev => ({ ...prev, description: '' }));
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const fetchHolidays = async () => {
    try {
      const response = await fetch("https://lms-api.annularprojects.com:3001/api/holiday/get_all_holidays");
      if (!response.ok) {
        throw new Error("Failed to fetch holidays");
      }
      const data = await response.json();
      setHolidays(data);
    } catch (error) {
      console.error("Error fetching holidays:", error.message);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!date) {
      newErrors.date = "Please select a date";
    } else {
      const parsedDate = parse(date, 'yyyy-MM-dd', new Date());
      if (!isValid(parsedDate)) {
        newErrors.date = "Invalid date";
      }
    }

    if (!leaveType) {
      newErrors.leaveType = "Please select a leave type";
    }

    if (!description.trim()) {
      newErrors.description = "Please enter a description";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    const data = {
      date: date,
      holiday_type: leaveType,
      description,
    };
    try {
      const response = await fetch("https://lms-api.annularprojects.com:3001/api/holiday/create_holiday", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add holiday");
      }

      toast.success("Holiday added successfully");

      setDate("");
      setLeaveType("");
      setDescription("");
      setErrors({});
      
      fetchHolidays();
    } catch (error) {
      console.error("Error adding holiday:", error.message);
      toast.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://lms-api.annularprojects.com:3001/api/holiday/delete_holiday/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete holiday");
      }

      toast.success("Holiday Deleted successfully")
      fetchHolidays();
    } catch (error) {
      console.error("Error deleting holiday:", error.message);
      toast.error("Failed to delete holiday. Please try again later.");
    }
  };

  return (
    <>
      <div className="w-full border bg-white overflow-hidden ">
        <ToastContainer />
        <h1 className="text-xl font-bold ml-4 my-2 mb-4">Add Holidays</h1>
        <div className=" ">
        <form className="px-1 flex gap-2 flex-row items-start justify-between mb-4 outline-none" onSubmit={handleSubmit}>
            <div className="flex-1 flex flex-col items-center w-[100px]">
              <input
                type="date"
                value={date}
                onChange={handleDateSelect}
                className="border w-full rounded-md text-xs h-8 p-2"
                max="9999-12-31"
              />
              <div className="h-5 mt-1">
              {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
              </div>
            </div>

            <div className="flex flex-1 flex-col items-center">
              <select
                className="border w-full rounded-md text-xs h-8 p-2"
                value={leaveType}
                onChange={handleLeaveTypeChange}
              >
                <option value="">Select</option>
                <option value="optional_holidays">Optional Holiday</option>
                <option value="compulsory_holidays">Mandatory Holiday</option>
              </select>
              <div className="h-5 mt-1">
              {errors.leaveType && <p className="text-red-500 text-xs mt-1">{errors.leaveType}</p>}
              </div>
            </div>

            <div className="flex flex-1 flex-col items-center">
              <input
                className="border rounded-md text-xs w-full h-8 p-2"
                placeholder="Description"
                value={description}
                onChange={handleDescriptionChange}
              />
              <div className="h-5 mt-1">
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>
            </div>

            <div className=" ">
              <Button className="px-4 py-1 h-8 text-white hover:text-[#A6C4F0] hover:bg-[#134572]  bg-[#134572] rounded-md ">Add</Button>
            </div>
          </form>
        </div>
      </div>
      <div className="border p-2 bg-white mt-5">
        <Table>
          <TableHeader className="bg-[#f7f7f7] h-[60px] text-[#333843]">
            <TableRow>
              <TableHead className="text-[13px] font-bold text-[#333843] p-3">S.No</TableHead>
              <TableHead className="text-[13px] font-bold text-[#333843] cursor-pointer" onClick={() => requestSort('date')}>
                Date <ArrowUpDown className="inline w-4 h-4" />
              </TableHead>
              <TableHead className="text-[13px] font-bold text-[#333843] cursor-pointer" onClick={() => requestSort('leaveType')}>
                Leave Type <ArrowUpDown className="inline w-4 h-4" />
              </TableHead>
              <TableHead className="text-[13px] font-bold text-[#333843]">Description</TableHead>
              <TableHead className="text-[13px] font-bold text-[#333843] p-2">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-[#667085]">
            {sortedHolidays.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">No records found</TableCell>
              </TableRow>
            ) : (
              sortedHolidays.map((holiday, index) => (
                <TableRow key={index} className="text-[12px]">
                  <TableCell className="">{index + 1}</TableCell>
                  <TableCell className="font-medium">{format(new Date(holiday.date), "dd-MM-yyyy")}</TableCell>
                  <TableCell>{holiday.holiday_type === "optional_holidays" ? "Optional Holiday" : "Mandatory Holiday"}</TableCell>
                  <TableCell>{capitalizeWords(holiday.description)}</TableCell>
                  <TableCell className="" onClick={() => handleDelete(holiday.holiday_id)}><MdDelete className="cursor-pointer" /></TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default Page;