import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

import { postLeave_req, getEmp_leave_balence } from "../actions";
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

    if ((data.session === "morning_section" || data.session === "afternoon_section") && from_date.getTime() !== to_date.getTime()) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "For half-day leave, start date and end date must be the same",
            path: ["to_date"],
        });
    }
});

const LeaveForm = ({ fetchLeaveBalanceById }) => {
    
    const user = useSelector(state => state.user.userDetails)
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

    const [totalDays, setTotalDays] = useState(0);
    const [leaveBalance, setLeaveBalance] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const resData = await getEmp_leave_balence(user.user_id || null);
            setLeaveBalance(resData);
        };
        fetchData();
    }, []);

    // Function to calculate total days excluding weekends
    const calculateTotalDays = (from_date, to_date) => {
        const start = new Date(from_date);
        const end = new Date(to_date);
        let count = 0;
        while (start <= end) {
            const day = start.getDay();
            if (day !== 0 && day !== 6) { // Exclude Sunday (0) and Saturday (6)
                count++;
            }
            start.setDate(start.getDate() + 1);
        }
        return count;
    };

    const from_date = watch("from_date");
    const to_date = watch("to_date");
    const session = watch("session");

    useEffect(() => {
        if (session === "morning_section" || session === "afternoon_section") {
            setValue("to_date", from_date);
            setTotalDays(0.5);
            setValue("total_days", "0.5");
        } else if (from_date && to_date) {
            const days = calculateTotalDays(from_date, to_date);
            setTotalDays(days);
            setValue("total_days", days.toString());
        }
    }, [session, from_date, to_date, setValue]);

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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex justify-between">
                <div className="leave-type flex items-center">
                    <label htmlFor="leave_type" className="font-bold">Type of Leave : </label>
                    <div>
                        <select
                            id="leave_type"
                            {...register("leave_type")}
                            className="mx-1 p-2 rounded-md border-2"
                        >
                            <option value="">Select type of leave</option>
                            <option value="sick_leave">Sick Leave</option>
                            <option value="earned_leave">Earned Leave</option>
                            <option value="optional_leave">Optional Leave</option>
                            <option value="maternity_leave">Maternity Leave</option>
                            <option value="loss_of_pay">Loss Of Pay</option>
                            <option value="work_from_home">Work From Home</option>
                        </select>
                    </div>
                </div>
                <div className="leave-duration flex items-center">
                    <label htmlFor="session" className="font-bold">Leave Duration : </label>
                    <div>
                        <select
                            id="session"
                            {...register("session")}
                            className="mx-1 p-2 rounded-md border-2"
                        >
                            <option value="full_day">Full Day</option>
                            <option value="morning_section">Morning Section</option>
                            <option value="afternoon_section">Afternoon Section</option>
                        </select>
                    </div>
                </div>
                <div className="start-date flex items-center">
                    <label htmlFor="from_date" className="font-bold min-w-fit">Start Date : </label>
                    <Input
                        type="date"
                        id="from_date"
                        {...register("from_date")}
                        className="block w-full mx-1 p-2 border-2"
                    />
                </div>
                <div className="end-date flex items-center">
                    <label htmlFor="to_date" className="font-bold min-w-fit">End Date : </label>
                    <Input
                        type="date"
                        id="to_date"
                        {...register("to_date")}
                        className="block w-full mx-1 p-2 border-2"
                        disabled={session === "morning_section" || session === "afternoon_section"}
                    />
                </div>
            </div>

            <div className="reason">
                <label htmlFor="reason" className="font-bold">Reason</label>
                <Input
                    type="text"
                    id="reason"
                    {...register("reason")}
                    className="block w-full mx-1 p-2 border-2"
                />
            </div>
            {totalDays > 0 && (
                <p>Total days: {totalDays}</p>
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

            <div className="flex w-full justify-end">
                <Button type="submit" className="mt-4">
                    Submit
                </Button>
            </div>
        </form>
    );
};

export default LeaveForm;