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
import { capitalizeWords, replaceUnderscore } from '../../../utils';

const Page = () => {
    const [leavedata, setLeaveData] = useState([]); // State to store leave requests
    const [currentPage, setCurrentPage] = useState(1); // State for current page

    const fetchLeaveData = async () => {
        const data = await getAll_leave_req();
        setLeaveData(data);
    };

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
            console.log(data)
            alert("Leave Approved Successfully");
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

    const handleNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => prevPage - 1);
    };

    // Calculate start and end indexes based on currentPage
    const startIndex = (currentPage - 1) * 5;
    const endIndex = startIndex + 5;

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
                                    <TableHead className='text-black'>User Name</TableHead>
                                    <TableHead className='text-black'>Leave Type</TableHead>
                                    <TableHead className='text-black'>From Date <br /> <div className='text-gray-400 leading-0 text-[8px]'> YYYY/MM/DD</div> </TableHead>
                                    <TableHead className='text-black'>To Date</TableHead>
                                    <TableHead className='text-black'>Total Days</TableHead>
                                    <TableHead className='text-black'>Approve</TableHead>
                                    <TableHead className='text-black'>Reject</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {leavedata.slice(startIndex, endIndex).map((data, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{startIndex + index + 1}</TableCell>
                                        <TableCell>{capitalizeWords(data.emp_name)}</TableCell>
                                        <TableCell>{capitalizeWords(replaceUnderscore(data.leave_type))}</TableCell>
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
                    <div className="flex justify-between mt-4">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className={`bg-blue-500 text-white px-3 py-1 rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <IoIosArrowBack className='text-xl' />
                            Prev
                        </button>
                        <button
                            onClick={handleNextPage}
                            disabled={endIndex >= leavedata.length}
                            className={`bg-blue-500 text-white px-3 py-1 rounded ${endIndex >= leavedata.length ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            Next
                            <IoIosArrowForward className='text-xl' />
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Page;
