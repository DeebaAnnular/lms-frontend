import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { cn } from "../lib/utils";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  postLeave_req,
  getEmp_leave_balence,
  getAllOptionalHolidays,
  getAllCompulsoryHolidays,
  getAll_leave_req,
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
    from_date: z.string().refine(
      (date) => {
        const selectedDate = new Date(date);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        return selectedDate >= currentDate;
      },
      {
        message: "Start date must be today or later",
      }
    ),
    to_date: z.string(),
    reason: z
      .string()
      .max(200, { message: "Reason cannot exceed 200 characters" })
      .optional(),
  })
  .superRefine((data, ctx) => {
    const from_date = new Date(data.from_date);
    const to_date = new Date(data.to_date);

    if (to_date < from_date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date must be the same as or after the start date",
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
  const [appliedOptionalLeaves, setAppliedOptionalHolidays] = useState([]);
  const [backendError, setBackendError] = useState(null);
  const [leaveMessage, setLeaveMessage] = useState(null);
  const [dateError, setDateError] = useState(null);

  useEffect(() => {
    const fetchLeaveBalence = async () => {
      const resData = await getEmp_leave_balence(user.user_id || null);
      setLeaveBalance(resData);
    };

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

    const fetchAllLeaveRequest = async () => {
      const resData = await getAll_leave_req();
      const appliedOptionalLeaves = resData
        .filter((item) => item.user_id === user.user_id) // Filter for current user
        .filter((item) => item.leave_type == "optional_leave")
        .map((item) => new Date(item.from_date).toLocaleDateString("en-CA"));
      setAppliedOptionalHolidays(appliedOptionalLeaves);
    };

    fetchLeaveBalence();
    fetchOptionHoliday();
    fetchCompulsaryHoliday();
    fetchAllLeaveRequest();
  }, [user.user_id,leaveBalance]);

  const formatDateForBackend = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    if (session === "FN" || session === "AN") {
      setValue("to_date", from_date);
      setTotalDays(0.5);
      setValue("total_days", "0.5");
    } else if (leave_type === "optional_leave" && optional_date) {
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
        // Count all days for work from home
        else if (leaveType === "work_from_home") {
            count++;
        }

        start.setDate(start.getDate() + 1); // Move to the next day
    }

    return count; // Return the count of days
  };

  const onSubmit = async (data) => {
    // Check if start date is a weekend (Saturday or Sunday)
    const startDate = new Date(data.from_date);
    const endDate = new Date(data.to_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight for comparison

    // Set start date to midnight for comparison
    startDate.setHours(0, 0, 0, 0);

    // Weekend check for Loss of Pay
    if (data.leave_type === "loss_of_pay") {
        if (startDate.getDay() === 0 || startDate.getDay() === 6) {
            setLeaveMessage("Loss of Pay can't be applied on Saturday or Sunday.");
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

    // Check if session is FN or AN and start date is not today
    if ((data.session === "FN" || data.session === "AN") && startDate.getTime() !== today.getTime()) {
        setLeaveMessage("Leave can only be applied today for FN or AN sessions.");
        return;
    }

    // Weekend check for all leave types except Work From Home
    if (data.leave_type !== "work_from_home" && (startDate.getDay() === 0 || startDate.getDay() === 6)) {
        setLeaveMessage("Can't apply leave on Saturday or Sunday.");
        return;
    }
    
    // Allow Work From Home without checking leave balance
    if (data.leave_type === "work_from_home") {
        // No checks for leave balance or any other conditions
    } else {
        // Check if leave type is not optional or maternity and if end date is a weekend
        if ((data.leave_type !== "optional_leave" && data.leave_type !== "maternity_leave") && 
            (endDate.getDay() === 0 || endDate.getDay() === 6)) {
            setLeaveMessage("Can't apply leave on Saturday or Sunday.");
            return;
        }

        // Remove balance check for Loss of Pay
        if (data.leave_type !== "loss_of_pay") {
            const availableBalance = leaveBalance[data.leave_type] || 0;
            const totalDaysRequested = totalDays;

            if (totalDaysRequested > availableBalance) {
                setLeaveMessage(
                    `Requested leave exceeds available balance. You have ${availableBalance} days left for ${data.leave_type.replace(
                        "_",
                        " "
                    )}.`
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
    data.emp_name = user.user_id || null;

    const result = await postLeave_req(data);

    if (result) {
      reset();
      setTotalDays(0);
      toast.success("Leave Applied successfully.");
      fetchLeaveBalanceById();
      setBackendError(null);
      setLeaveMessage(null);
    } else {
      setBackendError(
        "There was an error submitting the form. Please check your leave balance."
      );
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
            <label htmlFor="leave_type" className="text-[#373857] text-[16px]">
              Leave Type
            </label>
            <div className="w-full">
              <select
                id="leave_type"
                {...register("leave_type", {
                    onChange: () => {
                        // Clear any existing leave message when leave type changes
                        setLeaveMessage(null);
                    }
                })}
                className="px-2 rounded-md py-2 border w-[90%]"
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
                          className="text-[#373857] text-[16px]"
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
                            className="p-2 rounded-md border w-[90%] text-[14px]"
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
                            className="text-[#373857] min-w-fit text-[16px]"
                          >
                            Start Date
                          </label>
                          <input
                            type="date"
                            id="from_date"
                            {...register("from_date")}
                            className="block w-full rounded-md border p-2"
                            onChange={(e) => {
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
                        </div>
                        <div className="w-[90%] flex flex-col gap-4 ">
                          <label
                            htmlFor="to_date"
                            className="text-[#373857] min-w-fit text-[16px]"
                          >
                            End Date
                          </label>
                          <input
                            type="date"
                            id="to_date"
                            {...register("to_date")}
                            className="block w-full rounded-md border p-2"
                            onChange={(e) => {
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
                        </div>
                        <div className="w-full flex flex-col gap-4">
                          <label
                            htmlFor="reason"
                            className="text-[#373857] text-lg min-w-fit text-[16px]"
                          >
                            Reason
                          </label>
                          <Input
                            type="text"
                            id="reason"
                            {...register("reason")}
                            className="block w-[90%] rounded-md h-[5rem] p-2 border text-[14px]"
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
                            const isDisabled = holidayDate < new Date(); // Disable if the date is before today

                            return (
                              <option
                                key={index}
                                value={holiday.date}
                                disabled={isDisabled}
                              >
                                {formattedDisplayDate} - {holiday.description}
                              </option>
                            );
                          })}
                      </select>
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
          {errors.from_date && (
            <p className="text-red-500">{errors.from_date.message}</p>
          )}
          {errors.to_date && (
            <p className="text-red-500">{errors.to_date.message}</p>
          )}
          {errors.reason && (
            <p className="text-red-500">{errors.reason.message}</p>
          )}

          {(backendError || leaveMessage) && (
            <p className="text-red-500 mt-4">{backendError || leaveMessage}</p>
          )}

          {dateError && <p className="text-red-500">{dateError}</p>}

          {leave_type !== "maternity_leave" ||
          (leave_type === "maternity_leave" &&
            leaveBalance.maternity_leave > 0) ? (
            <div className="flex w-[90%] justify-end">
              <Button type="submit" className="mt-4">
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

