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
import Image from 'next/image';

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
        } catch (error) {
            console.error('Error rejecting leave request:', error);
        }
    };

    // const handleNextPage = () => {
    //     setCurrentPage((prevPage) => prevPage + 1);
    // };

    // const handlePrevPage = () => {
    //     setCurrentPage((prevPage) => prevPage - 1);
    // };

    // Calculate start and end indexes based on currentPage
    // const startIndex = (currentPage - 1) * 5;
    // const endIndex = startIndex + 5;

    return (
        <main className='overflow-hidden mx-auto '>
            <div className='min-w-[400px]  '>
                <h1 className='text-[22px] text-md font-bold'>Leave Requests</h1>
                <div className='min-w-[350px] rounded-lg p-3'>
                    <div className="bg-white mt-2  p-5 overflow-clip">
                        <Table className=" ">
                            <TableHeader className='bg-[#F7F7F7] h-[60px]'>
                                <TableRow className=' text-[16px] font-bold text-[#333843]'>
                                    <TableHead className="w-[100px] text-[16px] font-bold text-[#333843]">S.No</TableHead>
                                    <TableHead className='text-[16px] font-bold text-[#333843]'>Name</TableHead>
                                    <TableHead className='text-[16px] font-bold text-[#333843]'>Leave Type</TableHead>
                                    <TableHead className='text-[16px] font-bold text-[#333843]'>From Date   </TableHead>
                                    <TableHead className='text-[16px] font-bold text-[#333843]'>To Date   </TableHead>
                                    <TableHead className='text-[16px] font-bold text-[#333843]'>Total Days</TableHead>
                                    <TableHead className='text-[16px] font-bold text-[#333843]'>Reject</TableHead>
                                    <TableHead className='text-[16px] font-bold text-[#333843]'>Approve</TableHead>
                                     
                                </TableRow>
                            </TableHeader>
                            <TableBody className='text-[#667085]'> 
                                {leavedata.slice(startIndex, endIndex).map((data, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{startIndex + index + 1}</TableCell>
                                        <TableCell>{capitalizeWords(data.emp_name)}</TableCell>
                                        <TableCell>{capitalizeWords(replaceUnderscore(data.leave_type))}</TableCell>
                                        <TableCell>{formatDate(data.from_date)}</TableCell>
                                        <TableCell>{formatDate(data.to_date)}</TableCell>
                                        <TableCell>{data.total_days}</TableCell>
                                            <TableCell>
                                            <IoIosClose className='text-red-500 text-2xl' onClick={() => {
                                                const reason = prompt('Enter reason for rejection:');
                                                if (reason) {
                                                    handleRejectClick(data.leave_request_id, reason);
                                                }
                                            }} />
                                        </TableCell>
                                        <TableCell>
                                            <button onClick={() => handleApproveClick(data.leave_request_id)}>
                                                <TiTick className='text-green-500 text-xl' />
                                            </button>
                                        </TableCell>
                                     
                                    </TableRow>
                                ))}
                            </TableBody>

                        </Table>
                        {/* <div className="flex w-full justify-end gap-2 mt-4">
                            <button
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                className={`flex items-center justify-center h-[40px] w-[40px] bg-[#D9D9D9] border-2 border-[#EAEBF1]'  ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <div className="logo h-[12px] relative w-[12px]  object-contain"   >

                                    <Image src='/imgs/left-arrow.svg' alt='logo' layout="fill" objectFit="contain" className=" h-[24px] w-[24px] object-contian" />

                                </div>
                            </button>
                            <button
                                onClick={handleNextPage}
                                disabled={endIndex >= leavedata.length}
                                className={`flex items-center justify-center h-[40px] w-[40px] bg-[#D9D9D9] border-2 border-[#EAEBF1]'  ${endIndex >= leavedata.length ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <div className="logo h-[12px] relative w-[12px]  object-contain"   >

                                    <Image src='/imgs/right-arrow.svg' alt='logo' layout="fill" objectFit="contain" className=" h-[24px] w-[24px] object-contian" />

                                </div>
                            </button>

                        </div> */}
                    </div>

                </div>
            </div>
        </main>
    );
}

export default Page;
