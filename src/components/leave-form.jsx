import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";
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
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calender";

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
      const days = calculateTotalDays(from_date, to_date);
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

  const calculateTotalDays = (from_date, to_date) => {
    const start = new Date(from_date);
    const end = new Date(to_date);
    let count = 0;

    while (start <= end) {
      const day = start.getDay();
      const formattedDate = start.toISOString().split("T")[0];

      if (
        day !== 0 &&
        day !== 6 &&
        !compulsaryHolidays.includes(formattedDate) &&
        !appliedOptionalLeaves.includes(formattedDate)
      ) {
        count++;
      }

      start.setDate(start.getDate() + 1);
    }

    return count;
  };

  const onSubmit = async (data) => {
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

    if (totalDaysRequested > availableBalance) {
      setLeaveMessage(
        `Requested leave exceeds available balance. You have ${availableBalance} days left for ${leaveType.replace(
          "_",
          " "
        )}.`
      );
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
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
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
                {...register("leave_type")}
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
                            {...register("session")}
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
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !from_date && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="h-4 w-4 mr-2" />
                                {from_date ? (
                                  format(new Date(from_date), "dd-MM-yyyy")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={
                                  from_date ? new Date(from_date) : undefined
                                }
                                onSelect={(date) => {
                                  if (date) {
                                    const selectedDate = new Date(
                                      Date.UTC(
                                        date.getFullYear(),
                                        date.getMonth(),
                                        date.getDate()
                                      )
                                    );
                                    setValue(
                                      "from_date",
                                      selectedDate.toISOString().split("T")[0]
                                    );
                                    if (session === "FN" || session === "AN") {
                                      setValue(
                                        "to_date",
                                        selectedDate.toISOString().split("T")[0]
                                      );
                                    }
                                  }
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="w-[90%] flex flex-col gap-4 ">
                          <label
                            htmlFor="to_date"
                            className="text-[#373857] min-w-fit text-[16px]"
                          >
                            End Date
                          </label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !to_date && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="h-4 w-4 mr-2" />
                                {to_date ? (
                                  format(new Date(to_date), "dd-MM-yyyy")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={
                                  to_date ? new Date(to_date) : undefined
                                }
                                onSelect={(date) => {
                                  if (date) {
                                    const selectedDate = new Date(
                                      Date.UTC(
                                        date.getFullYear(),
                                        date.getMonth(),
                                        date.getDate()
                                      )
                                    );
                                    setValue(
                                      "to_date",
                                      selectedDate.toISOString().split("T")[0]
                                    );
                                  }
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
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
                        {optionHolidays.map((holiday, index) => {
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
