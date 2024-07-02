"use client";
import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../../components/ui/table";
import { RiArrowDropDownLine } from "react-icons/ri";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoIosClose } from "react-icons/io";
import { TiTick } from "react-icons/ti";
import { getAll_leave_req, getEmp_leave_balence } from '../../../actions';
import LeaveReqTable from '../../../components/LeaveReqTable';
import { API } from '../../../config/index';

const Page = () => {
    const [leavedata, setLeaveData] = useState([]); // State to store leave requests

    const fetchLeaveData = async () => {
        const data = await getAll_leave_req();
        setLeaveData(data);
    };


    const fetchData = async () => {
        const resData = await getEmp_leave_balence(localStorage.getItem("user_id") || null)
    }

    useEffect(() => {
        fetchLeaveData();
    }, []);


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Returns date in YYYY-MM-DD format
    };

    const handleApproveClick = async (leaveRequestId) => {
        try {
            const response = await fetch(`${API}/leave/update-leave-status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ leave_request_id: leaveRequestId, status: 'approved' }),
            });
            const data = await response.json();
            console.log(data);
            fetchData()
            alert("Leave Aprroved Successfully")
            fetchLeaveData();
        } catch (error) {
            console.error('Error approving leave request:', error);
        }
    };

    const handleRejectClick = async (leaveRequestId, reason) => {
        try {
            const response = await fetch(`${API}/leave/update-leave-status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ leave_request_id: leaveRequestId, status: 'rejected', reason: reason }),
            });
            const data = await response.json();
            alert("Leave Rejected Successfully");
            fetchLeaveData();
            console.log(data);
        } catch (error) {
            console.error('Error rejecting leave request:', error);
        }
    };

    return (
        <main className='overflow-hidden container mx-auto py-5 p-5'>
            <div className='min-w-[400px] mt-4'>
                <h1 className='text-[22px] text-md font-bold'>Leave Requests</h1>
                <div className='min-w-[350px] rounded-lg p-3'>
                    <div className="rounded-md border mt-2 bg-white shadow-md overflow-clip">
                        <Table className="shadow-lg">
                            <TableHeader className='bg-blue-300 text-black'>
                                <TableRow className='text-black'>
                                    <TableHead className="w-[100px] text-black">S.No</TableHead>
                                    <TableHead className='text-black'>Username</TableHead>
                                    <TableHead className='text-black'>LeaveType</TableHead>
                                    <TableHead className='text-black'>From Date</TableHead>
                                    <TableHead className='text-black'>To Date</TableHead>
                                    <TableHead className='text-black'>Total Days</TableHead>
                                    <TableHead className='text-black'>Approve</TableHead>
                                    <TableHead className='text-black'>Reject</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {leavedata.map((data, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{index + 1}</TableCell>
                                        <TableCell>{data.emp_name}</TableCell>
                                        <TableCell>{data.leave_type}</TableCell>
                                        <TableCell>{formatDate(data.from_date)}</TableCell>
                                        <TableCell>{formatDate(data.to_date)}</TableCell>
                                        <TableCell>{data.total_days}</TableCell>
                                        <TableCell>
                                            <button onClick={() => handleApproveClick(data.leave_request_id)}>
                                                <TiTick className='text-green-500 text-xl' />
                                            </button>
                                        </TableCell>
                                        <TableCell>
                                            <IoIosClose className='text-red-500 text-2xl' onClick={() => {
                                                const reason = prompt('Enter reason for rejection:');
                                                if (reason) {
                                                    handleRejectClick(data.leave_request_id, reason);
                                                }
                                            }} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <div className='flex justify-between items-center mt-4 px-3 border-t border-gray-300'>
                        <h1 className='text-sm'>Showing 1 to {leavedata.length} of {leavedata.length} entries</h1>
                        <div className='flex items-center'>
                            <button className='p-2'><IoIosArrowBack /></button>
                            <p className='px-2 bg-gray-500 text-white'>1</p>
                            <button className='p-2'><IoIosArrowForward /></button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Page;
