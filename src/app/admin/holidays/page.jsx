"use client";
import { Button } from "../../../components/ui/button";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "../../../lib/utils";
import { Calendar } from "../../../components/ui/calender";
import { MdDelete } from "react-icons/md"; 
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { capitalizeWords } from "../../../utils";
import { ToastContainer,toast } from "react-toastify";

const Page = () => {
  const [date, setDate] = useState(null);
  const [leaveType, setLeaveType] = useState("");
  const [description, setDescription] = useState("");
  const [holidays, setHolidays] = useState([]);

  const fetchHolidays = async () => {
    try {
      const response = await fetch("http://13.201.79.49:9091/api/holiday/get_all_holidays");

      if (!response.ok) {
        throw new Error("Failed to fetch holidays");
      }
      const data = await response.json();
      console.log("res", data);
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
    const data = {
      date: format(date, "yyyy-MM-dd"),
      holiday_type: leaveType,
      description,
    };

    try {
      console.log("data", data);
      const response = await fetch("http://13.201.79.49:9091/api/holiday/create_holiday", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to add holiday");
      }

      // alert("Holiday added successfully");
      toast.success("Holiday added successfully")
      setDate(null);
      setLeaveType("");
      setDescription("");
      fetchHolidays();
    } catch (error) {
      console.error("Error adding holiday:", error.message);
      alert("Failed to add holiday. Please try again later.");
    }
  };

  const handleDelete = async (id) => {
    console.log("id",id);
    try {
      const response = await fetch(`http://13.201.79.49:9091/api/holiday/delete_holiday/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete holiday");
      }

      // alert("Holiday deleted successfully");
     toast.success("Holiday Deleted", {
                    style: {
                        
                        color: '#90EE90', 
                    },
                });
      fetchHolidays();
    } catch (error) {
      console.error("Error deleting holiday:", error.message);
      // alert("Failed to delete holiday. Please try again later.");
    }
  };

  return (
    <>
      <div className="w-full border bg-white overflow-hidden ">
        <ToastContainer />
        <h1 className="text-2xl font-bold ml-4 my-2 mb-4">Add Holidays</h1>
        <div className=" ">
          <form className="px-1 flex gap-2 flex-row items-center justify-between mb-4 outline-none" onSubmit={handleSubmit}>
            <div className="flex-1 flex items-center">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-1 items-center">
              <select
                className="border w-full rounded-md text-sm h-10 p-2"
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
              >
                <option value="">Select leave type</option>
                <option value="optional_holidays">Optional Leave</option>
                <option value="compulsory_holidays">Compulsory Leave</option>
              </select>
            </div>

            <div className="flex flex-1 items-center ">
              <input
                className="border rounded-md text-sm w-full h-10 p-2"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className=" ">
              <Button className="px-5 py-2 bg-black rounded-md ">Add</Button>
            </div>
          </form>
        </div>
      </div>
      <div className="border p-2 bg-white mt-5">
        <Table>
          <TableHeader className="bg-[#f7f7f7] h-[60px] text-[#333843]">
            <TableRow>
              <TableHead className="text-[16px] font-bold text-[#333843] p-3">S.No</TableHead>
              <TableHead className="text-[16px] font-bold text-[#333843]">Date</TableHead>
              <TableHead className="text-[16px] font-bold text-[#333843]">Type of Leave</TableHead>
              <TableHead className="text-[16px] font-bold text-[#333843]">Name</TableHead>
              <TableHead className="text-[16px] font-bold text-[#333843] p-2">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-[#667085]">
            {holidays.map((holiday, index) => (
              <TableRow key={index} >
                <TableCell className="">{index + 1}</TableCell>
                <TableCell className="font-medium">{format(new Date(holiday.date), "PPP")}</TableCell>
                <TableCell>{holiday.holiday_type === "optional_holidays" ? "Optional Leave" : "Compulsory Leave"}</TableCell>
                <TableCell>{capitalizeWords(holiday.description)}</TableCell>
                <TableCell className="" onClick={() => handleDelete(holiday.holiday_id)}><MdDelete className="cursor-pointer" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default Page;