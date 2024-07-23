import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { postLeave_req, getEmp_leave_balence, getAllOptionalHolidays, getAllCompulsoryHolidays, getAll_leave_req } from "../actions";
import { useSelector } from "react-redux";

// Define the validation schema using zod
const leaveSchema = z.object({
    leave_type: z.string().nonempty({ message: "Type of leave is required" }),
    session: z.string().nonempty({ message: "Leave duration is required" }),
    total_days: z.string().nonempty({ message: "Total days is required" }),
    from_date: z.string().refine((date) => {
        const selectedDate = new Date(date);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Remove the time part
        return selectedDate >= currentDate;
    }, {
        message: "Start date must be today or later"
    }),
    to_date: z.string(),
    reason: z.string().min(20, { message: "Reason must be at least 20 characters" }),
}).superRefine((data, ctx) => {
    const from_date = new Date(data.from_date);
    const to_date = new Date(data.to_date);

    if (to_date < from_date) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "End date must be the same as or after the start date",
            path: ["to_date"],
        });
    }

    if ((data.session === "FN" || data.session === "AN") && from_date.getTime() !== to_date.getTime()) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "For half-day leave, start date and end date must be the same",
            path: ["to_date"],
        });
    }
});

const LeaveForm = ({ fetchLeaveBalanceById }) => {
    const user = useSelector(state => state.user.userDetails);
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset
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
    const [compulsaryHolidays, setCompulsaryHolidays] = useState([])
    const [appliedOptionalLeaves, setAppliedOptionalHolidays] = useState([])

    useEffect(() => {
        const fetchLeaveBalence = async () => {
            const resData = await getEmp_leave_balence(user.user_id || null);
            setLeaveBalance(resData);
        };
        const fetchOptionHoliday = async () => {
            const resData = await getAllOptionalHolidays();
            const holidays = resData.map(item => new Date(item.date).toLocaleDateString('en-CA'));
            setOptionHolidays(holidays);
        };
        const fetchCompulsaryHoliday = async () => {
            const resData = await getAllCompulsoryHolidays();
            const holidays = resData.map(item => new Date(item.date).toLocaleDateString('en-CA'));
            setCompulsaryHolidays(holidays);
        };

        const fetchAllLeaveRequest = async () => {
            const resData = await getAll_leave_req();
            const appliedOptionalLeaves = resData
                .filter(item => item.user_id === user.user_id) // Filter for current user
                .filter(item => item.leave_type == 'optional_leave')
                .map(item => new Date(item.from_date).toLocaleDateString('en-CA'));
             setAppliedOptionalHolidays(appliedOptionalLeaves)
        }

        fetchLeaveBalence();
        fetchOptionHoliday();
        fetchCompulsaryHoliday();
        fetchAllLeaveRequest();
    }, [user.user_id]); 
     

    const calculateTotalDays = (from_date, to_date) => {
        const start = new Date(from_date);
        const end = new Date(to_date);
        let count = 0;

        while (start <= end) {
            const day = start.getDay();
            const formattedDate = start.toLocaleDateString('en-CA');

            if (day !== 0 && day !== 6 && !compulsaryHolidays.includes(formattedDate) && !appliedOptionalLeaves.includes(from_date)) {
                count++;
            }

            start.setDate(start.getDate() + 1);
        }

        return count;
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
        } else if (from_date && to_date) {
            const days = calculateTotalDays(from_date, to_date);
            setTotalDays(days);
            setValue("total_days", days.toString());
        }
    }, [session, from_date, to_date, leave_type, optional_date, setValue]);

    const onSubmit = async (data) => {
        const leaveType = data.leave_type;
        const totalDaysRequested = totalDays;
        const availableBalance = leaveBalance[leaveType] || 0;

        if (totalDaysRequested > availableBalance) {
            alert(`Requested leave exceeds available balance. You have ${availableBalance} days left for ${leaveType.replace('_', ' ')}.`);
            return;
        }

        data.total_days = totalDaysRequested;
        data.user_id = user.user_id || null;
        data.emp_name = user.user_id || null;

        const result = await postLeave_req(data);

        if (result) {
            reset(); // Reset the form on successful response
            setTotalDays(0); // Reset the total days
            alert("Form submitted successfully.");
            fetchLeaveBalanceById();
        } else {
            alert("There was an error submitting the form. Please check your leave balance.");
            console.error('There was an error submitting the form');
        }
    };
  return (
    <div className="flex p-5 w-[65%] h-full ">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className=" flex flex-col p-5 w-full h-full  gap-5 border-r border-r-[#DCDCDC]"
      >
        <p className=" text-2xl font-medium text-[#06072D] ">Leave Form</p>
        <div className="h-[90%] w-full flex flex-col  items-start">
          <div className=" flex flex-col w-full gap-4 ">
            <label htmlFor="leave_type" className=" text-[#373857] text-lg">
              Type of Leave{" "}
            </label>
            <div className=" w-full ">
              <select
                id="leave_type"
                {...register("leave_type")}
                className=" px-2 py-2 border w-[90%] "
              >
                <option value="" className="text-[#99A0B0]">
                  Select type of leave
                </option>
                <option value="sick_leave">Sick Leave</option>
                <option value="earned_leave">Earned Leave</option>
                <option value="optional_leave">Optional Leave</option>
                <option value="maternity_leave">Maternity Leave</option>
                <option value="loss_of_pay">Loss Of Pay</option>
                <option value="work_from_home">Work From Home</option>
              </select>
            </div>

            {leave_type === "optional_leave" ? (
              <div className="w-full flex flex-col gap-4">
                <label htmlFor="optional_date" className="text-[#373857] text-lg">
                  Optional Holiday Date {" "}
                </label>
                <select
                  id="optional_date"
                  {...register("optional_date")}
                  className="block  w-[90%]  p-2 border"
                >
                  <option value="">Select optional holiday</option>
                  {optionHolidays.map((date, index) => (
                    <option key={index} value={date}>
                      {date}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <>
                {" "}
                <div className="w-full flex flex-col gap-4">
                  <label htmlFor="session" className="text-[#373857] text-lg">
                    Session :{" "}
                  </label>
                  <div className="w-full">
                    <select
                      id="session"
                      {...register("session")}
                      className="p-2  border w-[90%]"
                    >
                      <option value="full_day">Full Day</option>
                      <option value="FN">FN</option>
                      <option value="AN">AN</option>
                    </select>
                  </div>
                </div>
                <div className="w-full flex flex-col gap-4">
                  <label
                    htmlFor="from_date"
                    className="text-[#373857] text-lg min-w-fit"
                  >
                    Start Date :{" "}
                  </label>
                  <Input
                    type="date"
                    id="from_date"
                    {...register("from_date")}
                    className="block w-[90%] p-2 border"
                  />
                </div>
                <div className="w-full flex flex-col gap-4">
                  <label
                    htmlFor="to_date"
                    className="text-[#373857] text-lg min-w-fit"
                  >
                    End Date :{" "}
                  </label>
                  <Input
                    type="date"
                    id="to_date"
                    {...register("to_date")}
                    className="block w-[90%]  p-2 border"
                    disabled={session === "FN" || session === "AN"}
                  />
                </div>
              </>
            )}

            <div className="w-full flex flex-col gap-4">
              <label
                htmlFor="reason"
                className="text-[#373857] text-lg min-w-fit"
              >
                Reason
              </label>
              <Input
                type="text"
                id="reason"
                {...register("reason")}
                className="block w-[90%] h-[5rem] p-2 border"
              />
            </div>
          </div>
          {totalDays > 0 && <p className="my-3">Total days: {totalDays}</p>}

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

          <div className="flex w-[90%] justify-end">
            <Button type="submit" className="mt-4">
              Submit
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LeaveForm;
