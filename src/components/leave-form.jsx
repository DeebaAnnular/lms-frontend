import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, format, subDays } from "date-fns";
import { cn } from "../lib/utils";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  postLeave_req,
  getEmp_leave_balence,
  getAllOptionalHolidays,
  getAllCompulsoryHolidays,
  getAll_leave_req,
  getLeave_history_by_id
} from "../actions";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Define the validation schema using zod
const leaveSchema = z
  .object({
    leave_type: z.string().nonempty({ message: "Type of leave is required" }),
    session: z.string().nonempty({ message: "Leave duration is required" }),
    total_days: z.string().nonempty({ message: "Total days is required" }),
    from_date: z.string().nonempty({ message: "Start date is required" }),
    to_date: z.string().optional(),
    reason: z
      .string()
      .max(200, { message: "Reason cannot exceed 200 characters" })
      .optional(),
  })
  .superRefine((data, ctx) => {
    const from_date = new Date(data.from_date);
    const to_date = new Date(data.to_date);

    if (data.leave_type === "maternity_leave") {
      // No date restrictions for maternity leave
      return;
    }

    // Date range validation for non-maternity leave
    const currentDate = new Date();
    const minDate = subDays(currentDate, 30);
    const maxDate = addDays(currentDate, 90);

    if (data.leave_type === "optional_leave" && from_date > maxDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Optional Holiday can be applied only within 90 days from today",
        path: ["from_date"],
      });
    }

    if (from_date < minDate || from_date > maxDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Start date must be within 30 days in the past or 90 days in the future from today",
        path: ["from_date"],
      });
    }

    if (data.to_date) {
      if (to_date < from_date) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End date must be the same as or after the start date",
          path: ["to_date"],
        });
      }

      if (to_date < minDate || to_date > maxDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End date must be within 30 days in the past or 90 days in the future from today",
          path: ["to_date"],
        });
      }

      if (
        (data.session === "FN" || data.session === "AN") &&
        from_date.getTime() !== to_date.getTime()
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "For half-day leave, start date and end date must be the same",
          path: ["to_date"],
        });
      }
    }

    if (data.leave_type !== "optional_leave" && !data.reason) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Reason is required",
        path: ["reason"],
      });
    }
    
  });


const LeaveForm = ({ fetchLeaveBalanceById }) => {
  const user = useSelector((state) => state.user.userDetails);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    setError,
    clearErrors,
  } = useForm({
    resolver: zodResolver(leaveSchema),
  });

  const from_date = watch("from_date");
  const to_date = watch("to_date");
  const session = watch("session");
  const leave_type = watch("leave_type");
  const optional_date = watch("optional_date");

  const [totalDays, setTotalDays] = useState(0);
  const [leaveBalance, setLeaveBalance] = useState({});
  const [optionHolidays, setOptionHolidays] = useState([]);
  const [compulsaryHolidays, setCompulsaryHolidays] = useState([]);
  const [appliedOptionalHolidays, setAppliedOptionalHolidays] = useState([]);
  const [backendError, setBackendError] = useState(null);
  const [leaveMessage, setLeaveMessage] = useState(null);
  const [dateError, setDateError] = useState(null); 
  const [startDateError, setStartDateError] = useState(null);
const [endDateError, setEndDateError] = useState(null);
const fetchLeaveBalence = async () => {
  const resData = await getEmp_leave_balence(user.user_id || null);
  setLeaveBalance(resData);
};

const fetchAllLeaveRequest = async () => {
  const resData = await getLeave_history_by_id(user.user_id); 
  console.log("resdata-opt",resData)
if(resData.length <= 0)
{
  return ;
}
  const appliedOptionalLeaves = resData.data
    .filter((item) => item.user_id === user.user_id) // Filter for current user
    .filter((item) => item.leave_type === "optional_leave")
    .filter((item) => item.status === "pending" || item.status === "approved")
    .map((item) => new Date(item.from_date).toLocaleDateString("en-CA"));
  setAppliedOptionalHolidays(appliedOptionalLeaves);
}; 
useEffect(() => {
  console.log("triggered");
  if (optional_date) {
    setBackendError(null);
  }
}, [optional_date]); 

