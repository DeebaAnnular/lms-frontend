"use client";
import { Button } from "../../../components/ui/button"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { useState,useEffect } from "react";
import { cn } from "../../../lib/utils";
import { Calendar} from "../../../components/ui/calender"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover" 
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "../../../components/ui/table"
import { capitalizeWords } from "../../../utils";

 
const page=()=>{
    const [date, setDate] = useState(null);
    const [leaveType, setLeaveType] = useState("");
    const [description, setDescription] = useState("");
    const [holidays, setHolidays] = useState([]);

    const fetchHolidays = async () => {
        try {
          const response = await fetch("http://localhost:3000/api/holiday/get_all_holidays");
          
          if (!response.ok) {
            throw new Error("Failed to fetch holidays");
          }
          const data = await response.json();
          console.log("res",data)
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
          holiday_type:leaveType,
          description,
        };
      
        try {
          const response = await fetch('http://localhost:3000/api/holiday/create_holiday', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });
      
          if (!response.ok) {
            throw new Error('Failed to add holiday');
          }
      
          alert('Holiday added successfully');
          setDate(null);
          setLeaveType('');
          setDescription('');
          fetchHolidays();
        } catch (error) {
          console.error('Error adding holiday:', error.message);
          alert('Failed to add holiday. Please try again later.');
        }
      };
      

    return(
        <>
<div className="w-full border overflow-hidden ">
        <h1 className="text-2xl font-bold ml-4 my-2 mb-4">Add Holidays</h1>
        <div className="w-[230px]">
          <form className="flex mb-4 outline-none" onSubmit={handleSubmit}>
            <div className="mr-5 flex items-center">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal ml-5",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-center">
              <select
                className="border rounded-md text-sm h-10 p-2"
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
              >
                <option value="">Select leave type</option>
                <option value="optional_holidays">Optional Leave</option>
                <option value="compulsory_holidays">Compulsory Leave</option>
              </select>
            </div>
            <div className="flex items-center ml-5">
              <input
                className="border rounded-md text-sm w-[250px] h-10 p-2"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="w-full ml-4">
              <Button className="px-5 py-2 bg-green-400 rounded-md mr-[250px]">
                Add
              </Button>
            </div>
          </form>
        </div>
      </div>
      <div className="border m-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>S.No</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type of Leave</TableHead>
              <TableHead>Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {holidays.map((holiday, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="font-medium">{format(new Date(holiday.date), "PPP")}</TableCell>
                <TableCell>{holiday.holiday_type === "optional_holidays" ? "Optional Leave" : "Compulsory Leave"}</TableCell>
                <TableCell>{capitalizeWords(holiday.description)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    

        </>
    )
 }

export default page;