useEffect(() => {
  fetchAllLeaveRequest ();
},[]);

useEffect(() => {
  if (from_date) {
    clearErrors("from_date");
  }
  if (to_date) {
    clearErrors("to_date");
  }
}, [from_date, to_date, clearErrors]);
  useEffect(() => {

    const fetchOptionHoliday = async () => {
      const resData = await getAllOptionalHolidays();
      setOptionHolidays(resData);
    };
    const fetchCompulsaryHoliday = async () => {
      const resData = await getAllCompulsoryHolidays();
      const holidays = resData.map((item) =>
        new Date(item.date).toLocaleDateString("en-CA")
      );
      setCompulsaryHolidays(holidays);
    };

    

      fetchLeaveBalence();
    
    fetchOptionHoliday();
    fetchCompulsaryHoliday();
  }, [user.user_id]);

  const formatDateForBackend = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }; 

 
  useEffect(() => {
    if (leave_type) {
      setTotalDays(0);
      setValue("total_days", "0");
      setValue("from_date", "");
      setValue("to_date", "");
      setValue("session", "full_day");
      clearErrors();
    }
  }, [leave_type, setValue, clearErrors]);

  useEffect(() => {
    if (session === "FN" || session === "AN") {
      setValue("to_date", from_date);
      setTotalDays(0.5);
      setValue("total_days", "0.5");
    } 
    else if (leave_type === "optional_leave" && optional_date) {
      setValue("from_date", optional_date);
      setValue("to_date", optional_date);
      setTotalDays(1);
      setValue("total_days", "1");
    } else if (leave_type === "maternity_leave" && from_date) {
      const maternityBalance = leaveBalance.maternity_leave || 0;
      const startDate = new Date(from_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (maternityBalance === 0) {
        const validStartDate = startDate < today ? today : startDate;
        const formattedDate = validStartDate.toISOString().split("T")[0];
        setValue("from_date", formattedDate);
        setValue("to_date", formattedDate);
        setTotalDays(0);
        setValue("total_days", "0");
        setError("maternity_leave_balance", {
          type: "manual",
          message: "You don't have any maternity leave balance available.",
        });
      } else {
        const endDate = new Date(
          startDate.getTime() + (maternityBalance - 1) * 24 * 60 * 60 * 1000
        );
        console.log("endDate", endDate);

        if (isNaN(endDate.getTime())) {
          console.error("Invalid end date calculated");
          setValue("to_date", "");
        } else {
          setValue("to_date", endDate.toISOString().split("T")[0]);
        }

        setTotalDays(maternityBalance);
        setValue("total_days", maternityBalance.toString());
        clearErrors("maternity_leave_balance");
      }
    } else if (from_date && to_date) {
      const days = calculateTotalDays(from_date, to_date, leave_type);
      setTotalDays(days);
      setValue("total_days", days.toString());
    }
  }, [
    session,
    from_date,
    to_date,
    leave_type,
    optional_date,
    setValue,
    leaveBalance,
    setError,
    clearErrors,
  ]);

  const calculateTotalDays = (from_date, to_date, leaveType) => {
    const start = new Date(from_date);
    const end = new Date(to_date);
    let count = 0;

    // Ensure the end date is inclusive
    end.setHours(23, 59, 59, 999); // Set end date to the end of the day

    while (start <= end) {
        const day = start.getDay(); // Get the day of the week (0 = Sunday, 6 = Saturday)

        // Count only weekdays for sick, earned, and loss of pay
        if ((leaveType === "sick_leave" || leaveType === "earned_leave" || leaveType === "loss_of_pay") && (day !== 0 && day !== 6)) {
            count++;
        }
        // Count all days for work from home but exclude weekends
    else if (leaveType === "work_from_home" && (day !== 0 && day !== 6)) {
      count++;
    }
        start.setDate(start.getDate() + 1); // Move to the next day
    }

    return count; // Return the count of days
  };

  const onSubmit = async (data) => {
    console.log("optdata",data);
    // Check if start date is a weekend (Saturday or Sunday)
    const startDate = new Date(data.from_date);
    const endDate = new Date(data.to_date);
    const today = new Date();
    const minDate=subDays(today,30);
    const maxDate=addDays(today,90);

    startDate.setHours(0,0,0,0);
    today.setHours(0, 0, 0, 0); // Set time to midnight for comparison 



    clearErrors("from_date");
    clearErrors("to_date");
  
    // Check if start date is filled
    if (!data.from_date) {
      setError("from_date", {
        type: "manual",
        message: "Please enter the start date",
      });
    }
  
    // Check if end date is filled (except for optional leave and half-day sessions)
    if (
      data.leave_type !== "optional_leave" &&
      data.session !== "FN" &&
      data.session !== "AN" &&
      !data.to_date
    ) {
      setError("to_date", {
        type: "manual",
        message: "Please enter the end date",
      });
    }
  
    // If there are any errors, stop the form submission
    const hasErrors = Object.keys(errors).length > 0;
    if (hasErrors) {
      return;
    }

  //   if (!data.from_date) {
  //     setStartDateError("Please enter the start date");
  //     return;
  // }

  // // Check if end date is filled (except for optional leave and half-day sessions)
  // if (data.leave_type !== "optional_leave" && data.session !== "FN" && data.session !== "AN" && !data.to_date) {
  //     setEndDateError("Please enter the end date");
  //     return;
  // }

    // Set start date to midnight for comparison
    startDate.setHours(0, 0, 0, 0); 
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear(); 

    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    lastDayOfMonth.setHours(23,59,59,999);

    if (data.leave_type !== "maternity_leave") {
      if (startDate < minDate || startDate > maxDate) {
        setError("from_date", {
          type: "manual",
          message: "Start date must be within 30 days in the past and 90 days in the future from today",
        });
        return;
      }
      if (endDate < minDate || endDate > maxDate) {
        setError("to_date", {
          type: "manual",
          message: "End date must be within 30 days in the past and 90 days in the future from today",
        });
        return;
      }
    } 
    //  if(data.leaveType === "work_from_home") 
    //   {
    //     if (startDate.getDay() === 0 || startDate.getDay() === 6) {
    //       setLeaveMessage("work from home can't be applied on Saturday or Sunday.");
    //       return;
    //   }
       
    // }  
    if (data.leave_type === "work_from_home") {
      if (startDate.getDay() === 0 || startDate.getDay() === 6 || endDate.getDay() === 0 || endDate.getDay() === 6) {
        setLeaveMessage("Work from home can't be applied on Saturday or Sunday.");
        return;
      }
    }
   
    // Weekend check for Loss of Pay
    if (data.leave_type === "loss_of_pay") {
        if (startDate.getDay() === 0 || startDate.getDay() === 6) {
            setLeaveMessage("Loss of pay can't be applied on Saturday or Sunday.");
            return;
        }  
       

        const sickLeaveBalance = leaveBalance.sick_leave || 0;
        const earnedLeaveBalance = leaveBalance.earned_leave || 0;

        // Check if either Sick or Earned leave balance is greater than 0
        if (sickLeaveBalance > 0 || earnedLeaveBalance > 0) {
            setLeaveMessage("Loss of Pay can only be applied if Sick and Earned leave balances are 0.");
            return;
        }
    }
    if (data.leave_type === "optional_leave") {
      data.reason = "optional leave";
    }
    // Check if session is FN or AN and start date is not today
    // if ((data.session === "FN" || data.session === "AN") && startDate.getTime() !== today.getTime()) {
    //     setLeaveMessage("Leave can only be applied today for FN or AN sessions.");
    //     return;
    // }  
    // if(data.leaveType === "work_from_home") 
    //   {
    //     if (startDate.getDay() === 0 || startDate.getDay() === 6) {
    //       setLeaveMessage("work from home can't be applied on Saturday or Sunday.");
    //       return;
    //   }
       
    // } 
    

    // // Weekend check for all leave types except Work From Home
    // if (data.leave_type === "work_from_home") {
    //   if (startDate.getDay() === 0 || startDate.getDay() === 6 || endDate.getDay() === 0 || endDate.getDay() === 6) {
    //     setError('WFH leave can only be applied on weekdays (Monday to Friday).');
    //     return;
    //   }
    // }
    
    // Allow Work From Home without checking leave balance
    if (data.leave_type === "work_from_home") {
      if (startDate.getDay() === 0 || startDate.getDay() === 6 || endDate.getDay() === 0 || endDate.getDay() === 6) {
        setError('WFH leave can only be applied on weekdays (Monday to Friday).');
        return;
      }
    }
    else {
        // Check if leave type is not optional or maternity and if end date is a weekend
        if ((data.leave_type !== "optional_leave" && data.leave_type !== "maternity_leave" && data.leave_type !== "work_from_home") && 
            (endDate.getDay() === 0 || endDate.getDay() === 6)) {
            setLeaveMessage("Can't apply leave on Saturday or Sunday.");
            return;
        }

        // Remove balance check for Loss of Pay
        if (data.leave_type !== "loss_of_pay") {
            const availableBalance = leaveBalance[data.leave_type] || 0;
            const totalDaysRequested = totalDays;

            if (totalDaysRequested > availableBalance) {
              const leaveTypeDisplay = data.leave_type === "optional_leave" ? "optional holiday" : data.leave_type.replace("_", " ");
              setLeaveMessage(
                  `Requested leave exceeds available balance. You have ${availableBalance} days left for ${leaveTypeDisplay}.`
              );
                return;
            }
        }
    }

    // Convert dates to DD-MM-YYYY format for backend
    data.from_date = data.from_date;
    data.to_date = data.to_date;
    // console.log("data", data.from_date, data.to_date);

    const leaveType = data.leave_type;
    const totalDaysRequested = totalDays;
    const availableBalance = leaveBalance[leaveType] || 0;

    if (leaveType === "maternity_leave" && availableBalance === 0) {
      setLeaveMessage("You don't have any maternity leave balance available.");
      return;
    }

    data.total_days = totalDaysRequested;
    data.user_id = user.user_id || null;
    // data.emp_name = user.user_id || null;
    // data.reason=data.reason;
    console.log("data-optional",data)

    const result = await postLeave_req(data);


    if (result.statusCode === 201 ) {
      
      reset();
      setTotalDays(0);
      fetchLeaveBalence();
      fetchAllLeaveRequest();
      toast.success("Leave Applied successfully.");
      fetchLeaveBalanceById();
      setBackendError(null);
      setLeaveMessage(null);
    } else {
      setBackendError(
        result.data.message
        
        // "There was an error submitting the form. Please check your leave balance."
      );
      console.log("backenderror",result.data.message);
      console.error("There was an error submitting the form");
    }
  }; 

  const currentDate = new Date().toLocaleDateString("en-CA");

  return (
    <div className="flex p-5 w-[65%] h-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col p-5 w-full h-full gap-5 border-r border-r-[#DCDCDC]"
      >
        <div className="h-[90%] w-full pl-3 flex flex-col items-start">
          <div className="flex flex-col w-full gap-4">
            <label htmlFor="leave_type" className="text-[#373857] text-[13px]">
              Leave Type
            </label>
            <div className="w-full">
              <select
                id="leave_type"
                {...register("leave_type", {
                    onChange: () => {
                        // Clear any existing leave message when leave type changes
                        setLeaveMessage(null);
                        setTotalDays(0);
                        // setErrorMessage(null); // Clear all error messages
                        setBackendError(null); // Clear backend errors
                        setDateError(null); // Clear date-related errors
                        setStartDateError(null); // Clear start date errors
                        setEndDateError(null); // Clear end date errors
                        setValue("from_date", ""); // Clear start date
                        setValue("to_date", ""); // Clear end date
                        setValue("total_days", "0");
                        setValue("session", "full_day");
                        setValue("optional_date", ""); 

                    }
                })}
                className="px-2 text-[13px] rounded-md py-2 border w-[90%]"
              >
                <option value="" className="text-[#99A0B0]">
                  Select
                </option>
                <option value="sick_leave">Sick Leave</option>
                <option value="earned_leave">Earned Leave</option>
                <option value="optional_leave">Optional Holiday</option>
                <option value="maternity_leave">Maternity Leave</option>
                <option value="loss_of_pay">Loss Of Pay</option>
                <option value="work_from_home">Work From Home</option>
              </select>
            </div>

            {leave_type === "maternity_leave" &&
            leaveBalance.maternity_leave === 0 ? (
              <p className="text-red-500 mt-4">
                No maternity leave balance available to apply.
              </p>
            ) : (
              <>
                {leave_type !== "optional_leave" && (
                  <>
                    {leave_type !== "maternity_leave" && (
                      <div className="w-full flex flex-col gap-4">
                        <label
                          htmlFor="session"
                          className="text-[#373857] text-[13px]"
                        >
                          Session
                        </label>
                        <div className="w-full">
                          <select
                            id="session"
                            {...register("session", {
                                onChange: (e) => {
                                    const selectedSession = e.target.value;
                                    // Clear any existing leave message when session changes
                                    setLeaveMessage(null);
                                    // If session is FN or AN, clear the date fields
                                    if (selectedSession === "FN" || selectedSession === "AN") {
                                        setValue("from_date", ""); // Clear start date
                                        setValue("to_date", ""); // Clear end date
                                    }
                                }
                            })}
                            className="p-2 rounded-md border w-[90%] text-[12px]"
                          >
                            <option value="full_day">Full Day</option>
                            <option value="FN">FN</option>
                            <option value="AN">AN</option>
                          </select>
                        </div>
                      </div>
                    )}
                    {(leave_type !== "maternity_leave" ||
                      leaveBalance.maternity_leave > 0) && (
                      <>
                        <div className=" flex flex-col gap-4 w-[90%]">
                          <label
                            htmlFor="from_date"
                            className="text-[#373857] min-w-fit text-[13px]"
                          >
                            Start Date
                          </label>
                          <input
                                type="date"
                                id="from_date"
                                {...register("from_date")}
                                className={`block w-full text-[12px] rounded-md border p-2 ${
                                  errors.from_date ? "border-red-500" : ""
                                }`}
                            // min={subDays(new Date(), 30).toISOString().split('T')[0]}
                            // max={addDays(new Date(), 90).toISOString().split('T')[0]}

                                // max={new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0]}
                                onChange={(e) => {
                                  setStartDateError(null);
                                  setError("from_date","");
                                  setBackendError(null);
                                  
                                  const dateValue = e.target.value;
                                  const year = dateValue.split("-")[0]; // Extract the year from the date string

                                  if (year.length > 4) {
                                    const formattedDate = `${dateValue.split("-")[2]}-${dateValue.split("-")[1]}-${dateValue.split("-")[0]}`; // Format to DD-MM-YYYY
                                    setDateError(`Year Out of range: ${formattedDate}`); // Set error message if year exceeds 4 digits
                                    setValue("from_date", ""); // Clear the input
                                  } else {
                                    setDateError(null); // Clear error if valid
                                    setValue("from_date", dateValue);
                                    if (session === "FN" || session === "AN") {
                                      setValue("to_date", dateValue);
                                    }
                                  }
                                }}
                              />
                              {errors.from_date && (
    <p className="text-red-500 text-sm mt-1">{errors.from_date.message}</p>
  )}
                                                      </div>
                        <div className="w-[90%] flex flex-col gap-4 ">
                          <label
                            htmlFor="to_date"
                            className="text-[#373857] min-w-fit text-[13px]"
                          >
                            End Date
                          </label>
                          <input
                            type="date"
                            id="to_date"
                            {...register("to_date")}
                            className="block w-full rounded-md text-[12px] border p-2"
                            // min={subDays(new Date(), 30).toISOString().split('T')[0]}
                            // max={addDays(new Date(), 90).toISOString().split('T')[0]}
                            onChange={(e) => {
                              setEndDateError(null);
                              setError("to_date","");
                              setBackendError(null);
                              const dateValue = e.target.value;
                              const year = dateValue.split("-")[0]; // Extract the year from the date string

                              if (year.length > 4) {
                                  const formattedDate = `${dateValue.split("-")[2]}-${dateValue.split("-")[1]}-${dateValue.split("-")[0]}`; // Format to DD-MM-YYYY
                                  setDateError(`Year Out of range: ${formattedDate}`); // Set error message if year exceeds 4 digits
                                  setValue("to_date", ""); // Clear the input
                              } else {
                                  setDateError(null); // Clear error if valid
                                  setValue("to_date", dateValue);
                              }
                            }}
                          />
                          {errors.to_date && (
    <p className="text-red-500 text-sm mt-1">{errors.to_date.message}</p>
  )}
                        </div>
                        <div className="w-full flex flex-col gap-4">
                          <label
                            htmlFor="reason"
                            className="text-[#373857] text-lg min-w-fit text-[13px]"
                          >
                            Reason
                          </label>
                          <Input
                            type="text"
                            id="reason"
                            {...register("reason")}
                            className="block w-[90%] rounded-md h-[5rem] p-2 border text-[12px]"
                            minLength={10}
                            maxLength={200}
                          />
                        </div>
                      </>
                    )}
                  </>
                )}
                {leave_type === "optional_leave" && (
                  <div className="w-full flex flex-col gap-4">
                    <label
                      htmlFor="optional_date"
                      className="text-[#373857] text-[16px]"
                    >
                      Select Optional Holiday
                    </label>
                    <div className="w-full">
                      <select
                        id="optional_date"
                        {...register("optional_date")}
                        className="px-2 rounded-md py-2 border w-[90%]"
                      >
                        <option value="" className="text-[#99A0B0]">
                          Select
                        </option>
                        {optionHolidays
                          .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort by date
                          .map((holiday, index) => {
                            const holidayDate = new Date(holiday.date);
                            const formattedDisplayDate = `${String(
                              holidayDate.getDate()
                            ).padStart(2, "0")}-${String(
                              holidayDate.getMonth() + 1
                            ).padStart(2, "0")}-${holidayDate.getFullYear()}`;
                            // const isDisabled = holidayDate < new Date(); // Disable if the date is before today
                            const isDisabled =
                            holidayDate < new Date().setHours(0, 0, 0, 0) || appliedOptionalHolidays.includes(holiday.date);
                            return (
                          <option
                            key={holiday.date}
                            value={holiday.date}
                            disabled={isDisabled}
                          >
                            {formattedDisplayDate} - {holiday.description}
                          </option>
                            );
                          })}
                      </select>
                      {errors.from_date && (
    <p className="text-red-500 text-sm mt-1">{errors.from_date.message}</p>
  )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          {leave_type === "maternity_leave" &&
            errors.maternity_leave_balance && (
              <p className="text-red-500">
                {errors.maternity_leave_balance.message}
              </p>
            )}
          {totalDays > 0 && (
            <p className="my-3">
              {`Total Day(s)`}: {totalDays}
            </p>
          )}

          {errors.leave_type && (
            <p className="text-red-500">{errors.leave_type.message}</p>
          )}
          {errors.session && (
            <p className="text-red-500">{errors.session.message}</p>
          )}
          {/* {errors.from_date && (
            <p className="text-red-500">{errors.from_date.message}</p>
          )}
          {errors.to_date && (
            <p className="text-red-500">{errors.to_date.message}</p>
          )} */}
          {errors.reason && (
            <p className="text-red-500">{errors.reason.message}</p>
          )}

          {(backendError || leaveMessage) && (
            <p className="text-red-500 mt-4">{backendError || leaveMessage}</p>
          )} 

          {startDateError && <p className="text-red-500 mt-2">{startDateError}</p>}
          {endDateError && <p className="text-red-500 mt-2">{endDateError}</p>}

          {dateError && <p className="text-red-500">{dateError}</p>}

          {leave_type !== "maternity_leave" ||
          (leave_type === "maternity_leave" &&
            leaveBalance.maternity_leave > 0) ? (
            <div className="flex w-[90%] justify-end">
              <Button type="submit" className="mt-4 text-white text-xs hover:text-[#A6C4F0] hover:bg-[#134572]  bg-[#134572]">
                Submit
              </Button>
            </div>
          ) : (
            <div>
              <p className="text-red-500">No maternity leaves to apply</p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default LeaveForm;